import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "image-compressor",
    category: "image-tools",
    glyph: "Img",
    slugs: { en: "image-compressor" },
    texts: {
      en: {
        name: "Image Compressor",
        title: "Image Compressor: Reduce JPG, PNG & WebP Size Online",
        metaDescription:
          "Compress JPG, PNG and WebP images in your browser. Choose quality and size, compare before and after, and download one file or a ZIP. Nothing is uploaded.",
        h1: "Image Compressor",
        tagline: "Make photos smaller for the web or email. Private: nothing leaves your device.",
      },
    },
    keywords: ["compress", "image", "photo", "picture", "reduce size", "shrink", "optimize", "jpg", "jpeg", "png", "webp", "resize", "file size", "kb", "mb", "compress image"],
    related: ["heic-to-jpg", "merge-pdf", "qr-code-generator"],
    flags: { popular: true, recommended: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "Large photos slow down websites, fill up email attachments and exceed upload limits on forms. This image compressor makes JPG, PNG and WebP files smaller by re-encoding them at the quality you choose and, if you want, scaling them down to a maximum width or height. You see the new size and the percentage saved for every image straight away.",
        "Unlike most online compressors, the work happens in your browser. Your pictures are never uploaded, so it is safe for ID photos, documents and private shots, and there is no waiting for a server to answer.",
      ],
      howTo: [
        "Drop images onto the box or choose files. You can add several at once.",
        "Pick an output format and a quality. 75 to 85 is a good range for photos.",
        "Optionally limit the longest side, for example to 1920 pixels for a full-screen web image.",
        "Check the size and savings for each file, then download images one by one or all together as a ZIP.",
      ],
      howItWorks: {
        paragraphs: [
          "JPEG and WebP are lossy formats: they save space by discarding detail the eye barely notices. The quality setting controls how much is discarded. Lowering it from 100 to 80 usually cuts a photo to a third of its size or less with no visible difference, while going below 60 starts to show blocky artefacts.",
          "PNG is lossless, so the quality slider has no effect on PNG output. The ways to make a PNG smaller are to reduce its pixel dimensions or to convert it to WebP or JPEG. Convert to JPEG only when the picture has no transparency, since JPEG fills transparent areas with white.",
          "Most of a photo's weight comes from its pixel count. A 4,000 pixel wide picture shown in a 1,000 pixel wide slot wastes about 94% of its pixels, which is why limiting the longest side is often the biggest saving. If a result would be larger than the original, the tool keeps the original file instead.",
        ],
        formula: "new size ≈ pixels × bits per pixel at the chosen quality\nsavings % = (original − new) ÷ original × 100",
      },
      examples: [
        { title: "A 4 MB phone photo for a website", body: "Set the quality to 80, limit the longest side to 1920 pixels and keep JPEG. The photo typically drops to a few hundred kilobytes." },
        { title: "A screenshot saved as PNG", body: "Choose WebP at quality 85. Screenshots with flat colours compress very well in WebP, often to a fraction of the PNG size." },
        { title: "An attachment that is too large", body: "Resize to 1600 pixels and use quality 75 to bring several photos under an email or form upload limit." },
      ],
      useCases: [
        "Speeding up a website or blog by shrinking its images, which also helps search rankings through better page speed.",
        "Fitting photos into email attachments, application portals and forms with file size limits.",
        "Saving space on a phone, a drive or a cloud account.",
        "Preparing product, profile and social media images in a consistent size.",
      ],
      tips: [
        "Compress from the original photo, not from an image that was already compressed. Repeated lossy compression adds up.",
        "Choose WebP when you control where the image is used. All modern browsers support it and files are typically 25 to 35% smaller than JPEG.",
      ],
      faqs: [
        { q: "Are my images uploaded to a server?", a: "No. Images are decoded and re-encoded locally by your browser using the canvas. They never leave your device and are discarded when you close the tab." },
        { q: "What quality should I choose?", a: "For photos, 75 to 85 gives a large saving with almost no visible loss. For images with text or sharp edges, try 85 to 90. Compare the result before using it in an important place." },
        { q: "Why did my PNG not get smaller?", a: "PNG is lossless and ignores the quality setting. Reduce the maximum size or choose WebP or JPEG as the output format. If nothing helps, the file was already well optimised and the original is kept." },
        { q: "Is metadata such as location removed?", a: "Yes. Re-encoding through the canvas drops EXIF metadata, including GPS location and camera details. The picture is still rotated correctly according to its orientation." },
        { q: "Is there a limit on the number or size of files?", a: "This site sets no limit. Very large images or many files at once can be slow on older phones, so process big batches in smaller groups." },
      ],
    },
  },
  Tool,
};
