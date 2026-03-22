import { useState, useEffect } from "react";
import {
  getLayoutTier,
  getCellPanes,
  LAYOUT_TIERS,
} from "../layout";
import type { CellDef, LayoutTier } from "../layout";
import type { WindowStates } from "../types";

function cloneLayout(layout: CellDef[][]): CellDef[][] {
  return layout.map((row) =>
    row.map((cell) => (Array.isArray(cell) ? [...cell] : cell)),
  );
}

export function useLayoutTier(
  setStates: React.Dispatch<React.SetStateAction<WindowStates>>,
  setLayout: React.Dispatch<React.SetStateAction<CellDef[][]>>,
  setRowHeights: React.Dispatch<React.SetStateAction<number[]>>,
  setColWidths: React.Dispatch<React.SetStateAction<number[][]>>,
) {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>("large");

  useEffect(() => {
    const check = () => {
      const tier = getLayoutTier(window.innerWidth);
      setLayoutTier((prev) => {
        if (prev === tier) return prev;
        const tierConfig = LAYOUT_TIERS[tier];
        const newLayout = tierConfig.layout;
        setLayout(cloneLayout(newLayout));
        setRowHeights([...tierConfig.rowHeights]);
        setColWidths(tierConfig.colWidths.map((r) => [...r]));

        const layoutPanes = new Set(
          newLayout.flat().flatMap((c) => getCellPanes(c)),
        );
        setStates((prevStates) => {
          const next = { ...prevStates };
          for (const id of Object.keys(next)) {
            if (!layoutPanes.has(id) && next[id].isOpen) {
              next[id] = { ...next[id], isOpen: false };
            }
          }
          return next;
        });

        return tier;
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return layoutTier;
}
