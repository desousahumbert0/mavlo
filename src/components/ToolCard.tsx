import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { toolPath, toolTexts } from "@/tools/registry";
import type { ToolModule } from "@/tools/types";

export default function ToolCard({ tool, locale, newLabel }: { tool: ToolModule; locale: Locale; newLabel: string }) {
  const t = toolTexts(tool, locale);
  return (
    <Link
      href={toolPath(tool, locale)}
      className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand"
    >
      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
        {tool.config.glyph}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-semibold group-hover:text-brand">
          {t.name}
          {tool.config.flags?.new && <span className="rounded bg-brand px-1.5 py-0.5 text-[11px] font-semibold text-brand-fg">{newLabel}</span>}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{t.tagline}</span>
      </span>
    </Link>
  );
}
