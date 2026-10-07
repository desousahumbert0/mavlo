/** Browser-only image helpers (canvas). Imported from client components only. */
export type OutputMime = "image/jpeg" | "image/webp" | "image/png";

export const extensionFor = (mime: string): string => (mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png");

async function toBitmap(file: Blob): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

export type ReencodeResult = { blob: Blob; width: number; height: number; resized: boolean };

/** Decodes an image, optionally shrinks it so its longest side is `maxSide`, and re-encodes it. */
export async function reencodeImage(file: Blob, opts: { mime: OutputMime; quality: number; maxSide: number | null }): Promise<ReencodeResult> {
  const bitmap = await toBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  let resized = false;
  if (opts.maxSide && Math.max(width, height) > opts.maxSide) {
    const scale = opts.maxSide / Math.max(width, height);
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
    resized = true;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing surface for this image.");
  if (opts.mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, opts.mime, opts.quality));
  canvas.width = 0;
  canvas.height = 0;
  if (!blob || blob.type !== opts.mime) {
    throw new Error(`Your browser cannot save images as ${extensionFor(opts.mime).toUpperCase()}. Try another output format.`);
  }
  return { blob, width, height, resized };
}
