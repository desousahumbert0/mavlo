"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copy", doneLabel = "Copied" }: { text: string; label?: string; doneLabel?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* clipboard unavailable (insecure context or permission denied) */
        }
      }}
    >
      <span aria-live="polite">{done ? doneLabel : label}</span>
    </button>
  );
}
