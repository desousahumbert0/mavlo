import type { NextConfig } from "next";
import { defaultLocale } from "./src/i18n/config";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** Paths that exist only under /<locale>/... Visitors (and old links) without a locale prefix are redirected. */
const unprefixed = [
  "/tools",
  "/about",
  "/privacy",
  "/terms",
  "/cookies",
  "/contact",
  "/calculators",
  "/converters",
  "/image-tools",
  "/pdf-tools",
  "/text-tools",
  "/generators",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/", destination: `/${defaultLocale}`, permanent: false },
      { source: "/tools/:slug", destination: `/${defaultLocale}/tools/:slug`, permanent: true },
      ...unprefixed.map((p) => ({ source: p, destination: `/${defaultLocale}${p}`, permanent: true })),
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/og",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
