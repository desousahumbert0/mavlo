"use client";

import { useEffect, useState } from "react";
import { formatNumber, parseNumber } from "@/lib/format";
import { convert, findUnit, type Unit } from "@/lib/units";
import CopyButton from "./CopyButton";

type Props = { units: Unit[]; defaultFrom: string; defaultTo: string };

/** Generic converter used by every unit tool. Supports ?from=kg&to=lb&v=5 for deep links and search shortcuts. */
export default function UnitConverter({ units, defaultFrom, defaultTo }: Props) {
  const [value, setValue] = useState("1");
  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(defaultTo);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const f = findUnit(units, q.get("from"));
    const t = findUnit(units, q.get("to"));
    const v = q.get("v");
    if (f) setFromId(f.id);
    if (t) setToId(t.id);
    if (v && parseNumber(v) !== null) setValue(v);
  }, [units]);

  const from = findUnit(units, fromId) ?? units[0];
  const to = findUnit(units, toId) ?? units[0];
  const n = parseNumber(value);
  const result = n === null ? null : convert(n, from, to);
  const line = n !== null && result !== null ? `${formatNumber(n)} ${from.symbol} = ${formatNumber(result)} ${to.symbol}` : "";

  return (
    <div className="space-y-5">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto_1fr]">
        <div>
          <label className="label" htmlFor="uc-value">
            Value
          </label>
          <input id="uc-value" className="input" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} aria-invalid={n === null} />
        </div>
        <div>
          <label className="label" htmlFor="uc-from">
            From
          </label>
          <select id="uc-from" className="input" value={from.id} onChange={(e) => setFromId(e.target.value)}>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn"
          aria-label="Swap units"
          onClick={() => {
            setFromId(to.id);
            setToId(from.id);
          }}
        >
          ⇄
        </button>
        <div>
          <label className="label" htmlFor="uc-to">
            To
          </label>
          <select id="uc-to" className="input" value={to.id} onChange={(e) => setToId(e.target.value)}>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {n === null ? (
        <p className="alert-error" role="alert">
          Enter a number, for example 12.5
        </p>
      ) : (
        <div className="rounded-xl border border-brand/40 bg-brand/5 p-4" aria-live="polite">
          <p className="text-3xl font-bold tabular-nums sm:text-4xl">
            {formatNumber(result ?? 0)} <span className="text-xl font-semibold text-muted">{to.symbol}</span>
          </p>
          <p className="mt-1 text-sm text-muted">{line}</p>
          <div className="mt-3">
            <CopyButton text={formatNumber(result ?? 0)} label="Copy result" />
          </div>
        </div>
      )}

      {n !== null && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            {formatNumber(n)} {from.symbol} in every unit
          </h3>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm">
              <tbody>
                {units.map((u) => (
                  <tr key={u.id} className={`border-b border-line last:border-0 ${u.id === to.id ? "bg-brand/5" : ""}`}>
                    <th scope="row" className="px-3 py-2 font-medium">
                      {u.label}
                    </th>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatNumber(convert(n, from, u))} {u.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
