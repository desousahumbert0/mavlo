import Link from "next/link";

export default function Breadcrumbs({ items, label }: { items: { name: string; path?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-2">
              {item.path && !last ? (
                <Link className="hover:text-fg hover:underline" href={item.path}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-fg" : undefined}>
                  {item.name}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
