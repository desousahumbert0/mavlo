/** Percentage maths. Functions return null when the result is undefined (division by zero). */
export const percentOf = (percent: number, value: number): number => (percent / 100) * value;

export const whatPercent = (part: number, whole: number): number | null => (whole === 0 ? null : (part / whole) * 100);

/** Percentage change from `from` to `to`. Uses |from| so the sign always matches the direction of change. */
export const percentChange = (from: number, to: number): number | null => (from === 0 ? null : ((to - from) / Math.abs(from)) * 100);

export const changeByPercent = (value: number, percent: number, direction: 1 | -1): number => value * (1 + (direction * percent) / 100);

/** If `part` is `percent`% of some whole, returns that whole. */
export const wholeFromPart = (part: number, percent: number): number | null => (percent === 0 ? null : (part / percent) * 100);
