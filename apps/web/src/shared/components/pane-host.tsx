"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let importSheet: CSSStyleSheet | null = null;

/**
 * Adopts the app's stylesheets into a shadow root via @import so Tailwind
 * utilities work inside; CSS custom properties (theme tokens) inherit
 * through the shadow boundary on their own.
 */
function appStylesheet(): CSSStyleSheet | null {
  if (importSheet) return importSheet;
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  );
  if (links.length === 0) return null;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(
    links.map((l) => `@import url("${l.href}");`).join("\n") +
      "\n:host{display:block;height:100%;}",
  );
  importSheet = sheet;
  return sheet;
}

/**
 * Renders children inside an open shadow root with `contain: content` for
 * style isolation and layout containment. SSR renders children in the light
 * DOM; the shadow root attaches on mount.
 */
export function PaneHost({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;
    try {
      const shadow = host.attachShadow({ mode: "open" });
      const sheet = appStylesheet();
      if (sheet) {
        shadow.adoptedStyleSheets = [sheet];
      }
      setRoot(shadow);
    } catch {
      // attachShadow unavailable — keep light-DOM rendering.
    }
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-full @container font-mono"
      style={{ contain: "content" }}
    >
      {root ? createPortal(children, root as unknown as Element) : children}
    </div>
  );
}
