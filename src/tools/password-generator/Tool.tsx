"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { formatNumber } from "@/lib/format";
import { generatePassword, MAX_LENGTH, MIN_LENGTH, poolSize, strengthOf, type PasswordOptions } from "@/lib/password";

type Toggle = "lower" | "upper" | "numbers" | "symbols";

const TOGGLES: { id: Toggle; label: string }[] = [
  { id: "lower", label: "Lowercase (a-z)" },
  { id: "upper", label: "Uppercase (A-Z)" },
  { id: "numbers", label: "Numbers (0-9)" },
  { id: "symbols", label: "Symbols (!@#$…)" },
];

const BAR = ["bg-danger", "bg-danger", "bg-yellow-500", "bg-brand", "bg-brand"];

export default function PasswordGenerator() {
  const [opts, setOpts] = useState<PasswordOptions>({ length: 16, lower: true, upper: true, numbers: true, symbols: true, excludeAmbiguous: false });
  const [password, setPassword] = useState("");
  const [shown, setShown] = useState(true);

  const regenerate = useCallback(() => setPassword(generatePassword(opts)), [opts]);

  // Generated after mount so the server-rendered page never contains a password.
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const selected = [opts.lower, opts.upper, opts.numbers, opts.symbols].filter(Boolean).length;
  const strength = useMemo(() => strengthOf(opts.length, poolSize(opts)), [opts]);

  function toggle(id: Toggle) {
    if (opts[id] && selected === 1) return;
    setOpts((o) => ({ ...o, [id]: !o[id] }));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-bg p-4">
        <p className="break-all font-mono text-xl leading-8 sm:text-2xl" aria-live="polite" data-testid="password">
          {shown ? password || "…" : "•".repeat(password.length || 16)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={regenerate}>
            Generate
          </button>
          <CopyButton text={password} label="Copy password" doneLabel="Copied!" />
          <button type="button" className="btn btn-sm self-center" aria-pressed={!shown} onClick={() => setShown((s) => !s)}>
            {shown ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div aria-live="polite">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">Strength: {strength.label}</span>
          <span className="text-muted">{formatNumber(Math.round(strength.bits))} bits of entropy</span>
        </div>
        <div className="mt-1 flex h-2 gap-1" role="img" aria-label={`Password strength: ${strength.label}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-full flex-1 rounded-full ${i <= strength.score ? BAR[strength.score] : "bg-line"}`} />
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="pw-length">
          Length: <span className="tabular-nums">{opts.length}</span>
        </label>
        <input
          id="pw-length"
          type="range"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          value={opts.length}
          onChange={(e) => setOpts((o) => ({ ...o, length: Number(e.target.value) }))}
          className="w-full accent-[rgb(var(--brand))]"
        />
        <div className="flex justify-between text-xs text-muted">
          <span>{MIN_LENGTH}</span>
          <span>{MAX_LENGTH}</span>
        </div>
      </div>

      <fieldset>
        <legend className="label">Include</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {TOGGLES.map((t) => (
            <label key={t.id} className="flex min-h-[44px] items-center gap-2 rounded-lg border border-line px-3 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--brand))]" checked={opts[t.id]} onChange={() => toggle(t.id)} />
              {t.label}
            </label>
          ))}
          <label className="flex min-h-[44px] items-center gap-2 rounded-lg border border-line px-3 text-sm sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--brand))]" checked={opts.excludeAmbiguous} onChange={() => setOpts((o) => ({ ...o, excludeAmbiguous: !o.excludeAmbiguous }))} />
            Avoid look-alike characters (I, l, 1, O, 0, o)
          </label>
        </div>
        {selected === 1 && <p className="mt-2 text-xs text-muted">At least one type must stay selected.</p>}
      </fieldset>
    </div>
  );
}
