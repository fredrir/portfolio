"use client";

import { Analytics } from "@vercel/analytics/react";
import { useAnalyticsConsent } from "./AnalyticsConsentProvider";

export function ConditionalAnalytics() {
  const { hasConsent } = useAnalyticsConsent();

  if (hasConsent === true) {
    return <Analytics />;
  }

  return null;
}
