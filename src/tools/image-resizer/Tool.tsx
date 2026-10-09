"use client";

import { useEffect, useState } from "react";
import FileDrop from "@/components/ui/FileDrop";
import { downloadBlob } from "@/lib/download";
import { fileBaseName, formatBytes, formatNumber, parseNumber } from "@/lib/format";
import { extensionFor, readImageSize, resizeImage, type OutputMime } from "@/lib/image";

type Unit = "px" | "percent";
type Format = "same" | OutputMime;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [orig, setOrig] = useState<{ w: number; h: number } | null>(null);
  const [unit, setUnit] = useState<Unit>("px");
  const [lock, setLock] = useState(true);
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [format, setFormat] = useState<Format>("same");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ blob: Blob; w: number; h: number; name: string; url: string } | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  async function load(list: File[]) {
    const f = list.find((x) => ACCEPTED.includes(x.type));
    setError(f ? "" : "Please choose a JPG, PNG or WebP image. For HEIC photos use the HEIC to JPG tool first.");
    if (!f) return;
    try {
      const size = await readImageSize(f);
      setFile(f);
      setOrig({ w: size.width, h: size.height });
      setUnit("px");
      setW(String(size.width));
      setH(String(size.height));
      setResult(null);
    } catch {
      setError("This image could not be read. It may be damaged.");
    }
  }

  function changeW(v: string) {
    setW(v);
    const n = parseNumber(v);
    if (lock && orig && n !== null) setH(unit === "px" ? String(Math.max(1, Math.round((n * orig.h) / orig.w))) : v);
  }
  function changeH(v: string) {
    setH(v);
    const n = parseNumber(v);
    if (lock && orig && n !== null) setW(unit === "px" ? String(Math.max(1, Math.round((n * orig.w) / orig.h))) : v);
  }
  function switchUnit(next: Unit) {
    if (!orig || next === unit) return;
    const wn = parseNumber(w);
    const hn = parseNumber(h);
    if (next === "percent") {
      setW(wn ? String(Math.round((wn / orig.w) * 10000) / 100) : "100");
      setH(hn ? String(Math.round((hn / orig.h) * 10000) / 100) : "100");
    } else {
      setW(String(Math.max(1, Math.round((orig.w * (wn ?? 100)) / 100))));
      setH(String(Math.max(1, Math.round((orig.h * (hn ?? 100)) / 100))));
    }
    setUnit(next);
  }

  const wn = parseNumber(w);
  const hn = parseNumber(h);
  const target =
    orig && wn !== null && hn !== null && wn > 0 && hn > 0
      ? unit === "px"
        ? { w: Math.round(wn), h: Math.round(hn) }
        : { w: Math.max(1, Math.round((orig.w * wn) / 100)), h: Math.max(1, Math.round((orig.h * hn) / 100)) }
      : null;

  async function run() {
    if (!file || !target) return;
    setBusy(true);
    setError("");
    try {
      const mime: OutputMime = format === "same" ? (file.type as OutputMime) : format;
      const blob = await resizeImage(file, { width: target.w, height: target.h, mime, quality: quality / 100 });
      setResult({ blob, w: target.w, h: target.h, name: `${fileBaseName(file.name)}-${target.w}x${target.h}.${extensionFor(mime)}`, url: URL.createObjectURL(blob) });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "The image could not be resized.");
    } finally {
      setBusy(false);
    }
  }

  const lossy = format === "image/jpeg" || format === "image/webp" || (format === "same" && file?.type !== "image/png");

  return (
    <div className="space-y-5">
      <FileDrop accept="image/jpeg,image/png,image/webp" multiple={false} onFiles={load} title={file ? "Choose a different image" : "Drop an image here"} hint="JPG, PNG or WebP. Resized on your device." buttonLabel="Choose image" />
      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      {file && orig && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {file.name} · {formatNumber(orig.w)} × {formatNumber(orig.h)} px · {formatBytes(file.size)}
          </p>
          <div className="seg" role="group" aria-label="Unit">
            <button type="button" aria-pressed={unit === "px"} onClick={() => switchUnit("px")}>
              Pixels
            </button>
            <button type="button" aria-pressed={unit === "percent"} onClick={() => switchUnit("percent")}>
              Percent
            </button>
          </div>
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div>
              <label className="label" htmlFor="ir-w">
                Width ({unit === "px" ? "px" : "%"})
              </label>
              <input id="ir-w" className="input" inputMode="decimal" value={w} onChange={(e) => changeW(e.target.value)} />
            </div>
            <button type="button" className="btn" aria-pressed={lock} aria-label={lock ? "Aspect ratio locked. Click to unlock" : "Aspect ratio unlocked. Click to lock"} onClick={() => setLock((l) => !l)}>
              {lock ? "🔒 Locked" : "🔓 Free"}
            </button>
            <div>
              <label className="label" htmlFor="ir-h">
                Height ({unit === "px" ? "px" : "%"})
              </label>
              <input id="ir-h" className="input" inputMode="decimal" value={h} onChange={(e) => changeH(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="ir-format">
                Output format
              </label>
              <select id="ir-format" className="input" value={format} onChange={(e) => setFormat(e.target.value as Format)}>
                <option value="same">Same as original</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="ir-quality">
                Quality: {quality}%
              </label>
              <input id="ir-quality" type="range" min={40} max={100} step={5} value={quality} disabled={!lossy} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[rgb(var(--brand))]" />
            </div>
          </div>
          {target && (
            <p className="text-sm" aria-live="polite">
              New size: <span className="font-semibold">{formatNumber(target.w)} × {formatNumber(target.h)} px</span>
              {target.w > orig.w || target.h > orig.h ? <span className="text-muted"> · enlarging makes the image bigger but not sharper</span> : null}
            </p>
          )}
          {!target && <p className="alert-error">Enter a width and a height greater than zero.</p>}
          <button type="button" className="btn btn-primary" disabled={busy || !target} onClick={run}>
            {busy ? "Resizing…" : "Resize image"}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-3 rounded-xl border border-brand/40 bg-brand/5 p-4" aria-live="polite">
          <p>
            <span className="font-semibold">Done.</span> {formatNumber(result.w)} × {formatNumber(result.h)} px · {formatBytes(result.blob.size)}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.url} alt="Resized preview" className="max-h-64 max-w-full rounded-lg border border-line bg-white object-contain" />
          <button type="button" className="btn btn-primary" onClick={() => downloadBlob(result.blob, result.name)}>
            Download {result.name}
          </button>
        </div>
      )}
    </div>
  );
}
