"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import Link from "next/link";
import { BACKGROUND_PRESETS } from "../constants";
import type { BackgroundConfig } from "../types";
import type { NavbarType } from "@/lib/locale/languageTypes";

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
}

export function SettingsPane({
  currentLocale,
  currentBackground,
  onSelectBackground,
}: Props) {
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="p-2 @sm:p-4 font-mono text-xs h-full flex flex-col overflow-y-auto">
      <div className="text-muted-foreground/50 mb-3">
        <span className="text-primary">$</span> settings
      </div>

      <div className="space-y-5">
        <section>
          <h3 className="text-primary font-semibold text-xs mb-2">Theme</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/10 text-muted-foreground hover:border-primary/30"
              }`}
            >
              <MoonIcon className="h-3.5 w-3.5" />
              Dark
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/10 text-muted-foreground hover:border-primary/30"
              }`}
            >
              <SunIcon className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-primary/10 text-muted-foreground hover:border-primary/30"
              }`}
            >
              System
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-primary font-semibold text-xs mb-2">Language</h3>
          <div className="grid grid-cols-1 @xs:grid-cols-2 gap-1.5">
            {languages.map((lang) => {
              const isActive = lang.code === currentLocale;
              return (
                <Link
                  key={lang.code}
                  href={`/${lang.code}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-primary font-semibold text-xs mb-2">
            Wallpaper
          </h3>
          <div className="grid grid-cols-2 @xs:grid-cols-3 gap-1.5">
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectBackground(preset)}
                className={`px-2 py-2.5 rounded-md border text-2xs text-center transition-all ${
                  currentBackground.id === preset.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/10 text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

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
              className="w-full px-3 py-2.5 rounded-md border border-dashed border-primary/20 text-xs text-muted-foreground/50 hover:border-primary/40 hover:text-primary/70 hover:bg-primary/5 transition-all text-center"
            >
              Choose custom image...
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
