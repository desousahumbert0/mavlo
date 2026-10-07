import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "qr-code-generator",
    category: "generators",
    glyph: "QR",
    slugs: { en: "qr-code-generator" },
    texts: {
      en: {
        name: "QR Code Generator",
        title: "QR Code Generator: Free QR Codes for URLs, Wi-Fi & More",
        metaDescription:
          "Create QR codes for links, text, Wi-Fi, email, phone numbers and contacts. Custom colours and size, PNG and SVG download. No sign-up and no expiry.",
        h1: "QR Code Generator",
        tagline: "Static QR codes for links, Wi-Fi, contacts and more. Free, with no expiry.",
      },
    },
    keywords: ["qr", "qr code", "barcode", "wifi qr", "url to qr", "link to qr", "vcard", "contact qr", "scan", "generator", "qrcode", "svg"],
    related: ["image-compressor", "word-counter", "heic-to-jpg"],
    flags: { popular: true, recommended: true },
    updated: "2026-10-05",
  },
  content: {
    en: {
      intro: [
        "A QR code is a square barcode that a phone camera reads in a moment. This generator creates codes for web links, plain text, Wi-Fi networks, email messages, phone numbers and contact cards. Type the content, adjust the colours and size, and download the code as a PNG image or as a scalable SVG file for print.",
        "The codes created here are static: the information is stored in the pattern itself. That means they never expire, have no scan limit and keep working even if this website disappears. Nothing you type is sent to a server, because the code is drawn in your browser.",
      ],
      howTo: [
        "Choose what the code should contain: a link or text, Wi-Fi, email, phone or contact.",
        "Fill in the fields. The preview updates immediately.",
        "Pick colours, size and error correction. Keep dark modules on a light background for the most reliable scanning.",
        "Download as PNG for screens and documents, or SVG for printing at any size, then test the code with your phone before using it.",
      ],
      howItWorks: {
        paragraphs: [
          "A QR code encodes text as a pattern of dark and light squares, plus built-in error correction that lets a scanner recover the data even when part of the code is dirty or damaged. There are four levels: L recovers about 7% of the code, M about 15%, Q about 25% and H about 30%. Higher levels survive more damage but make the pattern denser.",
          "The generator builds the text in the format phones recognise. A Wi-Fi code contains the network name, password and security type, so scanning it offers to join the network. An email code opens a message with the address, subject and body filled in. A contact code uses the vCard format, so the phone offers to save the contact.",
          "Scanners need contrast and a quiet zone, the blank margin around the code. A dark code on a light background with a margin of at least four modules is the safest. The tool warns you if the colours are too close together. Inverted codes (light on dark) fail on many scanner apps.",
        ],
        formula: "text → bytes → error-correction blocks → module matrix → image (PNG or SVG)",
      },
      examples: [
        { title: "A link to your website on a flyer", body: "Choose “Link or text”, paste the address and download the SVG. Print it at least 2 cm (about ¾ inch) wide." },
        { title: "A Wi-Fi code for guests", body: "Choose “Wi-Fi”, enter the network name and password and print the code. Guests scan it and join without typing the password." },
        { title: "A contact card for a business card", body: "Choose “Contact”, enter your name, phone, email and website. Scanning the code offers to save you as a contact." },
      ],
      useCases: [
        "Linking printed material, packaging and signs to a website, menu or form.",
        "Sharing Wi-Fi access with guests without spelling out a password.",
        "Putting contact details or an email address on a business card.",
        "Sharing a long link or snippet of text between a computer and a phone.",
      ],
      tips: [
        "Always test the finished code with at least one phone, in the size and place where it will be used.",
        "Use a short link. The fewer characters, the simpler the code and the easier it is to scan from a distance.",
      ],
      faqs: [
        { q: "Do these QR codes expire?", a: "No. They are static, so the data is stored in the code itself. There is no account, tracking or redirect that could stop working, and there is no scan limit." },
        { q: "Is it free for commercial use?", a: "Yes. You can use the codes you create for personal and commercial purposes, with no watermark." },
        { q: "What size should I print a QR code?", a: "As a rule, make the code at least 2 × 2 cm. For scanning from a distance, allow about 10 cm of width per metre of distance. Download the SVG for sharp printing at any size." },
        { q: "Which error correction level should I choose?", a: "Medium is a good default. Choose Quartile or High if the code will be printed on rough surfaces or might get scuffed. Higher levels make the code denser, so keep the content short." },
        { q: "Is the content of my QR code stored anywhere?", a: "No. The code is drawn in your browser. What you type is not sent to us, which makes the tool suitable for Wi-Fi passwords and contact details." },
      ],
    },
  },
  Tool,
};
