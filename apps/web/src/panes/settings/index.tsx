"use client";

import { useRef, useTransition } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "@tanstack/react-router";
import { BACKGROUND_PRESETS } from "@/window-manager/constants";
import { THEMES } from "@/lib/themes";
import { KEYS, remove } from "@/lib/storage";
import { ThemeSwatch } from "./components/theme-swatch";
import { BackgroundPreview } from "./components/background-preview";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import { languages } from "./constants";
import type { BackgroundConfig } from "@/window-manager/types";
import type { NavbarType, UiStrings, TutorialStrings, Locale } from "@/i18n/types";

interface Props {
  navbar: NavbarType;
  currentLocale: Locale;
  currentBackground: BackgroundConfig;
  onSelectBackground: (config: BackgroundConfig) => void;
  ui: UiStrings;
  tutorial: TutorialStrings;
}

export function SettingsPane({
  currentLocale,
  currentBackground,
  onSelectBackground,
  ui,
  tutorial,
}: Props) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ref: containerRef, height } = useContainerSize();
  const compact = height > 0 && height < 220;

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

  const isCustomActive = currentBackground.type === "custom-image";

  return (
    <div
      ref={containerRef}
      className="p-2 @xs:p-3 @md:p-4 h-full flex flex-col overflow-y-auto"
    >
      <div
        className={`flex-1 ${compact ? "flex flex-col gap-2" : "space-y-4 @md:space-y-5"}`}
      >
        <div
          className={
            compact
              ? "flex gap-3 flex-wrap"
              : "@md:grid @md:grid-cols-2 @md:gap-4 space-y-4 @md:space-y-0"
          }
        >
          <section className={compact ? "flex-1 min-w-0" : ""}>
            <h3
              className={`text-primary font-semibold mb-1.5 ${compact ? "text-xs" : "text-xs mb-2"}`}
            >
              {ui.theme}
            </h3>
            <div className="grid grid-cols-2 @md:grid-cols-3 gap-1 @xs:gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-1 px-1.5 py-1 @xs:px-2 @xs:py-1.5 rounded-md border text-xs transition-all min-w-0 ${
                    theme === t.id
                      ? "border-primary bg-control-active text-primary"
                      : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
                  }`}
                >
                  <ThemeSwatch colors={t.colors} />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={compact ? "flex-1 min-w-0" : ""}>
            <h3
              className={`text-primary font-semibold mb-1.5 ${compact ? "text-xs" : "text-xs mb-2"}`}
            >
              {ui.language}
            </h3>
            <div
              className={`grid gap-1 @xs:gap-1.5 ${compact ? "grid-cols-4" : "grid-cols-2"}`}
            >
              {languages.map((lang) => {
                const isActive = lang.code === currentLocale;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (!isActive) {
                        startTransition(() => {
                          router.navigate({
                            to: "/$locale",
                            params: { locale: lang.code },
                            replace: true,
                          });
                        });
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 @xs:px-2.5 @xs:py-1.5 rounded-md border text-xs @xs:text-xs transition-all ${
                      isActive
                        ? "border-primary bg-control-active text-primary"
                        : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span
                      className={`truncate ${compact ? "hidden @sm:inline" : ""}`}
                    >
                      {lang.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <section>
          <h3
            className={`text-primary font-semibold mb-1.5 ${compact ? "text-xs" : "text-xs mb-2"}`}
          >
            {ui.wallpaper}
          </h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div
            className={`grid gap-1 @xs:gap-1.5 ${compact ? "grid-cols-3 @xs:grid-cols-4" : "grid-cols-2 @xs:grid-cols-3 @md:grid-cols-4 @lg:grid-cols-6"}`}
          >
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectBackground(preset)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-md border text-xs transition-all ${
                  currentBackground.id === preset.id && !isCustomActive
                    ? "border-primary bg-control-active text-primary"
                    : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
                }`}
              >
                <BackgroundPreview config={preset} />
                <span>{ui.backgrounds[preset.id] ?? preset.name}</span>
              </button>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-md border text-xs transition-all ${
                isCustomActive
                  ? "border-primary bg-control-active text-primary"
                  : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
              }`}
            >
              <div className="w-full aspect-[3/2] rounded-sm overflow-hidden border border-control-border flex items-center justify-center">
                {isCustomActive && currentBackground.value ? (
                  <img
                    src={currentBackground.value}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 24 16" className="w-full h-full">
                    <rect width="24" height="16" className="fill-background" />
                    <path
                      d="M8 11l3-4 2.5 3 1.5-2 3 3H6z"
                      className="fill-surface-elevated"
                    />
                    <circle
                      cx="8"
                      cy="6"
                      r="1.5"
                      className="fill-surface-selected"
                    />
                  </svg>
                )}
              </div>
              <span>{ui.backgrounds.custom ?? ui.customImage}</span>
            </button>
          </div>
        </section>

        <section className={compact ? "mt-1" : "mt-2"}>
          <button
            onClick={() => {
              remove(KEYS.tutorialCompleted);
              remove(KEYS.openPanes);
              remove(KEYS.rowHeights);
              remove(KEYS.colWidths);
              window.location.reload();
            }}
            className="px-3 py-1.5 rounded-md border border-control-border text-xs text-muted-foreground hover:border-control-border-hover hover:bg-control-hover transition-all"
          >
            {tutorial.restartTutorial}
          </button>
        </section>
      </div>
    </div>
  );
}
