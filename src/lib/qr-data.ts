/** Builders for the text that goes inside a QR code, following the common conventions phones understand. */
export type WifiSecurity = "WPA" | "WEP" | "nopass";

const escapeWifi = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export function wifiPayload(input: { ssid: string; password: string; security: WifiSecurity; hidden: boolean }): string {
  const parts = [`T:${input.security}`, `S:${escapeWifi(input.ssid)}`];
  if (input.security !== "nopass") parts.push(`P:${escapeWifi(input.password)}`);
  if (input.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

export function emailPayload(input: { to: string; subject: string; body: string }): string {
  const params: string[] = [];
  if (input.subject) params.push(`subject=${encodeURIComponent(input.subject)}`);
  if (input.body) params.push(`body=${encodeURIComponent(input.body)}`);
  return `mailto:${input.to.trim()}${params.length ? `?${params.join("&")}` : ""}`;
}

export function phonePayload(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "";
}

const escapeVCard = (s: string) => s.replace(/([\\;,])/g, "\\$1").replace(/\r?\n/g, "\\n");

export function vcardPayload(input: { first: string; last: string; org: string; phone: string; email: string; url: string }): string {
  if (!input.first && !input.last && !input.org) return "";
  const full = [input.first, input.last].filter(Boolean).join(" ") || input.org;
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N:${escapeVCard(input.last)};${escapeVCard(input.first)};;;`, `FN:${escapeVCard(full)}`];
  if (input.org) lines.push(`ORG:${escapeVCard(input.org)}`);
  if (input.phone) lines.push(`TEL:${escapeVCard(input.phone)}`);
  if (input.email) lines.push(`EMAIL:${escapeVCard(input.email)}`);
  if (input.url) lines.push(`URL:${input.url}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

/** WCAG contrast ratio between two #rrggbb colours (1 to 21). Scanners need roughly 3+ and dark-on-light. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
