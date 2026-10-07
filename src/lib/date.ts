/** Calendar maths on plain dates (no time zones, no DST surprises). All arithmetic happens in UTC. */
export type YMD = { y: number; m: number; d: number }; // m is 1-12

const MS_DAY = 86_400_000;

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

export function toTime(v: YMD): number {
  const dt = new Date(0);
  dt.setUTCFullYear(v.y, v.m - 1, v.d);
  dt.setUTCHours(0, 0, 0, 0);
  return dt.getTime();
}

export function fromTime(t: number): YMD {
  const dt = new Date(t);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function parseISODate(s: string): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
  return { y, m, d };
}

export function toISO(v: YMD): string {
  return `${String(v.y).padStart(4, "0")}-${String(v.m).padStart(2, "0")}-${String(v.d).padStart(2, "0")}`;
}

/** Today's date in the visitor's local time zone. Call only on the client. */
export function todayYMD(): YMD {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
}

export function compareYMD(a: YMD, b: YMD): number {
  return toTime(a) - toTime(b);
}

export function daysBetween(a: YMD, b: YMD): number {
  return Math.round((toTime(b) - toTime(a)) / MS_DAY);
}

export function addDays(v: YMD, n: number): YMD {
  return fromTime(toTime(v) + n * MS_DAY);
}

/** Adds calendar months, clamping to the last day of the target month (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(v: YMD, n: number): YMD {
  const index = v.y * 12 + (v.m - 1) + n;
  const y = Math.floor(index / 12);
  const m = (((index % 12) + 12) % 12) + 1;
  return { y, m, d: Math.min(v.d, daysInMonth(y, m)) };
}

/** Years, months and days from a to b. Requires a <= b. */
export function diffYMD(a: YMD, b: YMD): { years: number; months: number; days: number } {
  let months = (b.y - a.y) * 12 + (b.m - a.m);
  if (b.d < a.d) months -= 1;
  const anchor = addMonths(a, months);
  const days = daysBetween(anchor, b);
  return { years: Math.floor(months / 12), months: months % 12, days };
}

/** Day of week, 0 = Sunday. */
export function weekdayIndex(v: YMD): number {
  return new Date(toTime(v)).getUTCDay();
}

export function weekdayName(v: YMD, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(new Date(toTime(v)));
}

export function formatDate(v: YMD, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(toTime(v)));
}

/** Number of Monday-Friday days among the `days` days starting at `start` (start included, end excluded). */
export function weekdaysInSpan(start: YMD, days: number): number {
  if (days <= 0) return 0;
  const fullWeeks = Math.floor(days / 7);
  let count = fullWeeks * 5;
  const remainder = days % 7;
  const first = weekdayIndex(addDays(start, fullWeeks * 7));
  for (let i = 0; i < remainder; i++) {
    const wd = (first + i) % 7;
    if (wd !== 0 && wd !== 6) count++;
  }
  return count;
}

/** The next occurrence of a birthday on or after `from`. Feb 29 birthdays fall on Feb 28 in non-leap years. */
export function nextBirthday(birth: YMD, from: YMD): YMD {
  const make = (year: number): YMD => ({
    y: year,
    m: birth.m,
    d: Math.min(birth.d, daysInMonth(year, birth.m)),
  });
  const candidate = make(from.y);
  return compareYMD(candidate, from) >= 0 ? candidate : make(from.y + 1);
}
