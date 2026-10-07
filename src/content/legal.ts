import { siteConfig } from "@/config/site";
import type { ByLocale } from "@/i18n/config";

export type LegalId = "about" | "privacy" | "terms" | "cookies" | "contact";
export type LegalPageContent = {
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const brand = siteConfig.name;
const email = siteConfig.contactEmail;

/**
 * Legal texts. They are a sensible starting point written for a static, privacy-friendly tools site,
 * not legal advice: review them (and the operator/contact details) before launch, and again when you
 * enable advertising or analytics. See README → "Before you launch".
 */
export const legalContent: ByLocale<Record<LegalId, LegalPageContent>> = {
  en: {
    about: {
      title: `About ${brand}`,
      metaDescription: `${brand} offers free online calculators, converters, image and PDF tools that run in your browser, so your files and data stay on your device.`,
      h1: `About ${brand}`,
      intro: `${brand} is a collection of free online tools for everyday tasks: calculating ages and dates, converting units, compressing images, merging PDFs and more.`,
      sections: [
        {
          heading: "What we believe",
          paragraphs: [
            "A tool should do one job well, load quickly on any phone and ask for nothing in return. There are no accounts, no watermarks and no daily limits.",
            "Whenever it is technically possible, the work happens inside your browser. That is why you can compress a photo or merge a contract without uploading it to someone else's server.",
          ],
        },
        {
          heading: "How the tools are built",
          paragraphs: [
            "Each tool comes with a written explanation of how it works, worked examples and answers to common questions, so you can check the result instead of trusting it blindly. Calculators use exact calendar and unit definitions rather than rough approximations.",
            "If you find a mistake, a missing unit or an idea for a new tool, we would like to hear about it.",
          ],
        },
        {
          heading: "How the site is funded",
          paragraphs: [
            "The site is free to use. We may display advertising in the future to cover running costs. If we do, ads will be clearly labelled, will never sit above the tool, and this site will explain how they work in the privacy and cookie policies.",
          ],
        },
        { heading: "Get in touch", paragraphs: [`Write to us at ${email}.`] },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      metaDescription: `How ${brand} handles data: tools run in your browser, files are not uploaded, and we collect as little information as possible.`,
      h1: "Privacy policy",
      intro: `Last updated ${siteConfig.legalUpdated}. This policy explains what information ${brand} handles when you use the website and the tools on it.`,
      sections: [
        {
          heading: "The short version",
          paragraphs: [
            "We do not ask you to create an account. Text, numbers, images and PDF files you use in a tool are processed by your own browser and are not uploaded to our servers.",
          ],
        },
        {
          heading: "Information processed by the tools",
          paragraphs: [
            "Files and values you enter stay on your device. We cannot see them, store them or recover them. Closing the tab discards them. Some tools load their code on demand from our own servers, which is not the same as sending us your data.",
          ],
        },
        {
          heading: "Information collected automatically",
          paragraphs: [
            "Like any website, our hosting provider receives technical information when a page is requested: IP address, browser type, requested address and time. This is stored in server logs for security and reliability and is deleted after a limited period.",
          ],
        },
        {
          heading: "Analytics and advertising",
          paragraphs: [
            "If we enable Google Analytics or Google AdSense, those services may set cookies or use similar technologies to measure traffic and show ads. Where the law requires it, we will ask for your consent first and you will be able to change your choice. See the cookie policy for details.",
            "Google explains how it uses data from sites that use its services at policies.google.com/technologies/partner-sites.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Depending on where you live (for example under the GDPR, the UK GDPR or the CCPA) you may have the right to access, correct or delete personal data we hold about you, to object to processing and to complain to your data protection authority. Because we hold almost no personal data, requests are usually simple: write to us and we will answer.",
          ],
        },
        {
          heading: "Children",
          paragraphs: ["The site is not directed at children under 13 and we do not knowingly collect their personal data."],
        },
        {
          heading: "Changes and contact",
          paragraphs: [`We will update this page when our practices change and show the date at the top. Questions about privacy can be sent to ${email}.`],
        },
      ],
    },
    terms: {
      title: "Terms of Use",
      metaDescription: `The terms that apply when you use ${brand}: acceptable use, accuracy of results, intellectual property and limits of liability.`,
      h1: "Terms of use",
      intro: `Last updated ${siteConfig.legalUpdated}. By using ${brand} you agree to these terms. If you do not agree, please do not use the website.`,
      sections: [
        {
          heading: "Using the site",
          paragraphs: [
            "You may use the tools for personal and commercial purposes. You agree not to misuse the site: for example by attempting to disrupt it, scraping it at a rate that affects other visitors, or using it to process material you have no right to use.",
          ],
        },
        {
          heading: "Accuracy of results",
          paragraphs: [
            "We work to make the tools accurate, but results are provided for information only. Check important results, such as dates for legal deadlines, measurements for construction or amounts for financial decisions, before you rely on them. The tools are not professional legal, financial or medical advice.",
          ],
        },
        {
          heading: "Your content",
          paragraphs: [
            "You keep all rights to the files and text you process. They are handled in your browser and we do not receive or claim any rights over them. You are responsible for having the right to use them.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [`The website, its design, texts and code are owned by the operator of ${brand} or its licensors. You may link to any page. Please do not copy the content of the site to republish it elsewhere.`],
        },
        {
          heading: "No warranty and limitation of liability",
          paragraphs: [
            "The website and tools are provided “as is” and “as available” without warranties of any kind. To the extent permitted by law, we are not liable for any loss or damage arising from the use of, or inability to use, the site. Nothing in these terms limits liability that cannot be limited by law.",
          ],
        },
        {
          heading: "Changes and contact",
          paragraphs: [`We may update these terms; the date above shows the latest version. Questions can be sent to ${email}.`],
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      metaDescription: `Which cookies and similar technologies ${brand} uses today, which optional ones may be added later and how you can control them.`,
      h1: "Cookie policy",
      intro: `Last updated ${siteConfig.legalUpdated}. This page explains how ${brand} uses cookies and similar technologies.`,
      sections: [
        {
          heading: "What are cookies?",
          paragraphs: ["Cookies are small text files that a website stores on your device. Similar technologies, such as local storage, work in comparable ways."],
        },
        {
          heading: "What we use today",
          paragraphs: [
            "The website does not set cookies of its own and does not use local storage to track you. The tools keep what you enter only in the memory of the open tab.",
          ],
        },
        {
          heading: "Optional cookies we may add",
          paragraphs: [
            "If we enable Google Analytics, it uses cookies to measure how many people use the site and which pages are popular. If we enable Google AdSense, Google and its partners may use cookies to show and measure ads, which can include personalised ads. These optional cookies are not set until the relevant service is switched on and, where the law requires it, until you consent.",
          ],
        },
        {
          heading: "Controlling cookies",
          paragraphs: [
            "You can block or delete cookies in your browser settings. Blocking cookies does not stop the tools from working. Google also lets you manage ad personalisation at adssettings.google.com.",
          ],
        },
        { heading: "Contact", paragraphs: [`Questions about this policy can be sent to ${email}.`] },
      ],
    },
    contact: {
      title: "Contact",
      metaDescription: `Contact ${brand}: report a mistake, suggest a new tool, ask a privacy question or tell us how we can improve.`,
      h1: "Contact us",
      intro: `We read every message. The fastest way to reach us is by email: ${email}.`,
      sections: [
        {
          heading: "What to write to us about",
          paragraphs: [
            "Report a wrong result or a broken tool: tell us which tool, what you entered and what you expected. Suggest a new tool or a missing unit. Ask a privacy or legal question. Or tell us what would make a tool easier to use.",
          ],
        },
        {
          heading: "Good to know",
          paragraphs: [
            "We usually reply within a few working days. Because files are processed in your browser and never uploaded, we cannot recover or open a file for you, and we cannot see what you entered in a tool. Please do not send sensitive documents by email.",
          ],
        },
      ],
    },
  },
};
