"use client";

import { useState, useEffect } from "react";
import { useAnalyticsConsent } from "./AnalyticsConsentProvider";
import Neofetch, { type NeofetchInfoLine, getDefaultInfo } from "@/components/Neofetch";

interface CookieConsentBannerProps {
  locale?: string;
}

const content = {
  en: {
    prompt: "Fredrik Carsten Hansteen requires cookie permissions",
    accept: "[Y] accept",
    decline: "[n] decline",
    info: "[i] info",
    gdprTitle: "GDPR / Privacy Information",
    gdprLines: [
      "Data collected: page views, web vitals, referrers",
      "Provider: Vercel Inc. (San Francisco, CA)",
      "No personal identifiers or IP addresses are stored",
      "Data is aggregated and anonymized",
      "You may withdraw consent at any time by clearing cookies",
      "Legal basis: Art. 6(1)(a) GDPR — your consent",
    ],
    gdprBack: "[q] back",
    cookieLine: "pending...",
  },
  nb: {
    prompt: "Fredrik Carsten Hansteen trenger tilgang til informasjonskapsler",
    accept: "[Y] godta",
    decline: "[n] avslå",
    info: "[i] info",
    gdprTitle: "GDPR / Personvern",
    gdprLines: [
      "Data som samles inn: sidevisninger, web vitals, referanser",
      "Leverandør: Vercel Inc. (San Francisco, CA)",
      "Ingen personlige identifikatorer eller IP-adresser lagres",
      "Data er aggregert og anonymisert",
      "Du kan trekke samtykket tilbake ved å slette cookies",
      "Rettslig grunnlag: Art. 6(1)(a) GDPR — ditt samtykke",
    ],
    gdprBack: "[q] tilbake",
    cookieLine: "venter...",
  },
  nn: {
    prompt: "Fredrik Carsten Hansteen treng tilgang til informasjonskapslar",
    accept: "[Y] godta",
    decline: "[n] avslå",
    info: "[i] info",
    gdprTitle: "GDPR / Personvern",
    gdprLines: [
      "Data som vert samla inn: sidevisingar, web vitals, referansar",
      "Leverandør: Vercel Inc. (San Francisco, CA)",
      "Ingen personlege identifikatorar eller IP-adresser vert lagra",
      "Data er aggregert og anonymisert",
      "Du kan trekkje samtykket tilbake ved å slette cookies",
      "Rettsleg grunnlag: Art. 6(1)(a) GDPR — ditt samtykke",
    ],
    gdprBack: "[q] tilbake",
    cookieLine: "ventar...",
  },
  fr: {
    prompt: "Fredrik Carsten Hansteen nécessite des cookies",
    accept: "[Y] accepter",
    decline: "[n] refuser",
    info: "[i] info",
    gdprTitle: "RGPD / Confidentialité",
    gdprLines: [
      "Données collectées : pages vues, web vitals, référents",
      "Fournisseur : Vercel Inc. (San Francisco, CA)",
      "Aucun identifiant personnel ni adresse IP n'est stocké",
      "Les données sont agrégées et anonymisées",
      "Vous pouvez retirer votre consentement en supprimant les cookies",
      "Base juridique : Art. 6(1)(a) RGPD — votre consentement",
    ],
    gdprBack: "[q] retour",
    cookieLine: "en attente...",
  },
};

function getCookieInfo(locale: string, cookieValue: string): NeofetchInfoLine[] {
  return [...getDefaultInfo(locale), { label: "Cookies", value: cookieValue }];
}

export function CookieConsentBanner({
  locale = "en",
}: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNeofetch, setShowNeofetch] = useState(false);
  const [typed, setTyped] = useState("");
  const [showGdpr, setShowGdpr] = useState(false);
  const { setConsent } = useAnalyticsConsent();

  const text = content[locale as keyof typeof content] || content.en;
  const fullPrompt = text.prompt;

  useEffect(() => {
    const consent = localStorage.getItem("vercel-analytics-consent");
    if (!consent) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="fixed bottom-4 right-4 sm:max-w-2xl z-50">
      <div
        className={`
          font-mono text-sm transition-all duration-250 ease-out
          ${isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        <div className="rounded-md border border-primary/30 bg-background/95 backdrop-blur-sm shadow-lg shadow-primary/5 overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-primary/20 bg-primary/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-muted-foreground">
              fredrir@fredrir:~ (zsh)
            </span>
          </div>

          <div className="p-3 space-y-3">
            {showNeofetch && (
              <div className="pb-1 border-b border-primary/10">
                <Neofetch
                  info={getCookieInfo(locale, text.cookieLine)}
                  animate={true}
                />
              </div>
            )}

            {showNeofetch && (
              <div className="flex gap-2">
                <span className="text-primary shrink-0">$</span>
                <span className="text-foreground">
                  {typed}
                  {!doneTyping && (
                    <span className="inline-block w-1.5 h-4 bg-primary/80 align-middle animate-pulse ml-px" />
                  )}
                </span>
              </div>
            )}

            {showGdpr && (
              <div className="border border-primary/20 rounded px-3 py-2 space-y-1.5 bg-primary/5">
                <div className="text-primary text-xs font-bold">
                  {text.gdprTitle}
                </div>
                {text.gdprLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-primary/60 shrink-0">·</span>
                    <span>{line}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <button
                    onClick={() => setShowGdpr(false)}
                    className="text-xs text-muted-foreground/60 hover:text-muted-foreground hover:underline underline-offset-2 transition-colors"
                  >
                    {text.gdprBack}
                  </button>
                </div>
              </div>
            )}

            {doneTyping && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-primary shrink-0">$</span>
                <button
                  onClick={handleAccept}
                  className="text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors"
                >
                  {text.accept}
                </button>
                <button
                  onClick={handleDecline}
                  className="text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors"
                >
                  {text.decline}
                </button>
                <button
                  onClick={() => setShowGdpr((v) => !v)}
                  className="text-muted-foreground/60 hover:text-muted-foreground hover:underline underline-offset-2 transition-colors ml-auto"
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
