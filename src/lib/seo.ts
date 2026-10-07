import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { locales, ogLocales, type Locale } from "@/i18n/config";

/** hreflang map. Only locales that have the page are listed; x-default points to English. */
export function languageAlternates(paths: Partial<Record<Locale, string>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of locales) {
    const p = paths[l];
    if (p) out[l] = absoluteUrl(p);
  }
  if (paths.en) out["x-default"] = absoluteUrl(paths.en);
  return out;
}

export function ogImage(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("sub", subtitle);
  return absoluteUrl(`/api/og?${params.toString()}`);
}

type PageMetaInput = {
  locale: Locale;
  /** Path of this page in the current locale, e.g. /en/tools/age-calculator */
  path: string;
  /** Paths of the same page in every locale it exists in (including this one). */
  languagePaths?: Partial<Record<Locale, string>>;
  title: string;
  description: string;
  /** Use the title as-is without the "| Brand" suffix. */
  absoluteTitle?: boolean;
  ogSubtitle?: string;
  noindex?: boolean;
};

export function buildMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${siteConfig.name}`;
  const image = ogImage(input.title.replace(/\s*\|.*$/, ""), input.ogSubtitle);
  const languages = input.languagePaths ? languageAlternates(input.languagePaths) : undefined;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url, ...(languages && Object.keys(languages).length > 1 ? { languages } : {}) },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description: input.description,
      siteName: siteConfig.name,
      locale: ogLocales[input.locale],
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ---------- JSON-LD builders ---------- */

export function websiteLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: siteConfig.name,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.svg"),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl(`/${locale}`),
        name: siteConfig.name,
        inLanguage: locale,
        publisher: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };
}

export function webApplicationLd(input: { name: string; description: string; url: string; locale: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    inLanguage: input.locale,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (modern web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function itemListLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** Builds a { locale: path } map for a page that exists in every enabled locale (home, categories, legal pages...). */
export function pathsForAllLocales(build: (locale: Locale) => string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of locales) out[l] = build(l);
  return out;
}
