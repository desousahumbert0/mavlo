"use client";

import { useState } from "react";
import FileDrop from "@/components/ui/FileDrop";
import { bytesToBlob, downloadBlob } from "@/lib/download";
import { fileBaseName, formatBytes } from "@/lib/format";
import { createZip, uniqueNames } from "@/lib/zip";

type Format = "image/jpeg" | "image/png";
type Entry = { id: number; file: File; status: "pending" | "working" | "done" | "error"; blob?: Blob; outName?: string; error?: string };

let nextId = 1;
const isHeic = (f: File) => /\.(heic|heif)$/i.test(f.name) || /image\/hei[cf]/i.test(f.type);

export default function HeicToJpg() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);

  function addFiles(list: File[]) {
    setSkipped(list.filter((f) => !isHeic(f)).map((f) => f.name));
    const ok = list.filter(isHeic).map<Entry>((file) => ({ id: nextId++, file, status: "pending" }));
    if (ok.length) setEntries((prev) => [...prev, ...ok]);
  }

  async function convertAll() {
    setBusy(true);
    const ext = format === "image/jpeg" ? "jpg" : "png";
    let heic2any: typeof import("heic2any").default;
    try {
      heic2any = (await import("heic2any")).default;
    } catch {
      setEntries((prev) => prev.map((e) => ({ ...e, status: "error", error: "The converter could not be loaded. Check your connection and try again." })));
      setBusy(false);
      return;
    }
    const ids = entries.map((e) => e.id);
    for (const id of ids) {
      const current = entries.find((e) => e.id === id);
      if (!current) continue;
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "working", error: undefined } : e)));
      try {
        const out = await heic2any({ blob: current.file, toType: format, quality: quality / 100 });
        const blob = Array.isArray(out) ? out[0] : out;
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "done", blob, outName: `${fileBaseName(current.file.name)}.${ext}` } : e)));
      } catch (err) {
        const message = typeof err === "object" && err !== null && "message" in err ? String((err as { message: unknown }).message) : "";
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "error", error: message || "This file could not be converted. It may be damaged or not a real HEIC photo." } : e)));
      }
    }
    setBusy(false);
  }

  async function downloadZip() {
    const done = entries.filter((e) => e.blob && e.outName);
    const names = uniqueNames(done.map((e) => e.outName as string));
    const files = await Promise.all(done.map(async (e, i) => ({ name: names[i], data: new Uint8Array(await (e.blob as Blob).arrayBuffer()) })));
    downloadBlob(bytesToBlob(createZip(files), "application/zip"), "converted-photos.zip");
  }

  const doneCount = entries.filter((e) => e.status === "done").length;

  return (
    <div className="space-y-5">
      <FileDrop accept=".heic,.heif,image/heic,image/heif" onFiles={addFiles} title="Drop HEIC photos here" hint="HEIC or HEIF files from an iPhone or iPad. Converted on your device." buttonLabel="Choose HEIC photos" />
      {skipped.length > 0 && (
        <p className="alert-error" role="alert">
          Skipped (not HEIC or HEIF): {skipped.join(", ")}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="heic-format">
            Output format
          </label>
          <select id="heic-format" className="input" value={format} onChange={(e) => setFormat(e.target.value as Format)}>
            <option value="image/jpeg">JPG (smaller files)</option>
            <option value="image/png">PNG (lossless, large files)</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="heic-quality">
            JPG quality: {quality}%
          </label>
          <input id="heic-quality" type="range" min={50} max={100} step={5} value={quality} disabled={format === "image/png"} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[rgb(var(--brand))]" />
        </div>
      </div>

      {entries.length > 0 && (
        <div className="space-y-3" aria-live="polite">
          <ul className="divide-y divide-line rounded-xl border border-line">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.file.name}</p>
                  <p className={`text-sm ${e.status === "error" ? "text-danger" : "text-muted"}`}>
                    {e.status === "pending" && `Ready · ${formatBytes(e.file.size)}`}
                    {e.status === "working" && "Converting…"}
                    {e.status === "done" && e.blob && `${formatBytes(e.file.size)} → ${formatBytes(e.blob.size)}`}
                    {e.status === "error" && e.error}
                  </p>
                </div>
                {e.status === "done" && e.blob && e.outName && (
                  <button type="button" className="btn btn-sm" onClick={() => downloadBlob(e.blob as Blob, e.outName as string)}>
                    Download
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="btn" disabled={busy} onClick={() => setEntries([])}>
              Clear all
            </button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={convertAll}>
              {busy ? "Converting…" : doneCount > 0 ? "Convert again" : `Convert ${entries.length} ${entries.length === 1 ? "photo" : "photos"}`}
            </button>
            {doneCount > 1 && (
              <button type="button" className="btn" disabled={busy} onClick={downloadZip}>
                Download all (ZIP)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
