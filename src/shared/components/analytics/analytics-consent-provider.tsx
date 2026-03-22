"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { KEYS, read, write } from "@/lib/storage";

interface AnalyticsConsentContextType {
  hasConsent: boolean | null;
  setConsent: (consent: boolean) => void;
}

const AnalyticsConsentContext = createContext<
  AnalyticsConsentContextType | undefined
>(undefined);

export function AnalyticsConsentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = read(KEYS.analyticsConsent);
    if (consent === "accepted") {
      setHasConsent(true);
    } else if (consent === "declined") {
      setHasConsent(false);
    }
  }, []);

  const setConsent = (consent: boolean) => {
    setHasConsent(consent);
    write(KEYS.analyticsConsent, consent ? "accepted" : "declined");
  };

  return (
    <AnalyticsConsentContext.Provider value={{ hasConsent, setConsent }}>
      {children}
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent() {
  const context = useContext(AnalyticsConsentContext);
  if (context === undefined) {
    throw new Error(
      "useAnalyticsConsent must be used within an AnalyticsConsentProvider"
    );
  }
  return context;
}
