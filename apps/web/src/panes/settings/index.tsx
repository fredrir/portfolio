"use client";

import { useRouter } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useRef, useTransition } from "react";
import type { Locale, NavbarType, TutorialStrings, UiStrings } from "@/i18n/types";
import { KEYS, remove } from "@/lib/storage";
import { THEMES } from "@/lib/themes";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import { BACKGROUND_PRESETS } from "@/window-manager/constants";
import type { BackgroundConfig } from "@/window-manager/types";
import { BackgroundPreview } from "./components/background-preview";
import { ThemeSwatch } from "./components/theme-swatch";
import { languages } from "./constants";

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
    <div ref={containerRef} className="flex h-full flex-col overflow-y-auto @md:p-4 @xs:p-3 p-2">
      <div className={`flex-1 ${compact ? "flex flex-col gap-2" : "@md:space-y-5 space-y-4"}`}>
        <div
          className={
            compact
              ? "flex flex-wrap gap-3"
              : "@md:grid @md:grid-cols-2 @md:gap-4 @md:space-y-0 space-y-4"
          }
        >
          <section className={compact ? "min-w-0 flex-1" : ""}>
            <h3
              className={`mb-1.5 font-semibold text-primary ${compact ? "text-xs" : "mb-2 text-xs"}`}
            >
              {ui.theme}
            </h3>
            <div className="grid @md:grid-cols-3 grid-cols-2 @xs:gap-1.5 gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex min-w-0 items-center gap-1 rounded-md border @xs:px-2 px-1.5 @xs:py-1.5 py-1 text-xs transition-all ${
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

          <section className={compact ? "min-w-0 flex-1" : ""}>
            <h3
              className={`mb-1.5 font-semibold text-primary ${compact ? "text-xs" : "mb-2 text-xs"}`}
            >
              {ui.language}
            </h3>
            <div className={`grid @xs:gap-1.5 gap-1 ${compact ? "grid-cols-4" : "grid-cols-2"}`}>
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
                    className={`flex items-center gap-1.5 rounded-md border @xs:px-2.5 px-2 @xs:py-1.5 py-1 @xs:text-xs text-xs transition-all ${
                      isActive
                        ? "border-primary bg-control-active text-primary"
                        : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className={`truncate ${compact ? "@sm:inline hidden" : ""}`}>
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
            className={`mb-1.5 font-semibold text-primary ${compact ? "text-xs" : "mb-2 text-xs"}`}
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
            className={`grid @xs:gap-1.5 gap-1 ${compact ? "@xs:grid-cols-4 grid-cols-3" : "@lg:grid-cols-6 @md:grid-cols-4 @xs:grid-cols-3 grid-cols-2"}`}
          >
            {BACKGROUND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectBackground(preset)}
                className={`flex flex-col items-center gap-1 rounded-md border p-1.5 text-xs transition-all ${
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
              className={`flex flex-col items-center gap-1 rounded-md border p-1.5 text-xs transition-all ${
                isCustomActive
                  ? "border-primary bg-control-active text-primary"
                  : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"
              }`}
            >
              <div className="flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-sm border border-control-border">
                {isCustomActive && currentBackground.value ? (
                  <img
                    src={currentBackground.value}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 24 16" className="h-full w-full">
                    <rect width="24" height="16" className="fill-background" />
                    <path d="M8 11l3-4 2.5 3 1.5-2 3 3H6z" className="fill-surface-elevated" />
                    <circle cx="8" cy="6" r="1.5" className="fill-surface-selected" />
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
              remove(KEYS.tiling);
              // Legacy keys from before the tiling blob was consolidated.
              remove(KEYS.rowHeights);
              remove(KEYS.colWidths);
              window.location.reload();
            }}
            className="rounded-md border border-control-border px-3 py-1.5 text-muted-foreground text-xs transition-all hover:border-control-border-hover hover:bg-control-hover"
          >
            {tutorial.restartTutorial}
          </button>
        </section>
      </div>
    </div>
  );
}
