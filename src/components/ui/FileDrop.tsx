"use client";

import { useId, useState } from "react";

type Props = { accept: string; multiple?: boolean; onFiles: (files: File[]) => void; title: string; hint: string; buttonLabel: string };

/** Drag-and-drop zone with a keyboard-accessible file picker. */
export default function FileDrop({ accept, multiple = true, onFiles, title, hint, buttonLabel }: Props) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const handle = (list: FileList | null) => {
    if (list && list.length > 0) onFiles(Array.from(list));
  };
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      className={`rounded-xl border-2 border-dashed p-6 text-center ${dragging ? "border-brand bg-brand/5" : "border-line"}`}
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="peer sr-only"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
      <label htmlFor={id} className="btn btn-primary mt-4 cursor-pointer peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
        {buttonLabel}
      </label>
    </div>
  );
}
