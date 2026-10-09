/** Page geometry for "images to PDF". All sizes are PDF points (1 pt = 1/72 inch). */
export type PageMode = "fit" | "a4" | "letter";
export type MarginMode = "none" | "small" | "medium";

export const MARGIN_PT: Record<MarginMode, number> = { none: 0, small: 18, medium: 36 };
const PAGE_PT: Record<"a4" | "letter", [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };

/** Browser pixels are 96 per inch, so one pixel is 0.75 pt. */
const PX_TO_PT = 0.75;

export type PlacedImage = { pageW: number; pageH: number; x: number; y: number; width: number; height: number };

export function layoutImage(imgW: number, imgH: number, mode: PageMode, margin: MarginMode): PlacedImage {
  const m = MARGIN_PT[margin];
  if (mode === "fit") {
    const width = imgW * PX_TO_PT;
    const height = imgH * PX_TO_PT;
    return { pageW: width + 2 * m, pageH: height + 2 * m, x: m, y: m, width, height };
  }
  const [short, long] = PAGE_PT[mode];
  const landscape = imgW > imgH;
  const pageW = landscape ? long : short;
  const pageH = landscape ? short : long;
  const scale = Math.min((pageW - 2 * m) / imgW, (pageH - 2 * m) / imgH);
  const width = imgW * scale;
  const height = imgH * scale;
  return { pageW, pageH, x: (pageW - width) / 2, y: (pageH - height) / 2, width, height };
}
