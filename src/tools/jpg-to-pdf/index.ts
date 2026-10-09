import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "jpg-to-pdf",
    category: "pdf-tools",
    glyph: "PDF",
    slugs: { en: "jpg-to-pdf" },
    texts: {
      en: {
        name: "JPG to PDF",
        title: "JPG to PDF: Combine JPG, PNG & WebP Images Into One PDF",
        metaDescription:
          "Turn JPG, PNG and WebP images into a single PDF. Reorder pages, choose A4, Letter or image size and margins, then download. Runs in your browser, no upload.",
        h1: "JPG to PDF Converter",
        tagline: "Put one or many images into a single PDF, in the order you choose.",
      },
    },
    keywords: ["jpg to pdf", "jpeg to pdf", "png to pdf", "image to pdf", "photo to pdf", "picture to pdf", "images to pdf", "webp to pdf", "scan to pdf", "convert image to pdf", "combine images"],
    related: ["merge-pdf", "image-compressor", "image-resizer"],
    flags: { new: true, recommended: true },
    updated: "2026-10-09",
  },
  content: {
    en: {
      intro: [
        "Forms, applications and email attachments often ask for a PDF when all you have is a photo or a scan. This tool turns JPG, PNG and WebP images into a PDF document: one image per page, in the order you choose, ready to download in a few seconds.",
        "Everything happens inside your browser. Your photos, ID scans and receipts are never uploaded to a server, which makes it a safe choice for private documents. You can add many images at once, reorder them and remove the ones you do not need before creating the file.",
      ],
      howTo: [
        "Drop your images onto the box, or choose them from your device. You can add more at any time.",
        "Use the arrows to put the pages in the right order and remove any image you do not want.",
        "Pick a page size (A4, US Letter or the exact size of each image) and a margin.",
        "Press Create PDF, then download the finished file.",
      ],
      howItWorks: {
        paragraphs: [
          "A PDF page can hold an image directly. For JPG files the tool embeds the original JPEG data without recompressing it, so image quality is exactly what you provided and the PDF is about the same size as the pictures. PNG images are embedded losslessly, including transparency. WebP images are first converted to high-quality JPEG, because PDF does not support WebP natively.",
          "Phone photos are often stored sideways with a small tag that tells software how to rotate them. The tool reads that tag and, when a photo needs rotating, redraws it the right way up before adding it, so pages never come out turned.",
          "With A4 or Letter, each image is scaled to fit inside the page and centred, and landscape images get a landscape page. With “Same size as image” each page matches its picture, which is best for scans and screenshots. Margins add white space around the picture.",
        ],
        formula: "page = image scaled to fit (page size − margins), centred\nsame-size page = image pixels × 0.75 pt",
      },
      examples: [
        { title: "Phone photos of a signed document", body: "Add the photos in page order, choose A4 with a small margin and create the PDF. Each photo becomes one A4 page, ready to email." },
        { title: "Screenshots of a conversation or a web page", body: "Choose “Same size as image” with no margin so every page matches its screenshot with no white borders." },
        { title: "A set of receipts for an expense report", body: "Add all the receipt photos, put them in date order and download a single PDF to attach to the claim." },
      ],
      useCases: [
        "Sending scanned or photographed documents to an employer, school, bank or government portal that only accepts PDF.",
        "Combining several receipts, invoices or certificates into one file.",
        "Creating a simple photo album or portfolio that opens the same everywhere.",
        "Archiving screenshots and pictures in a format that does not change between devices.",
      ],
      tips: [
        "If the PDF is too large for an upload limit, shrink the pictures first with the Image Compressor or Image Resizer.",
        "To add existing PDFs afterwards, use the Merge PDF tool.",
      ],
      faqs: [
        { q: "Are my images uploaded to a server?", a: "No. The PDF is built entirely in your browser. Your images never leave your device and disappear when you close the page." },
        { q: "Will the image quality be reduced?", a: "JPG and PNG images are embedded as they are, with no extra compression. WebP images are converted to JPEG at high quality because PDF cannot store WebP." },
        { q: "How do I change the order of the pages?", a: "Use the up and down arrows next to each image. The first image in the list becomes the first page." },
        { q: "Can I convert PNG or WebP files too?", a: "Yes. The tool accepts JPG, PNG and WebP, and you can mix them in the same PDF. Transparent PNG areas stay transparent." },
        { q: "Is there a limit on the number of images?", a: "No limit is set by this site. Very large batches of high-resolution photos use a lot of memory, so on an older phone create several smaller PDFs and combine them with Merge PDF." },
      ],
    },
  },
  Tool,
};
