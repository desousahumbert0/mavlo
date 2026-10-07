import type { MetadataRoute } from "next";
import { categoryPath, sortedCategories } from "@/config/categories";
import { absoluteUrl } from "@/config/site";
import { locales, type Locale } from "@/i18n/config";
import { languageAlternates, pathsForAllLocales } from "@/lib/seo";
import { toolLanguagePaths, toolsForLocale, tools, toolsInCategory } from "@/tools/registry";

const LEGAL = ["about", "privacy", "terms", "cookies", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const add = (paths: Partial<Record<Locale, string>>, extra: { lastModified?: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }) => {
    const languages = languageAlternates(paths);
    for (const l of locales) {
      const p = paths[l];
      if (p) entries.push({ url: absoluteUrl(p), ...extra, alternates: { languages } });
    }
  };
  const everyLocale = pathsForAllLocales;

  add(everyLocale((l) => `/${l}`), { priority: 1, changeFrequency: "weekly" });
  add(everyLocale((l) => `/${l}/tools`), { priority: 0.8, changeFrequency: "weekly" });
  for (const c of sortedCategories) {
    const paths: Partial<Record<Locale, string>> = {};
    for (const l of locales) if (toolsInCategory(c.id, l).length > 0) paths[l] = categoryPath(c.id, l);
    if (Object.keys(paths).length > 0) add(paths, { priority: 0.8, changeFrequency: "monthly" });
  }
  for (const tool of tools) {
    if (!locales.some((l) => toolsForLocale(l).includes(tool))) continue;
    add(toolLanguagePaths(tool), { lastModified: tool.config.updated, priority: 0.9, changeFrequency: "monthly" });
  }
  for (const page of LEGAL) add(everyLocale((l) => `/${l}/${page}`), { priority: 0.3, changeFrequency: "yearly" });

  return entries;
}
