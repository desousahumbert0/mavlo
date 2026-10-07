"use client";

import { useEffect, useMemo, useState } from "react";
import FileDrop from "@/components/ui/FileDrop";
import { downloadBlob, bytesToBlob } from "@/lib/download";
import { fileBaseName, formatBytes } from "@/lib/format";
import { extensionFor, reencodeImage, type OutputMime } from "@/lib/image";
import { createZip, uniqueNames } from "@/lib/zip";

type Format = "auto" | "image/jpeg" | "image/webp";
type Item = {
  name: string;
  original: number;
  status: "working" | "done" | "error";
  blob?: Blob;
  outName?: string;
  size?: number;
  dims?: string;
  note?: string;
  error?: string;
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIDES = [
  { value: 0, label: "Original size" },
  { value: 3840, label: "3840 px" },
  { value: 2560, label: "2560 px" },
  { value: 1920, label: "1920 px (full HD)" },
  { value: 1280, label: "1280 px" },
  { value: 800, label: "800 px" },
];

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<Format>("auto");
  const [maxSide, setMaxSide] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  useEffect(() => {
    if (files.length === 0) {
      setItems([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setItems(files.map((f) => ({ name: f.name, original: f.size, status: "working" as const })));
      for (let i = 0; i < files.length; i++) {
        if (cancelled) return;
        const file = files[i];
        let item: Item;
        try {
          const mime: OutputMime = format === "auto" ? (file.type === "image/png" ? "image/png" : (file.type as OutputMime)) : format;
          const r = await reencodeImage(file, { mime, quality: quality / 100, maxSide: maxSide || null });
          const keepOriginal = r.blob.size >= file.size && !r.resized && mime === file.type;
          item = keepOriginal
            ? { name: file.name, original: file.size, status: "done", blob: file, outName: file.name, size: file.size, dims: `${r.width} × ${r.height}`, note: "Already well optimised, so the original is kept." }
            : {
                name: file.name,
                original: file.size,
                status: "done",
                blob: r.blob,
                outName: `${fileBaseName(file.name)}-compressed.${extensionFor(mime)}`,
                size: r.blob.size,
                dims: `${r.width} × ${r.height}`,
                note: r.blob.size >= file.size ? "Larger than the original. Try a lower quality or a smaller size." : undefined,
              };
        } catch (e) {
          item = { name: file.name, original: file.size, status: "error", error: e instanceof Error ? e.message : "This image could not be read." };
        }
        if (cancelled) return;
        setItems((prev) => prev.map((x, j) => (j === i ? item : x)));
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [files, quality, format, maxSide]);

  const totals = useMemo(() => {
    const done = items.filter((i) => i.status === "done" && i.size !== undefined);
    const before = done.reduce((s, i) => s + i.original, 0);
    const after = done.reduce((s, i) => s + (i.size ?? 0), 0);
    return { count: done.length, before, after, pct: before > 0 ? Math.round(((before - after) / before) * 100) : 0 };
  }, [items]);

  function addFiles(list: File[]) {
    const ok = list.filter((f) => ACCEPTED.includes(f.type));
    setRejected(list.filter((f) => !ACCEPTED.includes(f.type)).map((f) => f.name));
    if (ok.length) setFiles((prev) => [...prev, ...ok]);
  }

  async function downloadAll() {
    const done = items.filter((i) => i.blob && i.outName);
    const names = uniqueNames(done.map((i) => i.outName as string));
    const entries = await Promise.all(done.map(async (i, k) => ({ name: names[k], data: new Uint8Array(await (i.blob as Blob).arrayBuffer()) })));
    downloadBlob(bytesToBlob(createZip(entries), "application/zip"), "compressed-images.zip");
  }

  return (
    <div className="space-y-5">
      <FileDrop accept="image/jpeg,image/png,image/webp" onFiles={addFiles} title="Drop images here" hint="JPG, PNG or WebP. Processed on your device." buttonLabel="Choose images" />
      {rejected.length > 0 && (
        <p className="alert-error" role="alert">
          Skipped (unsupported type): {rejected.join(", ")}. Use JPG, PNG or WebP. For iPhone HEIC photos use the HEIC to JPG tool first.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="ic-quality">
            Quality: {quality}%
          </label>
          <input id="ic-quality" type="range" min={10} max={100} step={5} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[rgb(var(--brand))]" />
        </div>
        <div>
          <label className="label" htmlFor="ic-format">
            Output format
          </label>
          <select id="ic-format" className="input" value={format} onChange={(e) => setFormat(e.target.value as Format)}>
            <option value="auto">Keep original format</option>
            <option value="image/webp">WebP (smallest)</option>
            <option value="image/jpeg">JPEG</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="ic-max">
            Longest side
          </label>
          <select id="ic-max" className="input" value={maxSide} onChange={(e) => setMaxSide(Number(e.target.value))}>
            {MAX_SIDES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-3" aria-live="polite">
          <ul className="divide-y divide-line rounded-xl border border-line">
            {items.map((item, i) => (
              <li key={`${item.name}-${i}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  {item.status === "working" && <p className="text-sm text-muted">Compressing… (original {formatBytes(item.original)})</p>}
                  {item.status === "error" && <p className="text-sm text-danger">{item.error}</p>}
                  {item.status === "done" && item.size !== undefined && (
                    <p className="text-sm text-muted">
                      {formatBytes(item.original)} → <span className="font-semibold text-fg">{formatBytes(item.size)}</span> ({item.original > 0 ? Math.round(((item.original - item.size) / item.original) * 100) : 0}% smaller) · {item.dims}
                      {item.note ? ` · ${item.note}` : ""}
                    </p>
                  )}
                </div>
                {item.status === "done" && item.blob && item.outName && (
                  <button type="button" className="btn btn-sm" onClick={() => downloadBlob(item.blob as Blob, item.outName as string)}>
                    Download
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {totals.count > 0 && (
                <>
                  Total: {formatBytes(totals.before)} → <span className="font-semibold text-fg">{formatBytes(totals.after)}</span> ({totals.pct}% saved)
                </>
              )}
            </p>
            <div className="flex gap-2">
              <button type="button" className="btn" onClick={() => setFiles([])}>
                Clear all
              </button>
              <button type="button" className="btn btn-primary" disabled={totals.count === 0} onClick={downloadAll}>
                Download all (ZIP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
