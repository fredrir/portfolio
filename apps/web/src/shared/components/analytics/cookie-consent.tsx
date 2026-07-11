"use client";

import { useEffect, useState } from "react";
import { getStaticDictionary } from "@/i18n/dictionaries";
import { MY_EMAIL, MY_NAME } from "@/lib/constants";
import { KEYS, read } from "@/lib/storage";
import Neofetch, { getDefaultInfo, type NeofetchInfoLine } from "@/terminal/neofetch";
import { useAnalyticsConsent } from "./analytics-consent-provider";

interface CookieConsentBannerProps {
  locale?: string;
}

function interpolate(value: string): string {
  return value.replaceAll("{name}", MY_NAME).replaceAll("{email}", MY_EMAIL);
}

function getCookieInfo(
  locale: string,
  cookieLabel: string,
  cookieValue: string,
): NeofetchInfoLine[] {
  return [...getDefaultInfo(locale), { label: cookieLabel, value: cookieValue }];
}

export function CookieConsentBanner({ locale = "en" }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNeofetch, setShowNeofetch] = useState(false);
  const [typed, setTyped] = useState("");
  const [showGdpr, setShowGdpr] = useState(false);
  const { setConsent } = useAnalyticsConsent();

  const text = getStaticDictionary(locale).cookieConsent;
  const fullPrompt = interpolate(text.prompt);

  useEffect(() => {
    if (!read(KEYS.analyticsConsent)) {
      setTimeout(() => setIsVisible(true), 800);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setShowNeofetch(true), 200);
    return () => clearTimeout(t);
  }, [isVisible]);

  useEffect(() => {
    if (!showNeofetch) return;
    const delay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTyped(fullPrompt.slice(0, i + 1));
        i++;
        if (i >= fullPrompt.length) clearInterval(interval);
      }, 18);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(delay);
  }, [showNeofetch, fullPrompt]);

  const doneTyping = typed.length >= fullPrompt.length;

  useEffect(() => {
    if (!isVisible || !doneTyping) return;
    const handler = (e: KeyboardEvent) => {
      if (showGdpr) {
        if (e.key === "q" || e.key === "Q" || e.key === "Escape") {
          setShowGdpr(false);
        }
        return;
      }
      if (e.key === "y" || e.key === "Y" || e.key === "Enter") {
        handleAccept();
      } else if (e.key === "n" || e.key === "N" || e.key === "Escape") {
        handleDecline();
      } else if (e.key === "i" || e.key === "I") {
        setShowGdpr(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isVisible, doneTyping, showGdpr]);

  const handleAccept = () => {
    setConsent(true);
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 250);
  };

  const handleDecline = () => {
    setConsent(false);
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 250);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 z-50 mx-2 sm:max-w-2xl md:right-4 md:mx-0">
      <div
        className={`font-mono text-sm transition-all duration-250 ease-out ${isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        <div className="overflow-hidden rounded-md border border-control-border-hover bg-glass-heavy shadow-lg shadow-wm-shadow-soft backdrop-blur-sm">
          <div className="flex items-center gap-1.5 border-border-medium border-b bg-surface-dim px-3 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-close" />
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-minimize" />
            <div className="h-2.5 w-2.5 rounded-full bg-terminal-maximize" />
            <span className="ml-2 text-muted-foreground text-xs">fredrir@:hansteen:~ (zsh)</span>
          </div>

          <div className="space-y-3 p-3">
            {showNeofetch && (
              <div className="border-border-faint border-b pb-1">
                <Neofetch
                  info={getCookieInfo(locale, text.cookieLabel, text.cookieLine)}
                  animate={true}
                />
              </div>
            )}

            {showNeofetch && (
              <div className="flex gap-2">
                <span className="shrink-0 text-primary">$</span>
                <span className="text-foreground">
                  {typed}
                  {!doneTyping && (
                    <span className="ml-px inline-block h-4 w-1.5 animate-pulse bg-primary-bold align-middle" />
                  )}
                </span>
              </div>
            )}

            {showGdpr && (
              <div className="max-h-64 space-y-1.5 overflow-y-auto rounded border border-border-medium bg-surface-dim px-3 py-2">
                <div className="font-bold text-primary text-xs">{text.gdprTitle}</div>
                {text.gdprLines.map((line, i) => (
                  <div key={i} className="flex gap-2 text-muted-foreground text-xs">
                    <span className="shrink-0 text-primary-soft">·</span>
                    <span>{interpolate(line)}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <button
                    onClick={() => setShowGdpr(false)}
                    className="text-readable text-xs underline-offset-2 transition-colors hover:text-muted-foreground hover:underline"
                  >
                    {text.gdprBack}
                  </button>
                </div>
              </div>
            )}

            {doneTyping && (
              <div className="flex items-center gap-3 pt-1">
                <span className="shrink-0 text-primary">$</span>
                <button
                  onClick={handleAccept}
                  className="text-primary underline-offset-2 transition-colors hover:text-primary-bold hover:underline"
                >
                  {text.accept}
                </button>
                <button
                  onClick={handleDecline}
                  className="text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                >
                  {text.decline}
                </button>
                <button
                  onClick={() => setShowGdpr((v) => !v)}
                  className="ml-auto text-readable underline-offset-2 transition-colors hover:text-muted-foreground hover:underline"
                >
                  {text.info}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
