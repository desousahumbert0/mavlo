/** Text case conversions. Everything is Unicode-aware (accents, non-Latin letters). */
const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "the", "to", "via", "vs"]);

const capitalize = (w: string): string => {
  const [first = "", ...rest] = Array.from(w);
  return first.toUpperCase() + rest.join("");
};

/** Splits text (including camelCase, PascalCase, snake_case and kebab-case) into plain words. */
export function caseWords(text: string): string[] {
  const spaced = text.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2").replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2");
  return spaced.match(/[\p{L}\p{N}]+/gu) ?? [];
}

export const toUpper = (text: string): string => text.toUpperCase();
export const toLower = (text: string): string => text.toLowerCase();

/** Title Case: capitalises every word except short articles, conjunctions and prepositions in the middle. */
export function toTitle(text: string): string {
  const lower = text.toLowerCase();
  const matches = [...lower.matchAll(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu)];
  let out = "";
  let last = 0;
  matches.forEach((m, i) => {
    const word = m[0];
    const at = m.index ?? 0;
    const gap = lower.slice(last, at);
    out += gap;
    const startsClause = i === 0 || /[:.!?\n—–]/.test(gap);
    out += SMALL_WORDS.has(word) && !startsClause && i < matches.length - 1 ? word : capitalize(word);
    last = at + word.length;
  });
  return out + lower.slice(last);
}

export function toSentence(text: string): string {
  return text.toLowerCase().replace(/(^|[.!?…]\s+|\n\s*)(\p{L})/gu, (_m, lead: string, ch: string) => lead + ch.toUpperCase());
}

export function toCamel(text: string): string {
  return caseWords(text)
    .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w.toLowerCase())))
    .join("");
}

export const toPascal = (text: string): string =>
  caseWords(text)
    .map((w) => capitalize(w.toLowerCase()))
    .join("");

export const toKebab = (text: string): string =>
  caseWords(text)
    .map((w) => w.toLowerCase())
    .join("-");

export const toSnake = (text: string): string =>
  caseWords(text)
    .map((w) => w.toLowerCase())
    .join("_");

export const CASES: { id: string; label: string; convert: (text: string) => string }[] = [
  { id: "upper", label: "UPPERCASE", convert: toUpper },
  { id: "lower", label: "lowercase", convert: toLower },
  { id: "title", label: "Title Case", convert: toTitle },
  { id: "sentence", label: "Sentence case", convert: toSentence },
  { id: "camel", label: "camelCase", convert: toCamel },
  { id: "pascal", label: "PascalCase", convert: toPascal },
  { id: "kebab", label: "kebab-case", convert: toKebab },
  { id: "snake", label: "snake_case", convert: toSnake },
];
