export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Reduces whole-number dimensions to their simplest ratio (1920 × 1080 → 16:9). */
export function simplifyRatio(width: number, height: number): [number, number] | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) return null;
  const g = gcd(width, height);
  return [width / g, height / g];
}

export const heightFor = (width: number, rw: number, rh: number): number => (width * rh) / rw;
export const widthFor = (height: number, rw: number, rh: number): number => (height * rw) / rh;

export type CommonRatio = { label: string; w: number; h: number; note: string };

export const COMMON_RATIOS: CommonRatio[] = [
  { label: "16:9", w: 16, h: 9, note: "HD and 4K video, YouTube, monitors" },
  { label: "9:16", w: 9, h: 16, note: "Stories, Reels, TikTok, Shorts" },
  { label: "4:3", w: 4, h: 3, note: "Classic TV, iPad, presentations" },
  { label: "3:4", w: 3, h: 4, note: "Portrait photos" },
  { label: "1:1", w: 1, h: 1, note: "Square posts and avatars" },
  { label: "3:2", w: 3, h: 2, note: "35 mm film and many cameras" },
  { label: "21:9", w: 21, h: 9, note: "Ultrawide monitors and cinema" },
  { label: "4:5", w: 4, h: 5, note: "Portrait feed posts" },
  { label: "16:10", w: 16, h: 10, note: "Laptops and some monitors" },
];

/** The common ratio nearest to a width/height pair, and whether it matches almost exactly. */
export function closestCommonRatio(width: number, height: number): { ratio: CommonRatio; exact: boolean } | null {
  if (!(width > 0) || !(height > 0)) return null;
  const target = width / height;
  let best = COMMON_RATIOS[0];
  let bestDiff = Infinity;
  for (const r of COMMON_RATIOS) {
    const diff = Math.abs(Math.log(target / (r.w / r.h)));
    if (diff < bestDiff) {
      best = r;
      bestDiff = diff;
    }
  }
  return { ratio: best, exact: bestDiff < 0.005 };
}
