/** Pure, dependency-free search used by the client-side search box. */
export type SearchEntry = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  /** Lower-case keywords used for matching (aliases, units, synonyms). */
  keywords: string[];
  kind: "tool" | "preset";
};

const OPTIONAL_WORDS = new Set(["to", "a", "the", "online", "free", "tool", "tools", "calculate", "make", "how", "am", "i", "is", "are", "what", "my", "me", "do", "does", "can", "for"]);

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreToken(entry: SearchEntry, title: string, titleWords: string[], token: string): number {
  let score = 0;
  if (title.startsWith(token)) score = Math.max(score, 6);
  else if (titleWords.some((w) => w.startsWith(token))) score = Math.max(score, 4);
  else if (title.includes(token)) score = Math.max(score, 2);
  for (const k of entry.keywords) {
    if (k === token) score = Math.max(score, 3);
    else if (k.startsWith(token)) score = Math.max(score, 2);
    else if (token.length >= 3 && k.includes(token)) score = Math.max(score, 1);
  }
  return score;
}

export function searchEntries(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];
  const required = tokens.filter((t) => !OPTIONAL_WORDS.has(t));
  const mustMatch = required.length > 0 ? required : tokens;

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = normalize(entry.title);
    const titleWords = title.split(" ");
    let total = 0;
    let ok = true;
    for (const token of mustMatch) {
      const s = scoreToken(entry, title, titleWords, token);
      if (s === 0) {
        ok = false;
        break;
      }
      total += s;
    }
    if (!ok) continue;
    for (const token of tokens) if (!mustMatch.includes(token)) total += scoreToken(entry, title, titleWords, token) * 0.25;
    scored.push({ entry, score: total });
  }
  scored.sort((a, b) => b.score - a.score || (a.entry.kind === b.entry.kind ? 0 : a.entry.kind === "preset" ? -1 : 1));
  return scored.slice(0, limit).map((s) => s.entry);
}
