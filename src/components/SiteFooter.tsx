import Link from "next/link";
import { categoryPath, categoryTexts, sortedCategories } from "@/config/categories";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";

export default function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const legal = [
    ["about", dict.footer.about],
    ["privacy", dict.footer.privacy],
    ["terms", dict.footer.terms],
    ["cookies", dict.footer.cookies],
    ["contact", dict.footer.contact],
  ] as const;
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{siteConfig.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{dict.footer.tagline}</p>
        </div>
        <nav aria-label={dict.footer.tools}>
          <p className="font-semibold">{dict.footer.tools}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {sortedCategories.map((c) => (
              <li key={c.id}>
                <Link className="hover:text-fg hover:underline" href={categoryPath(c.id, locale)}>
                  {categoryTexts(c.id, locale).name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={dict.footer.company}>
          <p className="font-semibold">{dict.footer.company}</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {legal.map(([id, label]) => (
              <li key={id}>
                <Link className="hover:text-fg hover:underline" href={`/${locale}/${id}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. {dict.footer.rights}
      </p>
    </footer>
  );
}
