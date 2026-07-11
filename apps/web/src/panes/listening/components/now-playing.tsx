import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { UiStrings } from "@/i18n/types";
import Image from "@/shared/components/image";
import type { SpotifyData } from "@/shared/types";
import { SPOTIFY_ASCII } from "../constants";
import { formatTime, relativeTime } from "../utils";
import { SpotifyEmbed } from "./track-embed";

interface Props {
  displayData: SpotifyData;
  ui: UiStrings;
  compact?: boolean;
  locale?: string;
}

const NowPlaying = ({ displayData, ui, compact, locale }: Props) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const lpLabel = ui.lastPlayed;
  const lastPlayedLabel =
    !displayData?.isPlaying && displayData?.lastPlayedAt
      ? `${lpLabel} ${relativeTime(displayData.lastPlayedAt, locale)}`
      : lpLabel;
  const progressPct =
    displayData?.progressMs && displayData?.durationMs
      ? Math.round((displayData.progressMs / displayData.durationMs) * 100)
      : 0;

  return (
    <>
      <div className="flex items-start @sm:gap-4 gap-3">
        {!compact && (
          <div className="block shrink-0">
            {displayData.albumArt ? (
              <Image
                src={displayData.albumArt}
                alt={displayData.album ?? ui.albumArt}
                width={64}
                height={64}
                className="h-16 w-16 rounded border border-border-medium opacity-80"
                unoptimized
              />
            ) : (
              SPOTIFY_ASCII.map((line, i) => (
                <span
                  key={i}
                  className="block whitespace-pre text-green-400/60 text-xs leading-tight"
                >
                  {line}
                </span>
              ))
            )}
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              {displayData.isPlaying ? (
                <PlayIcon className="h-3 w-3 fill-primary-muted" />
              ) : (
                <PauseIcon className="h-3 w-3 fill-primary-muted" />
              )}
            </span>
            <span className="text-faded">
              {displayData.isPlaying ? ui.nowPlaying : lastPlayedLabel}
            </span>
          </div>
          <div>
            <span className="font-semibold text-primary">{ui.track}</span>
            <span className="text-muted-foreground"> </span>
            {displayData.songUrl ? (
              <a
                href={displayData.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary hover:underline"
              >
                {displayData.title}
              </a>
            ) : (
              <span className="text-foreground">{displayData.title}</span>
            )}
          </div>
          <div>
            <span className="font-semibold text-primary">{ui.artist}</span>
            <span className="text-muted-foreground"> {displayData.artist}</span>
          </div>
          {!compact && (
            <div>
              <span className="font-semibold text-primary">{ui.album}</span>
              <span className="text-muted-foreground"> {displayData.album}</span>
            </div>
          )}
          {displayData.isPlaying && (
            <div className="flex items-center gap-2 pt-1">
              <span className="w-8 text-faded text-xs">
                {formatTime(displayData.progressMs ?? 0)}
              </span>
              <div className="flex flex-1 items-center">
                <div className="h-1 w-full rounded-full bg-progress-track">
                  <div
                    className="h-full rounded-full bg-progress-fill transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-faded text-xs">
                {formatTime(displayData.durationMs ?? 0)}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowEmbed((prev) => !prev)}
            className="mt-1 flex items-center gap-1.5 rounded border border-wm-border px-2 py-1 text-primary-soft text-xs transition-colors hover:border-control-border-hover hover:bg-control-hover hover:text-primary"
          >
            <PlayIcon className="h-2 w-2 fill-primary-soft" />
            {ui.playInBrowser}
          </button>
        </div>
      </div>

      {showEmbed && displayData?.trackId && (
        <SpotifyEmbed trackId={displayData.trackId} title={ui.spotifyPlayer} />
      )}
    </>
  );
};

export default NowPlaying;
