/** Parse a user-typed number. Accepts "1,234.5", "1.234,5", "1,5" and "1 234". Returns null if invalid. */
export function parseNumber(input: string): number | null {
  let s = input.trim().replace(/\s/g, "");
  if (!s) return null;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma !== -1 && lastDot !== -1) {
    // Both present: the right-most one is the decimal separator.
    if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (lastComma !== -1) {
    // Only commas: "1,234" / "1,234,567" are thousands groups, otherwise decimal comma.
    s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
  }
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Format a number for display with up to `digits` significant digits and no float noise. */
export function formatNumber(n: number, digits = 10): string {
  if (!Number.isFinite(n)) return "-";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-6) {
    return n.toExponential(Math.min(digits, 8) - 1).replace(/\.?0+e/, "e").replace("e+", "e");
  }
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: digits }).format(n);
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value >= 100 ? value.toFixed(0) : value.toFixed(1)} ${units[i]}`;
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0 sec";
  if (seconds < 1) return "< 1 sec";
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h} hr`);
  if (m) parts.push(`${m} min`);
  if (sec && !h) parts.push(`${sec} sec`);
  return parts.join(" ") || "0 sec";
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;
}

export function fileBaseName(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}
