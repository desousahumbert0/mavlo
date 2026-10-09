"use client";

import { useEffect, useRef, useState } from "react";
import FileDrop from "@/components/ui/FileDrop";
import { bytesToBlob, downloadBlob } from "@/lib/download";
import { formatBytes } from "@/lib/format";
import { reencodeImage } from "@/lib/image";
import { jpegOrientation } from "@/lib/jpeg";
import { layoutImage, type MarginMode, type PageMode } from "@/lib/pdf-layout";

type Entry = { id: number; file: File; url: string };

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
let nextId = 1;

export default function JpgToPdf() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>("a4");
  const [margin, setMargin] = useState<MarginMode>("small");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  // Thumbnails use object URLs; release them when the component goes away.
  const latest = useRef<Entry[]>([]);
  latest.current = entries;
  useEffect(() => () => latest.current.forEach((e) => URL.revokeObjectURL(e.url)), []);

  function addFiles(list: File[]) {
    setSkipped(list.filter((f) => !ACCEPTED.includes(f.type)).map((f) => f.name));
    const ok = list.filter((f) => ACCEPTED.includes(f.type)).map<Entry>((file) => ({ id: nextId++, file, url: URL.createObjectURL(file) }));
    if (ok.length === 0) return;
    setResult(null);
    setError("");
    setEntries((prev) => [...prev, ...ok]);
  }

  function move(index: number, delta: number) {
    setResult(null);
    setEntries((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(entry: Entry) {
    URL.revokeObjectURL(entry.url);
    setResult(null);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
  }

  async function create() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      const asJpeg = async (file: File) => new Uint8Array(await (await reencodeImage(file, { mime: "image/jpeg", quality: 0.95, maxSide: null })).blob.arrayBuffer());
      for (const e of entries) {
        const bytes = new Uint8Array(await e.file.arrayBuffer());
        let image;
        if (e.file.type === "image/png") {
          try {
            image = await pdf.embedPng(bytes);
          } catch {
            image = await pdf.embedPng(new Uint8Array(await (await reencodeImage(e.file, { mime: "image/png", quality: 1, maxSide: null })).blob.arrayBuffer()));
          }
        } else if (e.file.type === "image/jpeg" && jpegOrientation(bytes) === 1) {
          image = await pdf.embedJpg(bytes);
        } else {
          image = await pdf.embedJpg(await asJpeg(e.file));
        }
        const l = layoutImage(image.width, image.height, pageMode, margin);
        const page = pdf.addPage([l.pageW, l.pageH]);
        page.drawImage(image, { x: l.x, y: l.y, width: l.width, height: l.height });
      }
      const out = await pdf.save();
      setResult({ blob: bytesToBlob(out, "application/pdf"), pages: pdf.getPageCount() });
    } catch (err) {
      setError(`The PDF could not be created. ${err instanceof Error ? err.message : "One of the images may be damaged."}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <FileDrop accept="image/jpeg,image/png,image/webp" onFiles={addFiles} title="Drop images here" hint="JPG, PNG or WebP. Added in order; you can rearrange them below." buttonLabel="Choose images" />
      {skipped.length > 0 && (
        <p className="alert-error" role="alert">
          Skipped (unsupported type): {skipped.join(", ")}. Use JPG, PNG or WebP. HEIC photos can be converted with the HEIC to JPG tool first.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="jp-page">
            Page size
          </label>
          <select id="jp-page" className="input" value={pageMode} onChange={(e) => setPageMode(e.target.value as PageMode)}>
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
            <option value="fit">Same size as image</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="jp-margin">
            Margin
          </label>
          <select id="jp-margin" className="input" value={margin} onChange={(e) => setMargin(e.target.value as MarginMode)}>
            <option value="none">None</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="space-y-3">
          <ol className="divide-y divide-line rounded-xl border border-line">
            {entries.map((e, i) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="w-6 text-sm tabular-nums text-muted">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.url} alt="" className="h-12 w-12 rounded-md border border-line object-cover" width={48} height={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.file.name}</p>
                  <p className="text-sm text-muted">{formatBytes(e.file.size)}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" className="btn btn-sm" aria-label={`Move ${e.file.name} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button type="button" className="btn btn-sm" aria-label={`Move ${e.file.name} down`} disabled={i === entries.length - 1} onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <button type="button" className="btn btn-sm" aria-label={`Remove ${e.file.name}`} onClick={() => remove(e)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {entries.length} {entries.length === 1 ? "page" : "pages"} · {formatBytes(entries.reduce((s, e) => s + e.file.size, 0))}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn"
                disabled={busy}
                onClick={() => {
                  entries.forEach((e) => URL.revokeObjectURL(e.url));
                  setEntries([]);
                  setResult(null);
                  setError("");
                }}
              >
                Clear all
              </button>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={create}>
                {busy ? "Creating…" : "Create PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/40 bg-brand/5 p-4" aria-live="polite">
          <p>
            <span className="font-semibold">Done.</span> {result.pages} {result.pages === 1 ? "page" : "pages"} · {formatBytes(result.blob.size)}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => downloadBlob(result.blob, "images.pdf")}>
            Download images.pdf
          </button>
        </div>
      )}
    </div>
  );
}
