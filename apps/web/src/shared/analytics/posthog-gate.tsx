"use client";

import { useEffect } from "react";

import { initPosthog } from "@/shared/analytics/posthog";
import { useAnalyticsConsent } from "@/shared/components/analytics/analytics-consent-provider";

/** Initializes PostHog exactly once, only after explicit consent. */
export function PosthogGate() {
  const { hasConsent } = useAnalyticsConsent();

  useEffect(() => {
    if (hasConsent === true) {
      void initPosthog();
    }
  }, [hasConsent]);

  return null;
}
