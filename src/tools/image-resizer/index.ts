import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "image-resizer",
    category: "image-tools",
    glyph: "↔",
    slugs: { en: "image-resizer" },
    texts: {
      en: {
        name: "Image Resizer",
        title: "Image Resizer: Change Image Width & Height in Pixels or %",
        metaDescription:
          "Resize JPG, PNG and WebP images to an exact width and height in pixels or by percentage, keep the aspect ratio and download. Free and private, no upload.",
        h1: "Image Resizer",
        tagline: "Set an exact size in pixels or percent, keep the proportions, download the result.",
      },
    },
    keywords: ["resize", "image resizer", "photo resizer", "change size", "scale image", "shrink image", "enlarge", "dimensions", "width", "height", "pixels", "resize jpg", "resize png", "thumbnail"],
    related: ["image-compressor", "aspect-ratio-calculator", "jpg-to-pdf"],
    flags: { new: true, popular: true },
    updated: "2026-10-09",
  },
  content: {
    en: {
      intro: [
        "Websites, social networks, forms and printers all ask for images of a particular size. This image resizer changes the width and height of a JPG, PNG or WebP picture to the exact number of pixels you need, or scales it by a percentage, and lets you download the result straight away.",
        "Keep the lock on and the other side follows automatically, so the picture is never stretched or squashed. The resizing happens in your browser: your photo is not uploaded anywhere, and the original file is never changed.",
      ],
      howTo: [
        "Drop an image onto the box, or choose one from your device. Its current size is shown.",
        "Choose Pixels or Percent, then type a new width or height. With the lock on, the other value updates to keep the proportions.",
        "Pick the output format and, for JPG or WebP, a quality.",
        "Press Resize, check the preview and the new file size, then download.",
      ],
      howItWorks: {
        paragraphs: [
          "Resizing redraws the picture on a canvas of the new size using high-quality smoothing. Shrinking an image throws away pixels it no longer needs, which gives a smaller file. Enlarging adds pixels by interpolation, so it makes the picture bigger but not sharper, and strong enlargements look soft.",
          "Keeping the aspect ratio means multiplying width and height by the same factor. If a 4000 by 3000 photo is set to 1200 pixels wide, the height becomes 1200 × 3000 ÷ 4000, which is 900 pixels. If you unlock the ratio you can enter both values freely, at the cost of stretching the picture.",
          "Photos are rotated according to the orientation recorded by the camera, so portrait shots are not turned on their side. Transparent areas in PNG and WebP files are kept, and are filled with white when you save as JPG because JPG has no transparency. Browsers limit the size of a canvas, so extremely large outputs, above roughly 100 megapixels, are refused with a message.",
        ],
        formula: "new height = new width × original height ÷ original width\npercent: new size = original size × percent ÷ 100",
      },
      examples: [
        { title: "A phone photo for a website", body: "A 4000 × 3000 photo resized to 1600 pixels wide becomes 1600 × 1200. Save it as WebP at 80% quality to make the file much smaller too." },
        { title: "A profile picture of exactly 400 × 400", body: "Turn the lock off, enter 400 and 400. If the photo is not square, crop it first so that the face is not stretched." },
        { title: "Half-size screenshots", body: "Switch to Percent and enter 50. A 2560 × 1440 screenshot becomes 1280 × 720." },
      ],
      useCases: [
        "Preparing images for blogs, online shops, social media and email signatures.",
        "Meeting the pixel dimensions required by an application form or a print service.",
        "Creating small thumbnails from large photos.",
        "Reducing the file size of a picture by shrinking it before sharing.",
      ],
      tips: [
        "Resize from the original image whenever you can. Enlarging an image that was already shrunk gives poor results.",
        "Use the Aspect Ratio Calculator to find a matching height for a width such as 16:9.",
      ],
      faqs: [
        { q: "Is my image uploaded to a server?", a: "No. The picture is resized inside your browser. It never leaves your device and the original file is not modified." },
        { q: "How do I keep the picture from looking stretched?", a: "Leave the lock on. When you change the width, the height is calculated from the original proportions, and the other way round." },
        { q: "Will resizing reduce the quality?", a: "Shrinking keeps images sharp. Enlarging cannot add real detail, so large enlargements look soft. JPG and WebP also lose a little detail at lower quality settings." },
        { q: "Which formats are supported?", a: "JPG, PNG and WebP can be opened, and you can save the result as any of the three. For iPhone HEIC photos, use the HEIC to JPG tool first." },
        { q: "What is the maximum size I can create?", a: "Browsers limit canvas size, so this tool allows up to 16,384 pixels on a side and about 100 megapixels in total, and less on older phones." },
      ],
    },
  },
  Tool,
};
