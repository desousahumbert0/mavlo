"use client";

import { useEffect, useMemo, useState } from "react";
import Stat from "@/components/ui/Stat";
import { addDays, addMonths, compareYMD, daysBetween, diffYMD, formatDate, parseISODate, toISO, todayYMD, weekdayName, weekdaysInSpan } from "@/lib/date";
import { formatNumber, plural } from "@/lib/format";

type Mode = "diff" | "add";

const toInt = (s: string): number | null => {
  if (s.trim() === "") return 0;
  const n = Number(s);
  return Number.isInteger(n) && n >= 0 && n <= 100000 ? n : null;
};

function NumberField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="input" inputMode="numeric" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function DateCalculator() {
  const [mode, setMode] = useState<Mode>("diff");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);
  const [base, setBase] = useState("");
  const [op, setOp] = useState<"add" | "subtract">("add");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [weeks, setWeeks] = useState("");
  const [days, setDays] = useState("");

  useEffect(() => {
    const today = toISO(todayYMD());
    setStart(today);
    setEnd(today);
    setBase(today);
  }, []);

  const diff = useMemo(() => {
    let a = parseISODate(start);
    let b = parseISODate(end);
    if (!a || !b) return null;
    const swapped = compareYMD(a, b) > 0;
    if (swapped) [a, b] = [b, a];
    const last = includeEnd ? addDays(b, 1) : b;
    const total = daysBetween(a, last);
    return { swapped, span: diffYMD(a, last), total, weeks: Math.floor(total / 7), rest: total % 7, weekdays: weekdaysInSpan(a, total) };
  }, [start, end, includeEnd]);

  const added = useMemo(() => {
    const s = parseISODate(base);
    const y = toInt(years);
    const m = toInt(months);
    const w = toInt(weeks);
    const d = toInt(days);
    if (!s) return null;
    if (y === null || m === null || w === null || d === null) return { error: "Use whole numbers of zero or more." } as const;
    const sign = op === "add" ? 1 : -1;
    const result = addDays(addMonths(s, sign * (y * 12 + m)), sign * (w * 7 + d));
    return { result, fromToday: daysBetween(todayYMD(), result) } as const;
  }, [base, op, years, months, weeks, days]);

  return (
    <div className="space-y-5">
      <div className="seg" role="group" aria-label="Calculation type">
        <button type="button" aria-pressed={mode === "diff"} onClick={() => setMode("diff")}>
          Difference between dates
        </button>
        <button type="button" aria-pressed={mode === "add"} onClick={() => setMode("add")}>
          Add or subtract
        </button>
      </div>

      {mode === "diff" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="dc-start">
                Start date
              </label>
              <input id="dc-start" type="date" className="input" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="dc-end">
                End date
              </label>
              <input id="dc-end" type="date" className="input" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--brand))]" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} />
            Include the end date as a full day
          </label>
          <div aria-live="polite">
            {!diff && <p className="text-muted">Pick two dates to see the difference.</p>}
            {diff && (
              <div className="space-y-4">
                {diff.swapped && <p className="text-sm text-muted">The end date was earlier, so the dates were swapped.</p>}
                <div className="rounded-xl border border-brand/40 bg-brand/5 p-4">
                  <p className="text-3xl font-bold sm:text-4xl">
                    {plural(diff.span.years, "year")}, {plural(diff.span.months, "month")}, {plural(diff.span.days, "day")}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat label="Total days" value={formatNumber(diff.total)} />
                  <Stat label="Weeks and days" value={`${formatNumber(diff.weeks)} wk ${diff.rest} d`} />
                  <Stat label="Weekdays (Mon-Fri)" value={formatNumber(diff.weekdays)} />
                  <Stat label="Total hours" value={formatNumber(diff.total * 24)} />
                </dl>
              </div>
            )}
          </div>
        </div>
      )}

      {mode === "add" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="dc-base">
                Start date
              </label>
              <input id="dc-base" type="date" className="input" value={base} onChange={(e) => setBase(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="dc-op">
                Operation
              </label>
              <select id="dc-op" className="input" value={op} onChange={(e) => setOp(e.target.value as "add" | "subtract")}>
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <NumberField id="dc-years" label="Years" value={years} onChange={setYears} />
            <NumberField id="dc-months" label="Months" value={months} onChange={setMonths} />
            <NumberField id="dc-weeks" label="Weeks" value={weeks} onChange={setWeeks} />
            <NumberField id="dc-days" label="Days" value={days} onChange={setDays} />
          </div>
          <div aria-live="polite">
            {!added && <p className="text-muted">Pick a start date.</p>}
            {added && "error" in added && (
              <p className="alert-error" role="alert">
                {added.error}
              </p>
            )}
            {added && !("error" in added) && (
              <div className="rounded-xl border border-brand/40 bg-brand/5 p-4">
                <p className="text-3xl font-bold sm:text-4xl">{formatDate(added.result)}</p>
                <p className="mt-1 text-sm text-muted">
                  {weekdayName(added.result)} · {toISO(added.result)} ·{" "}
                  {added.fromToday === 0 ? "today" : added.fromToday > 0 ? `${plural(added.fromToday, "day")} from today` : `${plural(-added.fromToday, "day")} ago`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
