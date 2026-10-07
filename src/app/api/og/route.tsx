import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

/** Social preview image: /api/og?title=...&sub=... (cached aggressively, see next.config.ts). */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Free online tools").slice(0, 90);
  const sub = (searchParams.get("sub") || "").slice(0, 60);
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#0b7a75", color: "#ffffff" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          {sub && <div style={{ display: "flex", marginTop: 24, fontSize: 36, opacity: 0.85 }}>{sub}</div>}
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>Free, private, runs in your browser</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
