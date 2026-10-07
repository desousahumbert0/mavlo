import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/ToolCard";
import { categoryBySlug, categoryPath, categoryTexts, sortedCategories } from "@/config/categories";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { breadcrumbLd, buildMetadata, faqLd, itemListLd } from "@/lib/seo";
import { toolPath, toolTexts, toolsInCategory } from "@/tools/registry";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    sortedCategories.filter((c) => toolsInCategory(c.id, locale).length > 0).map((c) => ({ locale, category: categoryTexts(c.id, locale).slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale)) return {};
  const cat = categoryBySlug(locale, category);
  if (!cat) return {};
  const t = categoryTexts(cat.id, locale);
  const languagePaths: Partial<Record<Locale, string>> = {};
  for (const l of locales) if (toolsInCategory(cat.id, l).length > 0) languagePaths[l] = categoryPath(cat.id, l);
  return buildMetadata({ locale, path: categoryPath(cat.id, locale), languagePaths, title: t.title, description: t.metaDescription, ogSubtitle: t.name });
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  const cat = categoryBySlug(locale, category);
  if (!cat) notFound();
  const dict = await getDictionary(locale);
  const t = categoryTexts(cat.id, locale);
  const list = toolsInCategory(cat.id, locale);
  const others = sortedCategories.filter((c) => c.id !== cat.id && toolsInCategory(c.id, locale).length > 0);
  const crumbs = [
    { name: dict.nav.home, path: `/${locale}` },
    { name: t.name, path: categoryPath(cat.id, locale) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          itemListLd(list.map((x) => ({ name: toolTexts(x, locale).name, path: toolPath(x, locale) }))),
          faqLd(t.faqs),
        ]}
      />
      <Breadcrumbs items={crumbs} label={dict.breadcrumbs.label} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.h1}</h1>
      <div className="mt-3 max-w-3xl space-y-3 text-lg leading-8 text-muted">
        {t.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="cat-tools">
        <h2 id="cat-tools" className="text-2xl font-bold tracking-tight">
          {dict.category.tools}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((x) => (
            <ToolCard key={x.config.id} tool={x} locale={locale} newLabel={dict.tool.newBadge} />
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-3xl" aria-labelledby="cat-faq">
        <h2 id="cat-faq" className="mb-4 text-2xl font-bold tracking-tight">
          {dict.category.faq}
        </h2>
        <Faq items={t.faqs} />
      </section>

      <nav className="mt-12" aria-label="Other categories">
        <ul className="flex flex-wrap gap-2">
          {others.map((c) => (
            <li key={c.id}>
              <Link className="btn btn-sm" href={categoryPath(c.id, locale)}>
                {categoryTexts(c.id, locale).name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
