"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface RecaptchaContextType {
  executeRecaptcha: ((action: string) => Promise<string>) | null;
  configured: boolean;
  ready: boolean;
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  executeRecaptcha: null,
  configured: false,
  ready: false,
});

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const configured = Boolean(SITE_KEY);

  useEffect(() => {
    if (!SITE_KEY) return;
    if (document.querySelector(`script[src*="recaptcha"]`)) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setReady(true));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      window.grecaptcha.ready(() => setReady(true));
    };
    document.head.appendChild(script);
  }, []);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      if (!ready || !window.grecaptcha) {
        throw new Error("reCAPTCHA not ready");
      }
      return window.grecaptcha.execute(SITE_KEY, { action });
    },
    [ready],
  );

  return (
    <RecaptchaContext.Provider
      value={{ executeRecaptcha: ready ? executeRecaptcha : null, configured, ready }}
    >
      {children}
    </RecaptchaContext.Provider>
  );
}
