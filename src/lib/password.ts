/** Password generation with the browser's cryptographically secure random source. */
export type PasswordOptions = { length: number; lower: boolean; upper: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean };
export type RandomInt = (maxExclusive: number) => number;

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 64;

export const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/~",
} as const;

const AMBIGUOUS = /[Il1O0o]/g;

/** Unbiased random integer in [0, max) using rejection sampling over crypto.getRandomValues. */
export function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > 2 ** 32) throw new RangeError("max must be an integer between 1 and 2^32");
  const limit = Math.floor(2 ** 32 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

/** The character groups that are switched on, with ambiguous characters removed if requested. */
export function activeSets(o: PasswordOptions): string[] {
  const sets: string[] = [];
  if (o.lower) sets.push(CHARSETS.lower);
  if (o.upper) sets.push(CHARSETS.upper);
  if (o.numbers) sets.push(CHARSETS.numbers);
  if (o.symbols) sets.push(CHARSETS.symbols);
  return (o.excludeAmbiguous ? sets.map((s) => s.replace(AMBIGUOUS, "")) : sets).filter((s) => s.length > 0);
}

export function poolSize(o: PasswordOptions): number {
  return new Set(activeSets(o).join("")).size;
}

/** Builds a password that contains at least one character of every selected group, then shuffles it. */
export function generatePassword(o: PasswordOptions, rand: RandomInt = secureRandomInt): string {
  const sets = activeSets(o);
  if (sets.length === 0) throw new Error("Select at least one type of character.");
  const length = Math.min(256, Math.max(sets.length, Math.floor(o.length)));
  const pool = sets.join("");
  const chars = sets.map((s) => s[rand(s.length)]);
  while (chars.length < length) chars.push(pool[rand(pool.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export type Strength = { bits: number; score: 0 | 1 | 2 | 3 | 4; label: "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong" };

/** Entropy of a uniformly random password: length × log2(pool size). */
export function strengthOf(length: number, pool: number): Strength {
  const bits = pool > 1 ? length * Math.log2(pool) : 0;
  if (bits < 28) return { bits, score: 0, label: "Very weak" };
  if (bits < 40) return { bits, score: 1, label: "Weak" };
  if (bits < 60) return { bits, score: 2, label: "Fair" };
  if (bits < 80) return { bits, score: 3, label: "Strong" };
  return { bits, score: 4, label: "Very strong" };
}
