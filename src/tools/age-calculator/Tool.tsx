"use client";

import { useEffect, useMemo, useState } from "react";
import Stat from "@/components/ui/Stat";
import { compareYMD, daysBetween, diffYMD, formatDate, nextBirthday, parseISODate, toISO, todayYMD, weekdayName } from "@/lib/date";
import { formatNumber, plural } from "@/lib/format";

export default function AgeCalculator() {
  const [birth, setBirth] = useState("");
  const [asOf, setAsOf] = useState("");

  useEffect(() => {
    setAsOf(toISO(todayYMD()));
  }, []);

  const result = useMemo(() => {
    const b = parseISODate(birth);
    const t = parseISODate(asOf);
    if (!b || !t) return null;
    if (compareYMD(b, t) > 0) return { error: "The date of birth is after the “Age at” date." } as const;
    const age = diffYMD(b, t);
    const totalDays = daysBetween(b, t);
    const next = nextBirthday(b, t);
    return { age, totalDays, next, daysToNext: daysBetween(t, next), turning: next.y - b.y, born: `${weekdayName(b)}, ${formatDate(b)}`, nextLabel: formatDate(next) } as const;
  }, [birth, asOf]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="age-birth">
            Date of birth
          </label>
          <input id="age-birth" type="date" className="input" value={birth} max={asOf || undefined} onChange={(e) => setBirth(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="age-asof">
            Age at
          </label>
          <input id="age-asof" type="date" className="input" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
        </div>
      </div>

      <div aria-live="polite">
        {!result && <p className="text-muted">Enter a date of birth to see the exact age.</p>}
        {result && "error" in result && (
          <p className="alert-error" role="alert">
            {result.error}
          </p>
        )}
        {result && !("error" in result) && (
          <div className="space-y-4">
            <div className="rounded-xl border border-brand/40 bg-brand/5 p-4">
              <p className="text-3xl font-bold sm:text-4xl">
                {plural(result.age.years, "year")}, {plural(result.age.months, "month")}, {plural(result.age.days, "day")}
              </p>
              <p className="mt-1 text-sm text-muted">Born on {result.born}</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Total months" value={formatNumber(result.age.years * 12 + result.age.months)} />
              <Stat label="Total weeks" value={formatNumber(Math.floor(result.totalDays / 7))} />
              <Stat label="Total days" value={formatNumber(result.totalDays)} />
              <Stat label="Total hours" value={formatNumber(result.totalDays * 24)} />
            </dl>
            <div className="rounded-xl border border-line p-4">
              <p className="font-semibold">{result.daysToNext === 0 ? "Today is the birthday!" : `Next birthday in ${plural(result.daysToNext, "day")}`}</p>
              <p className="text-sm text-muted">
                {result.nextLabel}, turning {result.turning}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
