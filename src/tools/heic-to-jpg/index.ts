import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "heic-to-jpg",
    category: "image-tools",
    glyph: "HEIC",
    slugs: { en: "heic-to-jpg" },
    texts: {
      en: {
        name: "HEIC to JPG",
        title: "HEIC to JPG Converter: iPhone Photos to JPG or PNG",
        metaDescription:
          "Convert iPhone HEIC and HEIF photos to JPG or PNG in your browser. Batch conversion, adjustable quality and ZIP download. Photos are never uploaded.",
        h1: "HEIC to JPG Converter",
        tagline: "Turn iPhone HEIC photos into JPG or PNG files that open everywhere.",
      },
    },
    keywords: ["heic", "heif", "iphone", "convert", "jpg", "jpeg", "png", "photo", "apple", "heic to jpg", "heic to jpeg", "heic to png", "image converter", "ios"],
    related: ["image-compressor", "merge-pdf", "qr-code-generator"],
    flags: { new: true, recommended: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "Since iOS 11, iPhones and iPads save photos in HEIC, also called HEIF, a format that keeps images about half the size of JPEG at similar quality. The catch is compatibility: many Windows PCs, older Android phones, websites, forms and print services cannot open HEIC files. This converter turns them into JPG or PNG, the formats everything understands.",
        "The conversion runs entirely in your browser. Your photos are not uploaded, which matters because phone photos often contain faces, documents and the exact location where they were taken.",
      ],
      howTo: [
        "Drop your HEIC or HEIF files onto the box, or choose them from your device. You can select many at once.",
        "Choose JPG or PNG as the output format. For JPG, pick a quality; 90% is a good default.",
        "Press Convert. Each photo is converted one at a time so even slow phones stay responsive.",
        "Download the photos one by one or all together as a ZIP file.",
      ],
      howItWorks: {
        paragraphs: [
          "HEIC is a container that stores images compressed with the HEVC video codec. The converter loads a small decoding library the first time you press Convert (it is about 1 MB and is not downloaded on other pages), decodes each photo into raw pixels and re-encodes them as JPG or PNG.",
          "JPG is lossy, so the output is a new compression of the original image. At 90% quality the difference is invisible to the eye, while the file is usually larger than the HEIC original. PNG is lossless and produces much larger files, so use it only when you need exact pixels or transparency.",
          "Converting does not carry over metadata in the same way as the original, and Live Photos and depth information are not preserved. Only the main still image is converted. Colour profiles such as Display P3 are converted to standard colours.",
        ],
        formula: "HEIC → decode to pixels → encode as JPG (quality %) or PNG",
      },
      examples: [
        { title: "Sending iPhone photos to a Windows PC", body: "Select the HEIC photos, convert them to JPG at 90% and download the ZIP. The files open in any Windows photo viewer or editor." },
        { title: "Uploading a photo to a form", body: "Many application portals only accept JPG or PNG. Convert the HEIC photo and upload the JPG." },
        { title: "A batch of 40 photos", body: "Drop them all in, convert, then download one ZIP instead of 40 separate files." },
      ],
      useCases: [
        "Opening iPhone photos on Windows, older Android devices or older software.",
        "Uploading photos to websites, marketplaces and forms that reject HEIC.",
        "Sharing pictures with people who cannot open HEIC.",
        "Preparing photos for printing services that require JPG.",
      ],
      tips: [
        "To avoid conversions on your iPhone, go to Settings, Camera, Formats and choose “Most Compatible”. Photos will then be saved as JPG, at the cost of larger files.",
        "After converting, use the Image Compressor if the JPG files are too large for an upload limit.",
      ],
      faqs: [
        { q: "What is a HEIC file?", a: "HEIC is the Apple default image format on iPhones and iPads. It stores photos at roughly half the size of JPEG for similar quality, but is not supported everywhere." },
        { q: "Are my photos uploaded?", a: "No. The conversion happens on your device, inside your browser. The files never reach our servers, so your photos and their location data stay private." },
        { q: "Will I lose quality?", a: "JPG is lossy, so there is a very small change. At 90% quality it is not visible to the eye. Choose PNG to avoid compression, with larger files as the price." },
        { q: "Why is my JPG bigger than the HEIC?", a: "HEIC is a more efficient format, so the same picture takes more space as JPG. Lower the JPG quality or run the result through the Image Compressor if you need smaller files." },
        { q: "Does it work on iPhone and Android?", a: "Yes, in any modern browser. Converting very large batches on an older phone can be slow, so convert them in smaller groups." },
      ],
    },
  },
  Tool,
};
