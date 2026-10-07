import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/Breadcrumbs";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ToolCard from "@/components/ToolCard";
import { categoryPath, categoryTexts } from "@/config/categories";
import { absoluteUrl } from "@/config/site";
import { isLocale, locales } from "@/i18n/config";
import { fmt, getDictionary } from "@/i18n/dictionary";
import { assertSiteQuality } from "@/lib/quality";
import { breadcrumbLd, buildMetadata, faqLd, webApplicationLd } from "@/lib/seo";
import { getToolBySlug, relatedTools, toolContent, toolLanguagePaths, toolPath, toolSlug, toolTexts, toolsForLocale } from "@/tools/registry";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  assertSiteQuality();
  return locales.flatMap((locale) => toolsForLocale(locale).map((t) => ({ locale, slug: toolSlug(t, locale) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const tool = getToolBySlug(locale, slug);
  if (!tool) return {};
  const t = toolTexts(tool, locale);
  return buildMetadata({
    locale,
    path: toolPath(tool, locale),
    languagePaths: toolLanguagePaths(tool),
    title: t.title,
    description: t.metaDescription,
    ogSubtitle: categoryTexts(tool.config.category, locale).name,
  });
}

export default async function ToolPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tool = getToolBySlug(locale, slug);
  if (!tool) notFound();

  const dict = await getDictionary(locale);
  const t = toolTexts(tool, locale);
  const c = toolContent(tool, locale);
  const category = categoryTexts(tool.config.category, locale);
  const related = relatedTools(tool, locale);
  const Tool = tool.Tool;

  const crumbs = [
    { name: dict.nav.home, path: `/${locale}` },
    { name: category.name, path: categoryPath(tool.config.category, locale) },
    { name: t.name, path: toolPath(tool, locale) },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <JsonLd
        data={[
          webApplicationLd({ name: t.name, description: t.metaDescription, url: absoluteUrl(toolPath(tool, locale)), locale }),
          faqLd(c.faqs),
          breadcrumbLd(crumbs),
        ]}
      />
      <Breadcrumbs items={crumbs} label={dict.breadcrumbs.label} />

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.h1}</h1>
        <p className="mt-2 max-w-2xl text-lg text-muted">{t.tagline}</p>
      </header>

      <section aria-label={t.name} className="panel mt-6 p-4 sm:p-6">
        <Tool />
        <p className="mt-5 border-t border-line pt-3 text-xs text-muted">{dict.tool.privacyBadge}</p>
      </section>

      <AdSlot slot="below-tool" label={dict.tool.ad} />

      <article className="mt-10 space-y-10">
        <section className="space-y-4">
          {c.intro.map((p) => (
            <p key={p} className="max-w-3xl text-lg leading-8">
              {p}
            </p>
          ))}
        </section>

        <section aria-labelledby="how-to">
          <h2 id="how-to" className="text-2xl font-bold tracking-tight">
            {dict.tool.howToUse}
          </h2>
          <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-6 leading-7">
            {c.howTo.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="text-2xl font-bold tracking-tight">
            {dict.tool.howItWorks}
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 leading-7">
            {c.howItWorks.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {c.howItWorks.formula && <pre className="overflow-x-auto rounded-lg border border-line bg-surface p-3 text-sm">{c.howItWorks.formula}</pre>}
          </div>
        </section>

        <section aria-labelledby="examples">
          <h2 id="examples" className="text-2xl font-bold tracking-tight">
            {dict.tool.examples}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {c.examples.map((e) => (
              <div key={e.title} className="rounded-xl border border-line bg-surface p-4">
                <h3 className="font-semibold">{e.title}</h3>
                <p className="mt-1 leading-7 text-muted">{e.body}</p>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slot="in-content" label={dict.tool.ad} />

        <section aria-labelledby="use-cases">
          <h2 id="use-cases" className="text-2xl font-bold tracking-tight">
            {dict.tool.useCases}
          </h2>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 leading-7">
            {c.useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </section>

        {c.tips && c.tips.length > 0 && (
          <section aria-labelledby="tips">
            <h2 id="tips" className="text-2xl font-bold tracking-tight">
              {dict.tool.tips}
            </h2>
            <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-6 leading-7">
              {c.tips.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="faq">
          <h2 id="faq" className="mb-4 text-2xl font-bold tracking-tight">
            {dict.tool.faq}
          </h2>
          <Faq items={c.faqs} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related">
            <h2 id="related" className="text-2xl font-bold tracking-tight">
              {dict.tool.related}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <ToolCard key={r.config.id} tool={r} locale={locale} newLabel={dict.tool.newBadge} />
              ))}
            </div>
            <p className="mt-4">
              <Link className="font-medium text-brand hover:underline" href={categoryPath(tool.config.category, locale)}>
                {fmt(dict.tool.moreIn, { category: category.name })}
              </Link>
            </p>
          </section>
        )}
      </article>
    </div>
  );
}
