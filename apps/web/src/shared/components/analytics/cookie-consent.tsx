"use client";

import { useState, useEffect } from "react";
import { MY_NAME, MY_EMAIL } from "@/lib/constants";
import { KEYS, read } from "@/lib/storage";
import { useAnalyticsConsent } from "./analytics-consent-provider";
import Neofetch, {
  type NeofetchInfoLine,
  getDefaultInfo,
} from "@/terminal/neofetch";

interface CookieConsentBannerProps {
  locale?: string;
}

const content = {
  en: {
    prompt: `${MY_NAME} wants your cookies`,
    accept: "[Y] accept",
    decline: "[n] decline",
    info: "[i] info",
    gdprTitle: "GDPR / Privacy Information",
    gdprLines: [
      `Data controller: ${MY_NAME} (${MY_EMAIL})`,
      "Collected after consent: page views, referrer, browser and country, aggregated",
      "Product analytics: PostHog (EU region); first-party counts aggregated on my own server",
      "PostHog stores a first-party id in this site's local storage; no cross-site tracking cookies",
      "No IP addresses are stored — your country is derived at the Cloudflare edge",
      "Spam protection: Google reCAPTCHA guards the contact form and may set Google cookies",
      "Legal basis: Art. 6(1)(a) GDPR / Norwegian Personal Data Act (Personopplysningsloven)",
      "Withdraw consent any time by clearing this site's local storage",
      "Right to complain: Datatilsynet (Norwegian Data Protection Authority) — datatilsynet.no",
    ],
    gdprBack: "[q] back",
    cookieLine: "pending...",
  },
  nb: {
    prompt: `${MY_NAME} har lyst på dine informasjonskapsler`,
    accept: "[Y] godta",
    decline: "[n] avslå",
    info: "[i] info",
    gdprTitle: "GDPR / Personverninformasjon",
    gdprLines: [
      `Behandlingsansvarlig: ${MY_NAME} (${MY_EMAIL})`,
      "Samles inn etter samtykke: sidevisninger, henvisning, nettleser og land, aggregert",
      "Produktanalyse: PostHog (EU-region); førsteparts tellinger aggregeres på min egen server",
      "PostHog lagrer en førsteparts-id i nettstedets lokale lagring; ingen sporingskapsler på tvers av nettsteder",
      "Ingen IP-adresser lagres — landet ditt utledes på Cloudflare-kanten",
      "Spamvern: Google reCAPTCHA beskytter kontaktskjemaet og kan sette Google-kapsler",
      "Rettslig grunnlag: Art. 6(1)(a) GDPR / Personopplysningsloven § 1",
      "Trekk samtykket tilbake når som helst ved å slette nettstedets lokale lagring",
      "Klagerett: Datatilsynet — datatilsynet.no",
    ],
    gdprBack: "[q] tilbake",
    cookieLine: "venter...",
  },
  nn: {
    prompt: `${MY_NAME} treng dine informasjonskapslar`,
    accept: "[Y] godta",
    decline: "[n] avslå",
    info: "[i] info",
    gdprTitle: "GDPR / Personverninformasjon",
    gdprLines: [
      `Behandlingsansvarleg: ${MY_NAME} (${MY_EMAIL})`,
      "Vert samla inn etter samtykke: sidevisingar, tilvising, nettlesar og land, aggregert",
      "Produktanalyse: PostHog (EU-region); førsteparts teljingar vert aggregerte på min eigen server",
      "PostHog lagrar ein førsteparts-id i nettstaden si lokale lagring; ingen sporingskapslar på tvers av nettstader",
      "Ingen IP-adresser vert lagra — landet ditt vert utleidd på Cloudflare-kanten",
      "Spamvern: Google reCAPTCHA vernar kontaktskjemaet og kan setje Google-kapslar",
      "Rettsleg grunnlag: Art. 6(1)(a) GDPR / Personopplysningslova § 1",
      "Trekk samtykket tilbake når som helst ved å slette nettstaden si lokale lagring",
      "Klagerett: Datatilsynet — datatilsynet.no",
    ],
    gdprBack: "[q] tilbake",
    cookieLine: "ventar...",
  },
  fr: {
    prompt: `${MY_NAME} a besoin de vos cookies`,
    accept: "[Y] accepter",
    decline: "[n] refuser",
    info: "[i] info",
    gdprTitle: "RGPD / Confidentialité",
    gdprLines: [
      `Responsable du traitement : ${MY_NAME} (${MY_EMAIL})`,
      "Collecté après consentement : pages vues, référent, navigateur et pays, agrégés",
      "Analyse produit : PostHog (région UE) ; les comptes de première partie sont agrégés sur mon propre serveur",
      "PostHog stocke un identifiant de première partie dans le stockage local du site ; aucun cookie de suivi inter-sites",
      "Aucune adresse IP n'est stockée — votre pays est déduit à la périphérie Cloudflare",
      "Protection anti-spam : Google reCAPTCHA protège le formulaire de contact et peut déposer des cookies Google",
      "Base juridique : Art. 6(1)(a) RGPD / Loi norvégienne sur les données personnelles (Personopplysningsloven)",
      "Retirez votre consentement à tout moment en effaçant le stockage local du site",
      "Droit de réclamation : Datatilsynet (Autorité norvégienne de protection des données) — datatilsynet.no",
    ],
    gdprBack: "[q] retour",
    cookieLine: "en attente...",
  },
};

function getCookieInfo(
  locale: string,
  cookieValue: string,
): NeofetchInfoLine[] {
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
    <div className="fixed bottom-4 mx-2 md:mx-0 md:right-4 sm:max-w-2xl z-50">
      <div
        className={`
          font-mono text-sm transition-all duration-250 ease-out
          ${isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}
        `}
      >
        <div className="rounded-md border border-control-border-hover bg-glass-heavy backdrop-blur-sm shadow-lg shadow-wm-shadow-soft overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border-medium bg-surface-dim">
            <div className="w-2.5 h-2.5 rounded-full bg-terminal-close" />
            <div className="w-2.5 h-2.5 rounded-full bg-terminal-minimize" />
            <div className="w-2.5 h-2.5 rounded-full bg-terminal-maximize" />
            <span className="ml-2 text-xs text-muted-foreground">
              fredrir@:hansteen:~ (zsh)
            </span>
          </div>

          <div className="p-3 space-y-3">
            {showNeofetch && (
              <div className="pb-1 border-b border-border-faint">
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
                    <span className="inline-block w-1.5 h-4 bg-primary-bold align-middle animate-pulse ml-px" />
                  )}
                </span>
              </div>
            )}

            {showGdpr && (
              <div className="border border-border-medium rounded px-3 py-2 space-y-1.5 bg-surface-dim max-h-64 overflow-y-auto">
                <div className="text-primary text-xs font-bold">
                  {text.gdprTitle}
                </div>
                {text.gdprLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-primary-soft shrink-0">·</span>
                    <span>{line}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <button
                    onClick={() => setShowGdpr(false)}
                    className="text-xs text-readable hover:text-muted-foreground hover:underline underline-offset-2 transition-colors"
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
                  className="text-primary hover:text-primary-bold hover:underline underline-offset-2 transition-colors"
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
                  className="text-readable hover:text-muted-foreground hover:underline underline-offset-2 transition-colors ml-auto"
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
