import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "word-counter",
    category: "text-tools",
    glyph: "Aa",
    slugs: { en: "word-counter" },
    texts: {
      en: {
        name: "Word Counter",
        title: "Word Counter: Count Words, Characters & Reading Time",
        metaDescription:
          "Count words, characters, sentences and paragraphs as you type, see reading and speaking time, keyword density and limits for tweets and meta tags. Free and private.",
        h1: "Word Counter",
        tagline: "Words, characters, sentences, reading time and keyword density, live.",
      },
    },
    keywords: ["word count", "character count", "characters", "letter counter", "count words", "reading time", "sentence counter", "paragraph counter", "text length", "keyword density", "twitter limit", "meta description length"],
    related: ["percentage-calculator", "qr-code-generator"],
    flags: { popular: true, recommended: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "This word counter measures your text while you type or paste it. It shows the number of words, characters with and without spaces, sentences and paragraphs, how long the text takes to read aloud or silently, and which words you use most. There is nothing to submit: the numbers change with every keystroke.",
        "It is built for the limits writers meet every day: an essay with a minimum length, a tweet, a product title or an SEO meta description. The limit bars below the stats show how much room you have left for each one.",
      ],
      howTo: [
        "Type or paste your text into the box. Everything is counted immediately.",
        "Read the main counts: words, characters, characters without spaces, sentences and paragraphs.",
        "Check the reading and speaking time to see if the text suits a speech, video script or article.",
        "Use the limit bars and the keyword list to trim the text or spot words you repeat too often.",
      ],
      howItWorks: {
        paragraphs: [
          "Words are runs of letters and numbers, so “don't” and “well-known” each count as one word. For languages written without spaces, such as Chinese, Japanese and Thai, the counter uses your browser's built-in text segmentation to find word boundaries.",
          "Characters are counted as visible characters rather than raw code units, so an emoji or an accented letter counts as one. Sentences end at a full stop, exclamation mark, question mark or ellipsis, and paragraphs are blocks of text separated by a blank line.",
          "Reading time assumes about 238 words per minute, the average for adults reading non-fiction silently, and speaking time assumes 150 words per minute, a comfortable pace for a presentation. Keyword density ignores very short words, numbers and common English filler words.",
        ],
        formula: "reading time = words ÷ 238 per minute\nspeaking time = words ÷ 150 per minute\nkeyword density = occurrences ÷ total words × 100",
      },
      examples: [
        { title: "A 500-word essay", body: "Paste the essay to confirm the word count meets the minimum. At 238 words per minute, 500 words take about 2 minutes to read." },
        { title: "A tweet or social post", body: "Watch the 280-character bar. When it turns red the post is too long for a standard post on X." },
        { title: "An SEO meta description", body: "Keep the description close to 150 to 160 characters so that search results do not cut it off." },
      ],
      useCases: [
        "Meeting a word limit for an essay, assignment, application or article.",
        "Fitting text into a character limit such as a tweet, SMS, title tag or meta description.",
        "Timing a speech or video script from its word count.",
        "Spotting words repeated too often by looking at the keyword list.",
      ],
      tips: [
        "Different programs count words slightly differently. If a strict limit applies, leave a small margin.",
        "Select the text you want to measure, copy it and paste it here to count one section of a longer document.",
      ],
      faqs: [
        { q: "How does the word counter decide what a word is?", a: "A word is a continuous run of letters and numbers, optionally joined by an apostrophe or hyphen. Punctuation on its own is ignored, so “well-known” and “don't” each count as one word." },
        { q: "Are spaces included in the character count?", a: "Both figures are shown: characters including spaces and characters without spaces. Line breaks count as spaces in the first figure and are left out of the second." },
        { q: "How is reading time calculated?", a: "Reading time divides the word count by 238, the average silent reading speed for adults. Speaking time divides by 150 words per minute. They are estimates and vary from person to person." },
        { q: "Does it work for Chinese, Japanese or other languages?", a: "Yes. For languages without spaces between words the counter uses your browser's text segmentation to estimate words, and character counts are exact." },
        { q: "Is my text saved or sent anywhere?", a: "No. The text stays in your browser tab and disappears when you close or refresh the page, which makes the tool safe for drafts and confidential writing." },
      ],
    },
  },
  Tool,
};
