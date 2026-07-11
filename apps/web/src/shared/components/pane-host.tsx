"use client";

import type { ReactNode } from "react";

/**
 * Container context for the platform panes: establishes a `@container` for the
 * panes' container-query classes and the monospace type scale.
 *
 * Note: this deliberately does NOT use a shadow root. Constructed stylesheets
 * drop `@import` rules (per spec, `replaceSync` ignores them), so adopting the
 * app's Tailwind sheet into a shadow root via `@import` yielded an empty sheet
 * and stripped every utility class from the wrapped panes. Rendering in the
 * light DOM keeps the panes fully styled and consistent with every other pane.
 */
export function PaneHost({ children }: { children: ReactNode }) {
  return <div className="@container h-full font-mono">{children}</div>;
}
