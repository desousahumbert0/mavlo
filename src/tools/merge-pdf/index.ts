import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "merge-pdf",
    category: "pdf-tools",
    glyph: "PDF",
    slugs: { en: "merge-pdf" },
    texts: {
      en: {
        name: "Merge PDF",
        title: "Merge PDF: Combine PDF Files Into One, Free & Private",
        metaDescription:
          "Combine several PDF files into a single document. Reorder files, see page counts and download the merged PDF. Runs in your browser, so nothing is uploaded.",
        h1: "Merge PDF Files",
        tagline: "Combine PDFs into one document, in the order you choose. Nothing is uploaded.",
      },
    },
    keywords: ["pdf", "merge", "combine", "join", "append", "concatenate", "merge pdf", "combine pdf", "pdf merger", "documents", "files"],
    related: ["image-compressor", "heic-to-jpg", "word-counter"],
    flags: { new: true, popular: true, recommended: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "Merging PDFs is one of the most common document tasks: a signed contract and its annexes, a scan and its cover page, or invoices collected into a single file for the accountant. This tool combines any number of PDF files into one document, keeping every page exactly as it is, in the order you choose.",
        "Most online mergers make you upload your documents to a server. This one does not. The merge runs inside your browser, so contracts, ID scans and financial statements never leave your device, and there is no file size limit imposed by a server.",
      ],
      howTo: [
        "Drop two or more PDF files onto the box, or choose them from your device.",
        "Use the up and down buttons to put the files in the order you want them to appear. Remove any file you added by mistake.",
        "Check the page count and size for each file, and the total at the bottom.",
        "Press Merge PDFs, then download the combined document.",
      ],
      howItWorks: {
        paragraphs: [
          "A PDF file is a structured container of pages, fonts, images and metadata. The merger reads each source document, copies its pages into a new document and writes the result as a single PDF. Pages are copied as they are, so text stays selectable and searchable, and vector graphics and images keep their original quality. Nothing is rasterised or recompressed.",
          "Password-protected PDFs cannot be read without their password, so they are rejected with a clear message. Remove the protection in the program that created them, then add them again. Form fields and links usually survive, but bookmarks and document-level features such as outlines from the source files are not carried into the merged file.",
          "The merged document is built in memory on your device. For very large files, such as hundreds of megabytes in total, an older phone may run out of memory. In that case, merge in smaller groups and then merge the results.",
        ],
        formula: "merged.pdf = pages(file 1) + pages(file 2) + … + pages(file n)",
      },
      examples: [
        { title: "A contract with its annexes", body: "Add the contract and the three annexes, move the annexes below the contract in order and merge to one file to email." },
        { title: "Scanned pages from separate files", body: "Add each scan, order them by page number and merge them into one PDF to upload to a portal." },
        { title: "Monthly invoices for your accountant", body: "Add twelve invoice PDFs, sort them by month and merge them into one year-end document." },
      ],
      useCases: [
        "Combining a contract, its annexes and signature pages into one file.",
        "Putting scanned pages, forms and supporting documents together for an application.",
        "Collecting receipts or invoices into a single PDF for expenses or accounting.",
        "Making one handout from several chapters, reports or slides exported as PDF.",
      ],
      tips: [
        "Name your files with numbers (01, 02, 03) before merging, so they are already in the right order when you add them.",
        "If the merged file is too big to send, run photos and scans through the Image Compressor before turning them into PDFs.",
      ],
      faqs: [
        { q: "Are my PDF files uploaded to a server?", a: "No. The files are read and combined inside your browser. They never reach our servers, which makes the tool suitable for confidential documents." },
        { q: "Is there a limit on file size or number of files?", a: "This site does not set one. The practical limit is your device's memory. Merging a few files of several megabytes each works smoothly on any modern phone or computer." },
        { q: "Will the quality of my PDFs change?", a: "No. Pages are copied without being recompressed or converted to images. Text stays sharp and searchable and images keep their quality." },
        { q: "Why was one of my files rejected?", a: "The most common reason is password protection. The tool cannot open encrypted PDFs, so remove the password first. A damaged or non-PDF file is also rejected." },
        { q: "Can I change the order after adding files?", a: "Yes. Use the up and down buttons next to each file to reorder them before merging. You can also remove files you do not need." },
      ],
    },
  },
  Tool,
};
