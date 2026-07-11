"use client";

let initialized = false;

/**
 * Consent-gated product analytics: loaded dynamically only after the visitor
 * accepts, so declining costs zero bytes. Dormant when no key is configured.
 */
export async function initPosthog(): Promise<void> {
  if (initialized) return;
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) return;
  initialized = true;
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host:
      (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://eu.i.posthog.com",
    capture_pageview: true,
    person_profiles: "identified_only",
    persistence: "localStorage",
  });
}
