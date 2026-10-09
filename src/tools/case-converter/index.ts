import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "case-converter",
    category: "text-tools",
    glyph: "aA",
    slugs: { en: "case-converter" },
    texts: {
      en: {
        name: "Case Converter",
        title: "Case Converter: UPPERCASE, Title Case, camelCase & More",
        metaDescription:
          "Convert text to uppercase, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case and snake_case instantly. Copy any result with one click.",
        h1: "Case Converter",
        tagline: "Change the case of any text to eight formats at once, live as you type.",
      },
    },
    keywords: ["case", "uppercase", "lowercase", "title case", "sentence case", "camelcase", "pascalcase", "kebab case", "snake case", "capitalize", "text case", "upper", "lower", "slug"],
    related: ["word-counter", "password-generator", "qr-code-generator"],
    flags: { new: true, popular: true },
    updated: "2026-10-09",
  },
  content: {
    en: {
      intro: [
        "This case converter changes the capitalisation of any text into eight common formats at the same time: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case and snake_case. Paste or type your text once and every result updates as you type, each with its own copy button.",
        "Writers use it to fix a headline typed in capitals or tidy an essay, and developers use it to turn a phrase into a variable name, a CSS class or a URL slug. Everything runs in your browser, so the text you paste is never uploaded.",
      ],
      howTo: [
        "Type or paste your text into the box.",
        "Look through the results. Each format has its own card and updates immediately.",
        "Press Copy on the card you want. The converted text goes to your clipboard.",
        "Edit the original text to try something else. Use Clear to start again.",
      ],
      howItWorks: {
        paragraphs: [
          "UPPERCASE and lowercase simply change every letter and work for accented and non-Latin alphabets as well. Title Case capitalises each word except short words such as a, an, the, of, in and or in the middle of the text, which is the convention used in most style guides. The first word and the word after a colon or full stop are always capitalised. Sentence case lowercases everything and then capitalises the first letter of each sentence.",
          "The programming formats first break the text into words. The splitter recognises spaces, punctuation, underscores and hyphens, and it also splits camelCase and PascalCase, so “XMLHttpRequest” becomes XML, Http and Request. The words are then joined according to the format: camelCase starts lowercase and capitalises later words, PascalCase capitalises every word, kebab-case joins lowercase words with hyphens and snake_case with underscores.",
          "Punctuation and symbols are dropped from the programming formats, because they are not valid in most identifiers. Numbers are kept as part of the words.",
        ],
        formula: "camelCase: helloBigWorld · PascalCase: HelloBigWorld\nkebab-case: hello-big-world · snake_case: hello_big_world",
      },
      examples: [
        { title: "A headline typed in capitals", body: "“BREAKING NEWS: THE QUICK BROWN FOX” becomes “Breaking News: The Quick Brown Fox” in Title Case." },
        { title: "A phrase turned into a variable name", body: "“user profile image” gives userProfileImage in camelCase and UserProfileImage in PascalCase." },
        { title: "A page title turned into a URL slug", body: "“Ten Tips for Better Sleep!” becomes ten-tips-for-better-sleep in kebab-case." },
      ],
      useCases: [
        "Fixing text that was typed with Caps Lock on or copied in the wrong case.",
        "Formatting headlines, titles and headings consistently.",
        "Naming variables, functions, classes, CSS classes and file names in code.",
        "Creating clean URL slugs and identifiers from plain phrases.",
      ],
      tips: [
        "Title Case follows general style-guide rules. Brand names such as iPhone or eBay may need a manual touch afterwards.",
        "For a URL slug, use kebab-case and remove accents first if your site does not support them.",
      ],
      faqs: [
        { q: "What is the difference between camelCase and PascalCase?", a: "Both join words with no separators and capitalise each new word. camelCase starts with a lowercase letter (userName), while PascalCase starts with a capital (UserName)." },
        { q: "How does Title Case treat small words?", a: "Short words like a, an, and, of, in, on, or, the and to stay lowercase in the middle of a title, but are capitalised when they come first, last or after a colon or full stop." },
        { q: "Does it work with accented letters and other alphabets?", a: "Yes. Case changes use Unicode rules, so letters such as é, ñ and ü work, as do Greek and Cyrillic. Alphabets without upper and lower case, such as Chinese, stay unchanged." },
        { q: "Is my text uploaded or saved?", a: "No. The conversion happens in your browser, and the text is gone as soon as you close or refresh the page." },
        { q: "Why are punctuation marks removed in camelCase and kebab-case?", a: "Those formats are used for names in code and web addresses, where punctuation is usually not allowed. Only letters and numbers are kept." },
      ],
    },
  },
  Tool,
};
