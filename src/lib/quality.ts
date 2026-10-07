import { locales, type Locale } from "@/i18n/config";
import { categoryTexts } from "@/config/categories";
import { getToolById, isToolAvailable, tools, toolContent, toolTexts } from "@/tools/registry";
import type { ToolModule } from "@/tools/types";

/**
 * Anti-thin-content gate. Runs during `next build` (generateStaticParams): the build
 * fails if a published tool page is below the minimum quality bar, so weak pages
 * can never reach production. Thresholds are intentionally modest; raise them as the site matures.
 */
const MIN_WORDS = 300;
const MIN_FAQS = 4;
const MIN_STEPS = 3;
const MIN_EXAMPLES = 2;
const MIN_RELATED = 2;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function toolProblems(tool: ToolModule, locale: Locale): string[] {
  const problems: string[] = [];
  const c = toolContent(tool, locale);
  const t = toolTexts(tool, locale);

  const total =
    c.intro.reduce((n, p) => n + words(p), 0) +
    c.howItWorks.paragraphs.reduce((n, p) => n + words(p), 0) +
    c.examples.reduce((n, e) => n + words(e.title) + words(e.body), 0) +
    c.useCases.reduce((n, u) => n + words(u), 0) +
    (c.tips ?? []).reduce((n, u) => n + words(u), 0) +
    c.faqs.reduce((n, f) => n + words(f.q) + words(f.a), 0);

  if (total < MIN_WORDS) problems.push(`only ${total} words of guide content (min ${MIN_WORDS})`);
  if (c.faqs.length < MIN_FAQS) problems.push(`needs at least ${MIN_FAQS} FAQs`);
  if (c.howTo.length < MIN_STEPS) problems.push(`needs at least ${MIN_STEPS} how-to steps`);
  if (c.examples.length < MIN_EXAMPLES) problems.push(`needs at least ${MIN_EXAMPLES} worked examples`);
  if (tool.config.related.length < MIN_RELATED) problems.push(`needs at least ${MIN_RELATED} related tools`);
  for (const id of tool.config.related) {
    const rel = getToolById(id);
    if (!rel) problems.push(`related tool "${id}" does not exist`);
    else if (!isToolAvailable(rel, locale)) problems.push(`related tool "${id}" is not available in ${locale}`);
  }
  if (t.metaDescription.length < 70 || t.metaDescription.length > 165) {
    problems.push(`meta description is ${t.metaDescription.length} characters (aim for 70-160)`);
  }
  if (t.title.length > 64) problems.push(`title is ${t.title.length} characters (max 64)`);
  try {
    categoryTexts(tool.config.category, locale);
  } catch {
    problems.push("unknown category");
  }
  return problems;
}

export function assertSiteQuality(): void {
  const errors: string[] = [];
  const slugs = new Set<string>();
  for (const locale of locales) {
    for (const tool of tools) {
      if (!isToolAvailable(tool, locale)) continue;
      const key = `${locale}/${tool.config.slugs[locale]}`;
      if (slugs.has(key)) errors.push(`duplicate slug: ${key}`);
      slugs.add(key);
      for (const p of toolProblems(tool, locale)) errors.push(`[${locale}] ${tool.config.id}: ${p}`);
    }
  }
  if (errors.length === 0) return;
  const message = `Content quality check failed:\n - ${errors.join("\n - ")}`;
  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(message);
}
