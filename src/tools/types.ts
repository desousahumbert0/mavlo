import type { ComponentType } from "react";
import type { ByLocale } from "@/i18n/config";
import type { CategoryId } from "@/config/categories";

export type ToolTexts = {
  /** Short name used in cards, search and breadcrumbs. */
  name: string;
  /** SEO <title> without the brand suffix (aim for 50-60 characters). */
  title: string;
  /** SEO meta description (70-160 characters). */
  metaDescription: string;
  /** Visible <h1>. */
  h1: string;
  /** One-line summary shown under the h1 and in lists. */
  tagline: string;
};

export type ToolContent = {
  intro: string[];
  howTo: string[];
  howItWorks: { paragraphs: string[]; formula?: string };
  examples: { title: string; body: string }[];
  useCases: string[];
  tips?: string[];
  faqs: { q: string; a: string }[];
};

export type ToolConfig = {
  /** Stable internal id. Equals the English slug. Never change it. */
  id: string;
  category: CategoryId;
  /** 1-3 characters shown in the tool icon (e.g. "%" or "QR"). */
  glyph: string;
  /** URL slug per locale (English required). */
  slugs: ByLocale<string>;
  texts: ByLocale<ToolTexts>;
  /** Extra search terms (synonyms, units, typical queries). */
  keywords: string[];
  /** Ids of related tools, used for internal linking. */
  related: string[];
  /** Search shortcuts such as "KG to Pounds" that open the tool pre-filled. */
  presets?: { label: string; query: string; keywords?: string[] }[];
  flags?: { popular?: boolean; new?: boolean; recommended?: boolean };
  /** Last substantial update (YYYY-MM-DD), used in the sitemap. */
  updated: string;
};

export type ToolModule = {
  config: ToolConfig;
  content: ByLocale<ToolContent>;
  Tool: ComponentType;
};
