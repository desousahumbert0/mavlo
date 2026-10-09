"use client";

import { useEffect, useState } from "react";
import FileDrop from "@/components/ui/FileDrop";
import { estimateMp3Bytes, floatToInt16, mp3Channels } from "@/lib/audio";
import { downloadBlob } from "@/lib/download";
import { fileBaseName, formatBytes, formatDuration } from "@/lib/format";

const MAX_BYTES = 500 * 1024 * 1024;
const BLOCK = 1152;
const BITRATES = [96, 128, 192, 256, 320];
const isVideo = (f: File) => /^(video|audio)\//.test(f.type) || /\.(mp4|m4v|webm|mov|m4a)$/i.test(f.name);

type Result = { blob: Blob; name: string; seconds: number; url: string };

export default function Mp4ToMp3() {
  const [file, setFile] = useState<File | null>(null);
  const [kbps, setKbps] = useState(192);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  function pick(list: File[]) {
    const f = list[0];
    setResult(null);
    setError("");
    if (!isVideo(f)) return setError("Please choose an MP4 or WebM video file.");
    if (f.size > MAX_BYTES) return setError("This file is larger than 500 MB, which is too much to convert inside a browser. Try a shorter or smaller video.");
    setFile(f);
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      setStage("Reading the audio from the video…");
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) throw new Error("This browser does not support audio decoding. Try a current version of Chrome, Edge, Firefox or Safari.");
      const ctx = new Ctx();
      let audio: AudioBuffer;
      try {
        audio = await ctx.decodeAudioData(await file.arrayBuffer());
      } catch {
        throw new Error("The audio in this file could not be read. The video may have no sound, or use an audio format this browser cannot play. Try another browser or file.");
      } finally {
        void ctx.close();
      }

      setStage("Loading the MP3 encoder…");
      const { Mp3Encoder } = await import("@breezystack/lamejs");
      const channels = mp3Channels(audio.numberOfChannels);
      const encoder = new Mp3Encoder(channels, audio.sampleRate, kbps);
      const left = audio.getChannelData(0);
      const right = channels === 2 ? audio.getChannelData(1) : null;

      setStage("Converting to MP3…");
      const parts: Uint8Array[] = [];
      for (let i = 0, n = 0; i < left.length; i += BLOCK, n++) {
        const l = floatToInt16(left.subarray(i, i + BLOCK));
        const chunk = right ? encoder.encodeBuffer(l, floatToInt16(right.subarray(i, i + BLOCK))) : encoder.encodeBuffer(l);
        if (chunk.length > 0) parts.push(new Uint8Array(chunk));
        if (n % 150 === 0) {
          setProgress(i / left.length);
          await new Promise((r) => setTimeout(r, 0));
        }
      }
      const tail = encoder.flush();
      if (tail.length > 0) parts.push(new Uint8Array(tail));

      const blob = new Blob(parts as BlobPart[], { type: "audio/mpeg" });
      setProgress(1);
      setResult({ blob, name: `${fileBaseName(file.name)}.mp3`, seconds: audio.duration, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "The conversion failed.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }

  return (
    <div className="space-y-5">
      <FileDrop accept="video/mp4,video/webm,audio/mp4,.mp4,.m4v,.webm,.mov,.m4a" multiple={false} onFiles={pick} title={file ? "Choose a different video" : "Drop a video here"} hint="MP4 or WebM, up to 500 MB. Converted on your device." buttonLabel="Choose video" />
      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      {file && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {file.name} · {formatBytes(file.size)}
          </p>
          <div className="max-w-xs">
            <label className="label" htmlFor="mp3-kbps">
              MP3 quality
            </label>
            <select id="mp3-kbps" className="input" value={kbps} disabled={busy} onChange={(e) => setKbps(Number(e.target.value))}>
              {BITRATES.map((b) => (
                <option key={b} value={b}>
                  {b} kbps{b === 128 ? " (speech)" : b === 192 ? " (recommended)" : b === 320 ? " (best)" : ""}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={convert}>
            {busy ? "Converting…" : "Convert to MP3"}
          </button>
          {busy && (
            <div aria-live="polite">
              <p className="text-sm text-muted">{stage}</p>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Conversion progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                <div className="h-full bg-brand" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-3 rounded-xl border border-brand/40 bg-brand/5 p-4" aria-live="polite">
          <p>
            <span className="font-semibold">Done.</span> {formatDuration(result.seconds)} · {formatBytes(result.blob.size)} (about {formatBytes(estimateMp3Bytes(result.seconds, kbps))} expected at {kbps} kbps)
          </p>
          <audio controls src={result.url} className="w-full" />
          <button type="button" className="btn btn-primary" onClick={() => downloadBlob(result.blob, result.name)}>
            Download {result.name}
          </button>
        </div>
      )}
    </div>
  );
}
