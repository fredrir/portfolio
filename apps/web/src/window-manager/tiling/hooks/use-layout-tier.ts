import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { WindowStates } from "../../types";
import { LayoutEngine } from "../layout-engine";
import type { LayoutTier, TilingState } from "../types";

export function useLayoutTier(
  tiling: TilingState,
  setStates: Dispatch<SetStateAction<WindowStates>>,
) {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>("large");

  useEffect(() => {
    const check = () => {
      const tier = LayoutEngine.getTier(window.innerWidth);
      setLayoutTier((prev) => {
        if (prev === tier) return prev;
        const tierConfig = LayoutEngine.getTierConfig(tier);
        tiling.setLayout(LayoutEngine.cloneLayout(tierConfig.layout));
        tiling.setRowHeights([...tierConfig.rowHeights]);
        tiling.setColWidths(tierConfig.colWidths.map((r) => [...r]));
        setStates((prevStates) =>
          LayoutEngine.closePanesNotInLayout(prevStates, tierConfig.layout),
        );
        return tier;
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return layoutTier;
}
