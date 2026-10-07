/**
 * Enabled locales. To add a language, add its code here, create
 * `dictionaries/<code>.ts`, register it in `dictionary.ts` and add translated
 * texts/content to the tools you want to publish in that language.
 * See README → "Add a new language".
 */
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
};

/** Open Graph locale codes. */
export const ogLocales: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_PT",
  it: "it_IT",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** English is mandatory; other locales are optional (tools are only published in locales that have a translation). */
export type ByLocale<T> = { en: T } & { [L in Locale]?: T };

export function localePath(locale: Locale, path = ""): string {
  return `/${locale}${path && path !== "/" ? path : ""}`;
}
