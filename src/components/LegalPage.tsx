import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { legalContent, type LegalId } from "@/content/legal";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata, pathsForAllLocales } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

function pageContent(locale: Locale, id: LegalId) {
  return (legalContent[locale] ?? legalContent.en)[id];
}

export async function legalMetadata(id: LegalId, params: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = pageContent(locale, id);
  return buildMetadata({ locale, path: `/${locale}/${id}`, languagePaths: pathsForAllLocales((l) => `/${l}/${id}`), title: c.title, description: c.metaDescription });
}

export default async function LegalPage({ id, params }: { id: LegalId; params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const c = pageContent(locale, id);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Breadcrumbs
        label={dict.breadcrumbs.label}
        items={[
          { name: dict.nav.home, path: `/${locale}` },
          { name: c.h1, path: `/${locale}/${id}` },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{c.h1}</h1>
      <p className="mt-3 text-lg leading-8 text-muted">{c.intro}</p>
      <div className="mt-8 space-y-8">
        {c.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold tracking-tight">{s.heading}</h2>
            <div className="mt-2 space-y-3 leading-7">
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
