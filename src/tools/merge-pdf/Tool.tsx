"use client";

import { useState } from "react";
import FileDrop from "@/components/ui/FileDrop";
import { bytesToBlob, downloadBlob } from "@/lib/download";
import { formatBytes } from "@/lib/format";

type Entry = { id: number; file: File; pages: number | null; error?: string };

let nextId = 1;
const isPdf = (f: File) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);

function explain(e: unknown): string {
  const msg = e instanceof Error ? e.message : "";
  if (/encrypt/i.test(msg)) return "This PDF is password-protected. Remove the password and add it again.";
  return "This file could not be read. It may be damaged or not a real PDF.";
}

export default function MergePdf() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);
  const [result, setResult] = useState<{ blob: Blob; pages: number } | null>(null);

  async function addFiles(list: File[]) {
    setSkipped(list.filter((f) => !isPdf(f)).map((f) => f.name));
    const pdfs = list.filter(isPdf).map<Entry>((file) => ({ id: nextId++, file, pages: null }));
    if (pdfs.length === 0) return;
    setResult(null);
    setError("");
    setEntries((prev) => [...prev, ...pdfs]);
    const { PDFDocument } = await import("pdf-lib");
    for (const entry of pdfs) {
      try {
        const doc = await PDFDocument.load(await entry.file.arrayBuffer(), { updateMetadata: false });
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, pages: doc.getPageCount() } : e)));
      } catch (err) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, pages: 0, error: explain(err) } : e)));
      }
    }
  }

  function move(index: number, delta: number) {
    setResult(null);
    setEntries((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function merge() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const entry of entries) {
        if (entry.error) continue;
        const src = await PDFDocument.load(await entry.file.arrayBuffer(), { updateMetadata: false });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      setResult({ blob: bytesToBlob(bytes, "application/pdf"), pages: out.getPageCount() });
    } catch (err) {
      setError(`The files could not be merged. ${explain(err)}`);
    } finally {
      setBusy(false);
    }
  }

  const valid = entries.filter((e) => !e.error && e.pages !== null);
  const loading = entries.some((e) => e.pages === null);
  const totalPages = valid.reduce((s, e) => s + (e.pages ?? 0), 0);
  const totalSize = valid.reduce((s, e) => s + e.file.size, 0);

  return (
    <div className="space-y-5">
      <FileDrop accept="application/pdf,.pdf" onFiles={addFiles} title="Drop PDF files here" hint="Add two or more PDFs. They are combined on your device." buttonLabel="Choose PDF files" />
      {skipped.length > 0 && (
        <p className="alert-error" role="alert">
          Skipped (not PDF): {skipped.join(", ")}. Use the Image tools to turn images into PDFs first.
        </p>
      )}

      {entries.length > 0 && (
        <div className="space-y-3">
          <ol className="divide-y divide-line rounded-xl border border-line">
            {entries.map((e, i) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="w-6 text-sm tabular-nums text-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{e.file.name}</p>
                  <p className={`text-sm ${e.error ? "text-danger" : "text-muted"}`}>
                    {e.error ? e.error : e.pages === null ? "Reading…" : `${e.pages} ${e.pages === 1 ? "page" : "pages"} · ${formatBytes(e.file.size)}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button type="button" className="btn btn-sm" aria-label={`Move ${e.file.name} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button type="button" className="btn btn-sm" aria-label={`Move ${e.file.name} down`} disabled={i === entries.length - 1} onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    aria-label={`Remove ${e.file.name}`}
                    onClick={() => {
                      setResult(null);
                      setEntries((prev) => prev.filter((x) => x.id !== e.id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-3" aria-live="polite">
            <p className="text-sm text-muted">
              {valid.length} {valid.length === 1 ? "file" : "files"} · {totalPages} pages · {formatBytes(totalSize)}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn"
                disabled={busy}
                onClick={() => {
                  setEntries([]);
                  setResult(null);
                  setError("");
                }}
              >
                Clear all
              </button>
              <button type="button" className="btn btn-primary" disabled={busy || loading || valid.length < 2} onClick={merge}>
                {busy ? "Merging…" : "Merge PDFs"}
              </button>
            </div>
          </div>
          {valid.length < 2 && !loading && <p className="text-sm text-muted">Add at least two valid PDF files to merge them.</p>}
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
            <span className="font-semibold">Done.</span> {result.pages} pages · {formatBytes(result.blob.size)}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => downloadBlob(result.blob, "merged.pdf")}>
            Download merged.pdf
          </button>
        </div>
      )}
    </div>
  );
}
