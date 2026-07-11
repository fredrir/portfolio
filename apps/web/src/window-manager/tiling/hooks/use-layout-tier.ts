import { useEffect, useState } from "react";
import { LayoutEngine } from "../layout-engine";
import type { LayoutTier, TilingState } from "../types";

export function useLayoutTier(tiling: TilingState, getOpenPaneIds: () => string[]) {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>("large");

  useEffect(() => {
    const check = () => {
      const tier = LayoutEngine.getTier(window.innerWidth);
      setLayoutTier((prev) => {
        if (prev === tier) return prev;
        const tierConfig = LayoutEngine.getTierConfig(tier);
        const next = LayoutEngine.ensurePanesInLayout(
          LayoutEngine.cloneLayout(tierConfig.layout),
          getOpenPaneIds(),
          [...tierConfig.rowHeights],
          tierConfig.colWidths.map((r) => [...r]),
        );
        tiling.setLayout(next.layout);
        tiling.setRowHeights(next.rowHeights);
        tiling.setColWidths(next.colWidths);
        return tier;
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return layoutTier;
}
