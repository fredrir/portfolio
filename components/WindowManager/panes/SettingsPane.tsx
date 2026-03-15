"use client";

import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BACKGROUND_PRESETS } from "../constants";
import { THEMES } from "@/lib/themes";
import type { BackgroundConfig } from "../types";
import type { NavbarType } from "@/lib/locale/languageTypes";
import type { UiStrings } from "../WindowManager";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "nb", name: "Norsk (Bokmål)", flag: "🇳🇴" },
  { code: "nn", name: "Norsk (Nynorsk)", flag: "🇳🇴" },
];

interface Props {
  navbar: NavbarType;
  currentLocale: "en" | "nb" | "nn" | "fr";
  currentBackground: BackgroundConfig;
  onSelectBackground: (config: BackgroundConfig) => void;
  ui: UiStrings;
}

function ThemeSwatch({ colors }: { colors: readonly [string, string, string] }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {colors.map((c, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full border border-white/10"
          style={{ background: c }}
        />
      ))}
    </div>
  );
}

export function SettingsPane({
  currentLocale,
  currentBackground,
  onSelectBackground,
  ui,
}: Props) {
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCompact(entry.contentRect.height < 220);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onSelectBackground({
        id: "custom",
        name: "Custom",
        type: "custom-image",
        value: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div ref={containerRef} className="p-2 @xs:p-3 @md:p-4 font-mono text-xs h-full flex flex-col overflow-y-auto @container">
      {!compact && (
        <div className="text-muted-foreground/50 mb-3 shrink-0">
          <span className="text-primary">$</span> settings
        </div>
      )}

      <div className={`flex-1 ${compact ? "flex flex-col gap-2" : "space-y-4 @md:space-y-5"}`}>
        <div className={compact
          ? "flex gap-3 flex-wrap"
          : "@md:grid @md:grid-cols-2 @md:gap-4 space-y-4 @md:space-y-0"
        }>
          <section className={compact ? "flex-1 min-w-0" : ""}>
            <h3 className={`text-primary font-semibold mb-1.5 ${compact ? "text-2xs" : "text-xs mb-2"}`}>{ui.theme}</h3>
            <div className="grid grid-cols-3 gap-1 @xs:gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-1 px-1.5 py-1 @xs:px-2 @xs:py-1.5 rounded-md border text-2xs transition-all min-w-0 ${
                    theme === t.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <ThemeSwatch colors={t.colors} />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={compact ? "flex-1 min-w-0" : ""}>
            <h3 className={`text-primary font-semibold mb-1.5 ${compact ? "text-2xs" : "text-xs mb-2"}`}>{ui.language}</h3>
            <div className={`grid gap-1 @xs:gap-1.5 ${compact ? "grid-cols-4" : "grid-cols-2"}`}>
              {languages.map((lang) => {
                const isActive = lang.code === currentLocale;
                return (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}`}
                    className={`flex items-center gap-1.5 px-2 py-1 @xs:px-2.5 @xs:py-1.5 rounded-md border text-2xs @xs:text-xs transition-all ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className={`truncate ${compact ? "hidden @sm:inline" : ""}`}>{lang.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <section>
          <h3 className={`text-primary font-semibold mb-1.5 ${compact ? "text-2xs" : "text-xs mb-2"}`}>
            {ui.wallpaper}
          </h3>
          <div className={`grid gap-1 @xs:gap-1.5 ${compact ? "grid-cols-3 @xs:grid-cols-5" : "grid-cols-2 @xs:grid-cols-3 @sm:grid-cols-5"}`}>
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectBackground(preset)}
                className={`px-2 py-1.5 rounded-md border text-2xs text-center transition-all ${
                  currentBackground.id === preset.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {!compact && (
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full px-3 py-2 rounded-md border text-xs transition-all flex items-center justify-center gap-2 ${
                  currentBackground.type === "custom-image"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-dashed border-primary/20 text-muted-foreground/50 hover:border-primary/40 hover:text-primary/70 hover:bg-primary/5"
                }`}
              >
                {currentBackground.type === "custom-image" && currentBackground.value && (
                  <img
                    src={currentBackground.value}
                    alt=""
                    className="w-5 h-5 rounded object-cover border border-primary/20"
                  />
                )}
                {ui.customImage}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
