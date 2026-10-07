import type { Locale } from "@/i18n/config";
import { categoryTexts } from "@/config/categories";
import type { SearchEntry } from "./search";
import { toolPath, toolsForLocale, toolTexts } from "@/tools/registry";

/** Server-side: builds the small JSON index the search box receives as a prop. */
export function buildSearchIndex(locale: Locale): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const tool of toolsForLocale(locale)) {
    const texts = toolTexts(tool, locale);
    const category = categoryTexts(tool.config.category, locale).name;
    const href = toolPath(tool, locale);
    entries.push({
      id: tool.config.id,
      title: texts.name,
      subtitle: category,
      href,
      keywords: tool.config.keywords.map((k) => k.toLowerCase()),
      kind: "tool",
    });
    for (const preset of tool.config.presets ?? []) {
      entries.push({
        id: `${tool.config.id}:${preset.label}`,
        title: preset.label,
        subtitle: texts.name,
        href: `${href}?${preset.query}`,
        keywords: [...(preset.keywords ?? []), ...tool.config.keywords].map((k) => k.toLowerCase()),
        kind: "preset",
      });
    }
  }
  return entries;
}
