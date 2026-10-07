import type { ByLocale, Locale } from "@/i18n/config";

export type CategoryId = "calculators" | "converters" | "image-tools" | "pdf-tools" | "text-tools" | "generators";

export type CategoryTexts = {
  slug: string;
  name: string;
  /** SEO title without the brand suffix. */
  title: string;
  metaDescription: string;
  h1: string;
  blurb: string;
  intro: string[];
  faqs: { q: string; a: string }[];
};

export type CategoryConfig = {
  id: CategoryId;
  order: number;
  texts: ByLocale<CategoryTexts>;
};

export const categories: CategoryConfig[] = [
  {
    id: "calculators",
    order: 1,
    texts: {
      en: {
        slug: "calculators",
        name: "Calculators",
        title: "Free Online Calculators for Percentages, Ages & Dates",
        metaDescription:
          "Free online calculators for everyday maths: percentages, exact age and date differences. Instant answers, clear formulas and worked examples, all in your browser.",
        h1: "Online calculators",
        blurb: "Percentages, ages and dates",
        intro: [
          "These calculators cover the small calculations that come up all the time: how much is 15% of a bill, how old someone is today, or how many days remain until a deadline. Each one shows the result straight away and explains the formula behind it, so you can check the logic instead of trusting a black box.",
          "Everything is calculated on your device. Nothing you type is sent anywhere, and no account is needed.",
        ],
        faqs: [
          {
            q: "Are the results exact?",
            a: "Yes. The calculators use exact calendar arithmetic and standard floating-point maths, and display results rounded only for readability. Each tool page explains its formula so you can verify it by hand.",
          },
          {
            q: "Do you store what I enter?",
            a: "No. Calculations run in your browser and the values you type never leave your device.",
          },
        ],
      },
    },
  },
  {
    id: "converters",
    order: 2,
    texts: {
      en: {
        slug: "converters",
        name: "Converters",
        title: "Free Unit Converters for Length, Weight & More",
        metaDescription:
          "Free online unit converters for length and weight, with every common metric and imperial unit, exact conversion factors and a full conversion table.",
        h1: "Unit converters",
        blurb: "Length and weight units",
        intro: [
          "Unit converters turn a measurement from one system into another: centimetres to inches, kilograms to pounds, miles to kilometres. The converters here use exact, internationally defined conversion factors, and show the same value in every other unit so you can pick the one you need.",
          "Results update as you type and work offline once the page has loaded.",
        ],
        faqs: [
          {
            q: "Which conversion factors do you use?",
            a: "The exact definitions: for example 1 inch is 25.4 mm, 1 pound is 0.45359237 kg and 1 international mile is 1,609.344 m. These are legal definitions, not rounded approximations.",
          },
          {
            q: "Why do some results show many digits?",
            a: "Results are shown with up to 10 significant digits so that small differences are not lost. Round the number to the precision you need.",
          },
        ],
      },
    },
  },
  {
    id: "image-tools",
    order: 3,
    texts: {
      en: {
        slug: "image-tools",
        name: "Image tools",
        title: "Free Online Image Tools: Compress & Convert Photos",
        metaDescription:
          "Compress images and convert HEIC photos to JPG for free. Everything runs in your browser, so your pictures are never uploaded to a server.",
        h1: "Image tools",
        blurb: "Compress and convert photos",
        intro: [
          "Photos are often larger than they need to be, and not every app can open every format. These tools shrink images for the web or email and convert iPhone HEIC photos to widely supported JPG files.",
          "Unlike most online image services, nothing is uploaded: your pictures are processed by your own browser, which is both faster and more private.",
        ],
        faqs: [
          {
            q: "Are my images uploaded anywhere?",
            a: "No. Images are decoded, resized and re-encoded locally in your browser. Closing the tab discards them.",
          },
          {
            q: "Is there a file size limit?",
            a: "There is no limit set by this site. The practical limit is your device's memory: very large photos or many files at once can be slow on older phones, so process big batches in smaller groups.",
          },
        ],
      },
    },
  },
  {
    id: "pdf-tools",
    order: 4,
    texts: {
      en: {
        slug: "pdf-tools",
        name: "PDF tools",
        title: "Free Online PDF Tools That Work in Your Browser",
        metaDescription:
          "Merge PDF files for free without uploading them. PDF tools that run entirely in your browser, with no sign-up and no watermark.",
        h1: "PDF tools",
        blurb: "Merge and organise PDFs",
        intro: [
          "PDF files often contain contracts, invoices or personal documents, which is exactly the kind of file you should think twice about uploading to a stranger's server. The PDF tools here work on your device, so the documents never leave it.",
          "You can combine several files into one, reorder them and download the result immediately, with no watermark.",
        ],
        faqs: [
          {
            q: "Is it safe to use these tools with private documents?",
            a: "Files are read and processed by your browser and are not sent to a server. Closing the tab removes them from memory.",
          },
          {
            q: "Can you open password-protected PDFs?",
            a: "Not at the moment. Remove the password in the app that created the file, then add it again.",
          },
        ],
      },
    },
  },
  {
    id: "text-tools",
    order: 5,
    texts: {
      en: {
        slug: "text-tools",
        name: "Text tools",
        title: "Free Online Text Tools: Word Counter & More",
        metaDescription:
          "Free text tools for writers, students and marketers. Count words and characters, check reading time and keyword density. Private and instant.",
        h1: "Text tools",
        blurb: "Count and analyse text",
        intro: [
          "Text tools help you measure and shape writing: how long an essay is, whether a meta description fits, or which words you repeat too often. They work as you type, so you can edit and re-check in one place.",
          "Your text stays in the browser. Nothing is saved or sent, which makes these tools safe for drafts and confidential documents.",
        ],
        faqs: [
          {
            q: "Is my text stored?",
            a: "No. The text you paste exists only in your browser tab and disappears when you close it.",
          },
          {
            q: "Do the tools work with languages other than English?",
            a: "Yes. Counting handles accented characters, emoji and languages written without spaces, such as Chinese or Japanese, using the browser's built-in text segmentation.",
          },
        ],
      },
    },
  },
  {
    id: "generators",
    order: 6,
    texts: {
      en: {
        slug: "generators",
        name: "Generators",
        title: "Free Online Generators: QR Codes & More",
        metaDescription:
          "Free online generators that run in your browser. Create QR codes for links, Wi-Fi, contacts and more, and download them as PNG or SVG.",
        h1: "Generators",
        blurb: "QR codes and more",
        intro: [
          "Generators create something new from a few inputs: a QR code for a link, a Wi-Fi network or a contact card. The results are produced on your device and can be downloaded in print-ready formats.",
          "Because nothing is sent to a server, the data you encode, such as a Wi-Fi password, is never shared with us.",
        ],
        faqs: [
          {
            q: "Do generated codes expire?",
            a: "No. The QR codes here are static: the data is stored in the image itself, so they work forever and do not depend on this website.",
          },
          {
            q: "Can I use the results commercially?",
            a: "Yes. What you generate is yours to use, including on printed materials.",
          },
        ],
      },
    },
  },
];

export function getCategory(id: CategoryId): CategoryConfig {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}

export function categoryTexts(id: CategoryId, locale: Locale): CategoryTexts {
  return getCategory(id).texts[locale] ?? getCategory(id).texts.en;
}

export function categoryBySlug(locale: Locale, slug: string): CategoryConfig | undefined {
  return categories.find((c) => (c.texts[locale]?.slug ?? c.texts.en.slug) === slug && (locale === "en" || c.texts[locale]));
}

export function categoryPath(id: CategoryId, locale: Locale): string {
  return `/${locale}/${categoryTexts(id, locale).slug}`;
}

export const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
