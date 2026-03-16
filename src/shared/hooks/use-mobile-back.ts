"use client";

import { createContext, useContext, useCallback, useRef, useState } from "react";

interface MobileBackContextValue {
  setBackAction: (action: (() => void) | null, label?: string) => void;
  setSubtitle: (subtitle: string | null) => void;
}

export const MobileBackContext = createContext<MobileBackContextValue | null>(null);

export function useMobileBack() {
  return useContext(MobileBackContext);
}

export function useMobileBackState() {
  const backRef = useRef<(() => void) | null>(null);
  const [backLabel, setBackLabel] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [hasBack, setHasBack] = useState(false);

  const setBackAction = useCallback((action: (() => void) | null, label?: string) => {
    backRef.current = action;
    setHasBack(action !== null);
    setBackLabel(label ?? null);
  }, []);

  const triggerBack = useCallback(() => {
    backRef.current?.();
  }, []);

  return { hasBack, backLabel, subtitle, triggerBack, setBackAction, setSubtitle };
}
