"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";

type Props = {
  entries: SearchEntry[];
  label: string;
  placeholder: string;
  noResults: string;
  size?: "md" | "lg";
};

export default function SearchBox({ entries, label, placeholder, noResults, size = "md" }: Props) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const results = useMemo(() => searchEntries(entries, query), [entries, query]);
  const showList = open && query.trim().length > 0;

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      router.push(results[active].href);
      setOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="relative w-full"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        {label}
      </label>
      <input
        id={`${listId}-input`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={`input ${size === "lg" ? "min-h-[56px] rounded-xl px-4 text-lg" : "min-h-[44px]"}`}
      />
      {showList && (
        <ul id={listId} role="listbox" aria-label={label} className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
          {results.length === 0 && <li className="px-4 py-3 text-sm text-muted">{noResults}</li>}
          {results.map((r, i) => (
            <li key={r.id} role="presentation">
              <Link
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                href={r.href}
                tabIndex={-1}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex items-baseline justify-between gap-3 px-4 py-2.5 ${i === active ? "bg-brand/10" : ""}`}
              >
                <span className="font-medium">{r.title}</span>
                <span className="shrink-0 text-xs text-muted">{r.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
