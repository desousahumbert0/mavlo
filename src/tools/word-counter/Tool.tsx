"use client";

import { useMemo, useState } from "react";
import Stat from "@/components/ui/Stat";
import { formatDuration, formatNumber } from "@/lib/format";
import { analyzeText } from "@/lib/text-stats";

const LIMITS = [
  { label: "Post on X", max: 280 },
  { label: "SEO title", max: 60 },
  { label: "Meta description", max: 160 },
  { label: "SMS (single)", max: 160 },
];

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="wc-text">
          Your text
        </label>
        <textarea
          id="wc-text"
          className="input min-h-[220px] resize-y leading-7"
          placeholder="Type or paste your text here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck
        />
        <div className="mt-2 flex gap-2">
          <button type="button" className="btn btn-sm" disabled={!text} onClick={() => setText("")}>
            Clear
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={async () => {
              try {
                setText(await navigator.clipboard.readText());
              } catch {
                /* clipboard read needs permission; pasting with the keyboard always works */
              }
            }}
          >
            Paste from clipboard
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-live="polite">
        <Stat label="Words" value={formatNumber(stats.words)} />
        <Stat label="Characters" value={formatNumber(stats.characters)} />
        <Stat label="No spaces" value={formatNumber(stats.charactersNoSpaces)} />
        <Stat label="Sentences" value={formatNumber(stats.sentences)} />
        <Stat label="Paragraphs" value={formatNumber(stats.paragraphs)} />
        <Stat label="Lines" value={formatNumber(stats.lines)} />
        <Stat label="Reading time" value={formatDuration(stats.readingSeconds)} />
        <Stat label="Speaking time" value={formatDuration(stats.speakingSeconds)} />
      </dl>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Character limits</h3>
          <ul className="space-y-3">
            {LIMITS.map((l) => {
              const over = stats.characters > l.max;
              const pct = Math.min(100, (stats.characters / l.max) * 100);
              return (
                <li key={l.label}>
                  <div className="flex justify-between text-sm">
                    <span>{l.label}</span>
                    <span className={over ? "font-semibold text-danger" : "text-muted"}>
                      {formatNumber(stats.characters)} / {l.max}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={l.label} aria-valuemin={0} aria-valuemax={l.max} aria-valuenow={Math.min(stats.characters, l.max)}>
                    <div className={`h-full ${over ? "bg-danger" : "bg-brand"}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Most used words</h3>
          {stats.topWords.length === 0 ? (
            <p className="text-sm text-muted">Words you repeat will appear here.</p>
          ) : (
            <ul className="divide-y divide-line rounded-lg border border-line text-sm">
              {stats.topWords.map((w) => (
                <li key={w.word} className="flex justify-between px-3 py-2">
                  <span className="font-medium">{w.word}</span>
                  <span className="tabular-nums text-muted">
                    {w.count}× · {w.percent.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
