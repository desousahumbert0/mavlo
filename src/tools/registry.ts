/**
 * Tool registry. To add a tool: create a folder in src/tools/<slug>/ exporting a
 * `tool: ToolModule` (see README) and add it to the array below. Nothing else
 * needs to change: pages, sitemap, search, categories and related links are
 * generated from this list.
 */
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { CategoryId } from "@/config/categories";
import type { ToolModule, ToolTexts, ToolContent } from "./types";

import { tool as ageCalculator } from "./age-calculator";
import { tool as dateCalculator } from "./date-calculator";
import { tool as percentageCalculator } from "./percentage-calculator";
import { tool as wordCounter } from "./word-counter";
import { tool as lengthConverter } from "./length-converter";
import { tool as weightConverter } from "./weight-converter";
import { tool as imageCompressor } from "./image-compressor";
import { tool as heicToJpg } from "./heic-to-jpg";
import { tool as qrCodeGenerator } from "./qr-code-generator";
import { tool as mergePdf } from "./merge-pdf";

export const tools: ToolModule[] = [
  ageCalculator,
  dateCalculator,
  percentageCalculator,
  wordCounter,
  lengthConverter,
  weightConverter,
  imageCompressor,
  heicToJpg,
  qrCodeGenerator,
  mergePdf,
];

export function getToolById(id: string): ToolModule | undefined {
  return tools.find((t) => t.config.id === id);
}

/** A tool is published in a locale only when it has a slug, texts and content for it (avoids untranslated duplicates). */
export function isToolAvailable(tool: ToolModule, locale: Locale): boolean {
  const c = tool.config;
  return Boolean(c.slugs[locale] && c.texts[locale] && tool.content[locale]);
}

export function toolsForLocale(locale: Locale): ToolModule[] {
  return tools.filter((t) => isToolAvailable(t, locale));
}

export function toolsInCategory(category: CategoryId, locale: Locale): ToolModule[] {
  return toolsForLocale(locale).filter((t) => t.config.category === category);
}

export function getToolBySlug(locale: Locale, slug: string): ToolModule | undefined {
  return toolsForLocale(locale).find((t) => t.config.slugs[locale] === slug);
}

export function toolSlug(tool: ToolModule, locale: Locale): string {
  return tool.config.slugs[locale] ?? tool.config.slugs.en;
}

export function toolPath(tool: ToolModule, locale: Locale): string {
  return `/${locale}/tools/${toolSlug(tool, locale)}`;
}

export function toolTexts(tool: ToolModule, locale: Locale): ToolTexts {
  return tool.config.texts[locale] ?? tool.config.texts.en;
}

export function toolContent(tool: ToolModule, locale: Locale): ToolContent {
  return tool.content[locale] ?? tool.content.en;
}

/** Locales in which a tool is published, with their paths. Used for hreflang. */
export function toolLanguagePaths(tool: ToolModule): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of locales) if (isToolAvailable(tool, l)) out[l] = toolPath(tool, l);
  return out;
}

export function relatedTools(tool: ToolModule, locale: Locale): ToolModule[] {
  return tool.config.related
    .map((id) => getToolById(id))
    .filter((t): t is ToolModule => Boolean(t) && isToolAvailable(t as ToolModule, locale));
}
