import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/ToolCard";
import { categoryPath, categoryTexts, sortedCategories } from "@/config/categories";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { breadcrumbLd, buildMetadata, itemListLd, pathsForAllLocales } from "@/lib/seo";
import { toolPath, toolTexts, toolsForLocale, toolsInCategory } from "@/tools/registry";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/${locale}/tools`,
    languagePaths: pathsForAllLocales((l) => `/${l}/tools`),
    title: dict.toolsPage.title,
    description: dict.toolsPage.description,
  });
}

export default async function AllToolsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const crumbs = [
    { name: dict.nav.home, path: `/${locale}` },
    { name: dict.toolsPage.h1, path: `/${locale}/tools` },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <JsonLd
        data={[
          breadcrumbLd(crumbs.map((c) => ({ name: c.name, path: c.path }))),
          itemListLd(toolsForLocale(locale).map((t) => ({ name: toolTexts(t, locale).name, path: toolPath(t, locale) }))),
        ]}
      />
      <Breadcrumbs items={crumbs} label={dict.breadcrumbs.label} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{dict.toolsPage.h1}</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">{dict.toolsPage.intro}</p>
      <div className="mt-10 space-y-12">
        {sortedCategories.map((c) => {
          const list = toolsInCategory(c.id, locale);
          if (list.length === 0) return null;
          return (
            <section key={c.id} aria-labelledby={`cat-${c.id}`}>
              <h2 id={`cat-${c.id}`} className="text-2xl font-bold tracking-tight">
                <Link href={categoryPath(c.id, locale)} className="hover:text-brand">
                  {categoryTexts(c.id, locale).name}
                </Link>
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((t) => (
                  <ToolCard key={t.config.id} tool={t} locale={locale} newLabel={dict.tool.newBadge} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
