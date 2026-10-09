"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { CASES } from "@/lib/case";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const results = useMemo(() => CASES.map((c) => ({ id: c.id, label: c.label, value: c.convert(text) })), [text]);

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="cc-text">
          Your text
        </label>
        <textarea id="cc-text" className="input min-h-[140px] resize-y leading-7" placeholder="Type or paste your text here…" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-2">
          <button type="button" className="btn btn-sm" disabled={!text} onClick={() => setText("")}>
            Clear
          </button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((r) => (
          <section key={r.id} className="rounded-xl border border-line bg-surface p-3" aria-label={r.label}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{r.label}</h3>
              <CopyButton text={r.value} label="Copy" />
            </div>
            <p className="mt-2 min-h-[2.5rem] whitespace-pre-wrap break-words text-sm leading-6 text-muted" aria-live="polite">
              {r.value || "Your result appears here."}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
