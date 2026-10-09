import assert from "node:assert/strict";
import test from "node:test";
import { categories, categoryBySlug, categoryPath } from "@/config/categories";
import { isAdSlotActive, ADS_ENABLED } from "@/config/ads";
import { locales } from "@/i18n/config";
import { searchEntries } from "@/lib/search";
import { buildSearchIndex } from "@/lib/search-index";
import { assertSiteQuality, toolProblems } from "@/lib/quality";
import { languageAlternates } from "@/lib/seo";
import { tools, toolsForLocale, toolsInCategory, getToolBySlug } from "@/tools/registry";
import sitemap from "../src/app/sitemap";

test("the ten approved Phase 1 tools plus the first six Phase 2 tools are registered", () => {
  const ids = tools.map((t) => t.config.id);
  for (const id of ["age-calculator", "date-calculator", "heic-to-jpg", "image-compressor", "length-converter", "merge-pdf", "percentage-calculator", "qr-code-generator", "weight-converter", "word-counter"]) assert.ok(ids.includes(id), id);
  for (const id of ["jpg-to-pdf", "password-generator", "case-converter", "image-resizer", "aspect-ratio-calculator", "mp4-to-mp3"]) assert.ok(ids.includes(id), id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every tool passes the anti-thin-content gate", () => {
  for (const locale of locales) for (const tool of toolsForLocale(locale)) assert.deepEqual(toolProblems(tool, locale), [], tool.config.id);
  assert.doesNotThrow(() => assertSiteQuality());
});

test("slugs are unique and resolvable; every tool belongs to a known category", () => {
  const slugs = new Set<string>();
  for (const tool of tools) {
    assert.ok(!slugs.has(tool.config.slugs.en), `duplicate ${tool.config.slugs.en}`);
    slugs.add(tool.config.slugs.en);
    assert.equal(getToolBySlug("en", tool.config.slugs.en), tool);
    assert.ok(categories.some((c) => c.id === tool.config.category));
  }
});

test("every category with tools has a hub page, and each tool is in exactly one", () => {
  const total = categories.reduce((n, c) => n + toolsInCategory(c.id, "en").length, 0);
  assert.equal(total, tools.length);
  for (const c of categories) {
    const slug = c.texts.en.slug;
    assert.equal(categoryBySlug("en", slug)?.id, c.id);
    assert.equal(categoryPath(c.id, "en"), `/en/${slug}`);
  }
});

test("search finds tools and shortcuts", () => {
  const index = buildSearchIndex("en");
  const titles = (q: string) => searchEntries(index, q).map((r) => r.title);
  const kg = titles("convert kg");
  assert.ok(kg.includes("Weight Converter"), kg.join());
  assert.ok(kg.includes("KG to Pounds"), kg.join());
  assert.ok(kg.includes("Pounds to KG"), kg.join());
  assert.ok(titles("merge pdf").includes("Merge PDF"));
  assert.ok(titles("heic").includes("HEIC to JPG"));
  assert.ok(titles("how old am i").includes("Age Calculator"));
  assert.ok(titles("cm to inches").includes("CM to Inches"));
  assert.deepEqual(titles("zzzzqqq"), []);
  assert.deepEqual(titles(""), []);
});

test("sitemap lists every page with canonical absolute URLs and hreflang", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  assert.equal(new Set(urls).size, urls.length, "duplicate sitemap URLs");
  assert.ok(urls.every((u) => u.startsWith("http")));
  for (const tool of tools) assert.ok(urls.some((u) => u.endsWith(`/en/tools/${tool.config.slugs.en}`)));
  assert.ok(entries.every((e) => e.alternates?.languages && "x-default" in e.alternates.languages));
});

test("hreflang always includes x-default pointing at English", () => {
  assert.deepEqual(Object.keys(languageAlternates({ en: "/en/x" })).sort(), ["en", "x-default"]);
});

test("ads are disabled by default", () => {
  assert.equal(ADS_ENABLED, false);
  for (const slot of ["below-tool", "in-content", "sidebar"] as const) assert.equal(isAdSlotActive(slot), false);
});
