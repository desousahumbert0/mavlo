import { ADSENSE_CLIENT, adSlots, isAdSlotActive, type AdSlotId } from "@/config/ads";
import AdUnit from "./AdUnit";

/**
 * Placeholder for an ad placement. While ads are disabled it renders nothing at all
 * (no markup, no reserved space, no JavaScript). When enabled it reserves the slot's
 * height up front so ads never push content around (CLS).
 */
export default function AdSlot({ slot, label }: { slot: AdSlotId; label: string }) {
  if (!isAdSlotActive(slot)) return null;
  const cfg = adSlots[slot];
  return (
    <aside aria-label={label} className="my-8">
      <p className="mb-1 text-center text-[11px] text-muted">{label}</p>
      <div style={{ minHeight: cfg.minHeight }}>
        <AdUnit client={ADSENSE_CLIENT} slotId={cfg.slotId} />
      </div>
    </aside>
  );
}
