"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** One AdSense display unit. Only rendered (via AdSlot) when ads are enabled and configured. */
export default function AdUnit({ client, slotId }: { client: string; slotId: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not loaded (blocked or offline): the reserved space simply stays empty. */
    }
  }, []);
  return <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true" />;
}
