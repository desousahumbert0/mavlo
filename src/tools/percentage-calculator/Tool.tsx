"use client";

import { useState, type ReactNode } from "react";
import { formatNumber, parseNumber } from "@/lib/format";
import { changeByPercent, percentChange, percentOf, wholeFromPart, whatPercent } from "@/lib/percent";

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="input" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Card({ title, formula, answer, children }: { title: string; formula: string; answer: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">{children}</div>
      <p className="mt-4 text-2xl font-bold tabular-nums" aria-live="polite">
        {answer}
      </p>
      <p className="mt-1 text-xs text-muted">{formula}</p>
    </section>
  );
}

const show = (n: number | null, suffix = "") => (n === null || !Number.isFinite(n) ? "–" : `${formatNumber(n, 8)}${suffix}`);

export default function PercentageCalculator() {
  const [a1, setA1] = useState("15");
  const [b1, setB1] = useState("200");
  const [a2, setA2] = useState("30");
  const [b2, setB2] = useState("120");
  const [a3, setA3] = useState("80");
  const [b3, setB3] = useState("92");
  const [a4, setA4] = useState("250");
  const [b4, setB4] = useState("20");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [a5, setA5] = useState("30");
  const [b5, setB5] = useState("12");

  const n = parseNumber;
  const calc = <T,>(inputs: (string)[], fn: (...v: number[]) => T | null): T | null => {
    const values = inputs.map((s) => n(s));
    if (values.some((v) => v === null)) return null;
    return fn(...(values as number[]));
  };

  const r1 = calc([a1, b1], (p, v) => percentOf(p, v));
  const r2 = calc([a2, b2], (part, whole) => whatPercent(part, whole));
  const r3 = calc([a3, b3], (from, to) => percentChange(from, to));
  const r4 = calc([a4, b4], (v, p) => changeByPercent(v, p, dir));
  const r5 = calc([a5, b5], (part, p) => wholeFromPart(part, p));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="What is X% of Y?" formula="Y × X ÷ 100" answer={show(r1)}>
        <Field id="pc-a1" label="Percent (X)" value={a1} onChange={setA1} />
        <Field id="pc-b1" label="Number (Y)" value={b1} onChange={setB1} />
      </Card>
      <Card title="X is what percent of Y?" formula="X ÷ Y × 100" answer={show(r2, "%")}>
        <Field id="pc-a2" label="Part (X)" value={a2} onChange={setA2} />
        <Field id="pc-b2" label="Whole (Y)" value={b2} onChange={setB2} />
      </Card>
      <Card
        title="Percentage change"
        formula="(new − old) ÷ |old| × 100"
        answer={r3 === null ? "–" : `${r3 > 0 ? "+" : ""}${formatNumber(r3, 8)}% ${r3 > 0 ? "increase" : r3 < 0 ? "decrease" : "(no change)"}`}
      >
        <Field id="pc-a3" label="From (old)" value={a3} onChange={setA3} />
        <Field id="pc-b3" label="To (new)" value={b3} onChange={setB3} />
      </Card>
      <Card title="Increase or decrease Y by X%" formula="Y × (1 ± X ÷ 100)" answer={show(r4)}>
        <Field id="pc-a4" label="Number (Y)" value={a4} onChange={setA4} />
        <Field id="pc-b4" label="Percent (X)" value={b4} onChange={setB4} />
        <div className="col-span-2">
          <label className="label" htmlFor="pc-dir">
            Operation
          </label>
          <select id="pc-dir" className="input" value={dir} onChange={(e) => setDir(Number(e.target.value) === 1 ? 1 : -1)}>
            <option value={-1}>Decrease (discount)</option>
            <option value={1}>Increase (markup, tax)</option>
          </select>
        </div>
      </Card>
      <Card title="X is Y% of what number?" formula="X ÷ Y × 100" answer={show(r5)}>
        <Field id="pc-a5" label="Part (X)" value={a5} onChange={setA5} />
        <Field id="pc-b5" label="Percent (Y)" value={b5} onChange={setB5} />
      </Card>
    </div>
  );
}
