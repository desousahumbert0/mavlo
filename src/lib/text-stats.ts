export type TextStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingSeconds: number;
  speakingSeconds: number;
  topWords: { word: string; count: number; percent: number }[];
};

export const READING_WPM = 238;
export const SPEAKING_WPM = 150;

const STOP_WORDS = new Set(
  "a an and are as at be but by for from had has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to us was we were what when which who will with would you your".split(" "),
);

const UNSPACED_SCRIPTS = /[\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/;

/** Splits text into words. Languages written without spaces (Chinese, Japanese, Thai...) use the browser's segmenter. */
export function splitWords(text: string): string[] {
  if (UNSPACED_SCRIPTS.test(text) && typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const out: string[] = [];
    for (const part of new Intl.Segmenter(undefined, { granularity: "word" }).segment(text)) {
      if (part.isWordLike) out.push(part.segment);
    }
    return out;
  }
  return text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? [];
}

export function analyzeText(text: string): TextStats {
  const words = splitWords(text);
  const sentences = (text.match(/[^.!?…。！？\n]+[.!?…。！？]*/g) ?? []).filter((s) => /[\p{L}\p{N}]/u.test(s)).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  const counts = new Map<string, number>();
  for (const raw of words) {
    const w = raw.toLowerCase();
    if (w.length < 3 || STOP_WORDS.has(w) || /^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  const topWords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([word, count]) => ({ word, count, percent: words.length ? (count / words.length) * 100 : 0 }));

  return {
    words: words.length,
    characters: Array.from(text).length,
    charactersNoSpaces: Array.from(text.replace(/\s/g, "")).length,
    sentences,
    paragraphs,
    lines: text.length === 0 ? 0 : text.split(/\r?\n/).length,
    readingSeconds: (words.length / READING_WPM) * 60,
    speakingSeconds: (words.length / SPEAKING_WPM) * 60,
    topWords,
  };
}
