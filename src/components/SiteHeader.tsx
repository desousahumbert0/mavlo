import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import { buildSearchIndex } from "@/lib/search-index";
import SearchBox from "./SearchBox";

export default function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const entries = buildSearchIndex(locale);
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="rgb(var(--brand))" />
            <path d="M7 23V9l9 9 9-9v14" fill="none" stroke="rgb(var(--brand-fg))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {siteConfig.name}
        </Link>
        <div className="order-3 w-full md:order-none md:max-w-md md:flex-1">
          <SearchBox entries={entries} label={dict.search.label} placeholder={dict.search.placeholder} noResults={dict.search.noResults} />
        </div>
        <nav aria-label="Main" className="ml-auto">
          <Link href={`/${locale}/tools`} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-bg">
            {dict.nav.allTools}
          </Link>
        </nav>
      </div>
    </header>
  );
}
