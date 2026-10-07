/**
 * AdSense configuration. Ads are OFF by default.
 *
 * To enable later: set NEXT_PUBLIC_ADS_ENABLED=true, NEXT_PUBLIC_ADSENSE_CLIENT
 * and the slot ids you created in AdSense (see README → "Enable AdSense").
 * Each placement can also be switched off individually below.
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

export type AdSlotId = "below-tool" | "in-content" | "sidebar";

export const adSlots: Record<AdSlotId, { enabled: boolean; slotId: string; minHeight: number }> = {
  /** Directly under the tool: the highest-value, least intrusive placement. */
  "below-tool": { enabled: true, slotId: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_TOOL || "", minHeight: 280 },
  /** Between the guide sections, after the examples. */
  "in-content": { enabled: true, slotId: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT || "", minHeight: 280 },
  /** Reserved for a wide-screen sidebar. Not rendered yet. */
  sidebar: { enabled: false, slotId: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "", minHeight: 600 },
};

export function isAdSlotActive(slot: AdSlotId): boolean {
  const cfg = adSlots[slot];
  return ADS_ENABLED && cfg.enabled && Boolean(ADSENSE_CLIENT) && Boolean(cfg.slotId);
}
