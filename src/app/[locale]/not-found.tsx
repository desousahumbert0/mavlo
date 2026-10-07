import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";

export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{dict.notFound.title}</h1>
      <p className="mt-2 text-muted">{dict.notFound.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/${defaultLocale}`} className="btn btn-primary">
          {dict.notFound.home}
        </Link>
        <Link href={`/${defaultLocale}/tools`} className="btn">
          {dict.notFound.tools}
        </Link>
      </div>
    </div>
  );
}
