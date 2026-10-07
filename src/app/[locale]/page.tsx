import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import SearchBox from "@/components/SearchBox";
import ToolCard from "@/components/ToolCard";
import { categoryPath, categoryTexts, sortedCategories } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/config";
import { fmt, getDictionary } from "@/i18n/dictionary";
import { buildSearchIndex } from "@/lib/search-index";
import { buildMetadata, pathsForAllLocales, websiteLd } from "@/lib/seo";
import { toolsForLocale, toolsInCategory } from "@/tools/registry";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/${locale}`,
    languagePaths: pathsForAllLocales((l) => `/${l}`),
    title: fmt(dict.home.title, { brand: siteConfig.name }),
    description: dict.home.description,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const all = toolsForLocale(locale);
  const sections = [
    { title: dict.home.popular, tools: all.filter((t) => t.config.flags?.popular) },
    { title: dict.home.new, tools: all.filter((t) => t.config.flags?.new) },
    { title: dict.home.recommended, tools: all.filter((t) => t.config.flags?.recommended) },
  ].filter((s) => s.tools.length > 0);

  return (
    <>
      <JsonLd data={websiteLd(locale)} />
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{dict.home.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{dict.home.subtitle}</p>
          <div className="mt-8 max-w-2xl">
            <SearchBox size="lg" entries={buildSearchIndex(locale)} label={dict.search.label} placeholder={dict.search.placeholder} noResults={dict.search.noResults} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        <section aria-labelledby="home-categories">
          <h2 id="home-categories" className="text-2xl font-bold tracking-tight">
            {dict.home.categories}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((c) => {
              const texts = categoryTexts(c.id, locale);
              const n = toolsInCategory(c.id, locale).length;
              return (
                <li key={c.id}>
                  <Link href={categoryPath(c.id, locale)} className="block rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold">{texts.name}</span>
                      <span className="text-xs text-muted">{n === 1 ? dict.category.toolsCountOne : fmt(dict.category.toolsCount, { n })}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{texts.blurb}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {sections.map((s) => (
          <section key={s.title} aria-label={s.title}>
            <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.tools.map((t) => (
                <ToolCard key={t.config.id} tool={t} locale={locale} newLabel={dict.tool.newBadge} />
              ))}
            </div>
          </section>
        ))}

        <section className="grid gap-6 sm:grid-cols-3" aria-label="Why use these tools">
          {dict.home.features.map((f) => (
            <div key={f.title}>
              <h2 className="font-semibold">{f.title}</h2>
              <p className="mt-1 leading-7 text-muted">{f.text}</p>
            </div>
          ))}
        </section>

        <section className="panel flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">{dict.home.ctaTitle}</h2>
            <p className="mt-1 text-muted">{dict.home.ctaText}</p>
          </div>
          <Link href={`/${locale}/tools`} className="btn btn-primary shrink-0">
            {dict.home.ctaButton}
          </Link>
        </section>
      </div>
    </>
  );
}
