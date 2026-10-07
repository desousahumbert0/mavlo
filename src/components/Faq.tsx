export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-2">
      {items.map((f) => (
        <details key={f.q} className="rounded-xl border border-line bg-surface px-4 py-3">
          <summary className="cursor-pointer font-medium">{f.q}</summary>
          <p className="mt-2 leading-7 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
