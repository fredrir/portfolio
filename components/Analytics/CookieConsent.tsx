"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Shield, Zap, BarChart3 } from "lucide-react";
import { useAnalyticsConsent } from "./AnalyticsConsentProvider";

interface CookieConsentBannerProps {
  locale?: string;
}

const content = {
  en: {
    title: "🍪 Cookies",
    description: "We use Vercel Analytics to optimize your experience.",
    accept: "Accept",
    decline: "Essential Only",
    learnMore: "Learn More",
  },
  nb: {
    title: "🍪 Informasjonskapsler",
    description:
      "Denne nettsiden bruker Vercel Analytics for å optimalisere opplevelsen din.",
    accept: "Godta",
    decline: "Kun Nødvendig",
    learnMore: "Lær Mer",
  },
  nn: {
    title: "🍪 Informasjonskapslar",
    description: "Vi brukar Vercel Analytics for å optimalisere opplevinga di.",
    accept: "Godta",
    decline: "Berre Nødvendig",
    learnMore: "Lær Meir",
  },
  fr: {
    title: "🍪 Cookies",
    description:
      "Nous utilisons Vercel Analytics pour optimiser votre expérience.",
    accept: "Accepter",
    decline: "Essentiel Seulement",
    learnMore: "En Savoir Plus",
  },
};

export function CookieConsentBanner({
  locale = "en",
}: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { setConsent } = useAnalyticsConsent();

  const text = content[locale as keyof typeof content] || content.en;

  useEffect(() => {
    const consent = localStorage.getItem("vercel-analytics-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDecline = () => {
    setConsent(false);
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div
        className={`
         backdrop-blur-xl bg-background/90 border-cyan-500/30 
        shadow-2xl shadow-cyan-500/20 transition-all duration-300 ease-out
        ${
          isAnimating
            ? "translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }
      `}
      >
        <div className="relative overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20" />
            <div className="grid grid-cols-8 grid-rows-4 h-full w-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-cyan-500/10 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />

          <div className="relative py-6 px-4 mx-auto container">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 animate-pulse" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground font-mono">
                    {text.title}
                  </h3>
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-mono">
                  {text.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="
                      border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground
                      font-mono px-6 py-2 rounded-lg transition-all duration-200
                      hover:border-border/80
                     bg-transparent"
                  >
                    {text.decline}
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="
                      bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500
                      text-white font-mono font-semibold px-6 py-2 rounded-lg
                      shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40
                      transition-all duration-200 transform hover:scale-105
                      border border-cyan-400/30
                    "
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {text.accept}
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 font-mono text-sm px-3"
                    onClick={() =>
                      window.open(
                        "https://vercel.com/docs/analytics/privacy-policy",
                        "_blank"
                      )
                    }
                  >
                    {text.learnMore} →
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
