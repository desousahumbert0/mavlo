/**
 * Central site configuration. The brand name is provisional: change `name`
 * here (and the brand strings in the legal content) to rename the whole site.
 */
const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteConfig = {
  name: "Mavlo",
  url: (envUrl || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")).replace(/\/$/, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  /** Date shown on legal pages. Update when you edit them. */
  legalUpdated: "2026-10-04",
};

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
