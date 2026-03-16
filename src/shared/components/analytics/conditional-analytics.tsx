"use client";

import { Analytics } from "@vercel/analytics/react";
import { useAnalyticsConsent } from "./analytics-consent-provider";

export function ConditionalAnalytics() {
  const { hasConsent } = useAnalyticsConsent();

  if (hasConsent === true) {
    return <Analytics />;
  }

  return null;
}
