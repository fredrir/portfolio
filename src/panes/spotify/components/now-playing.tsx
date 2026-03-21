import type { SpotifyData } from "@/shared/types";
import type { UiStrings } from "@/i18n/types";
import Image from "next/image";
import { SPOTIFY_ASCII } from "../constants";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { formatTime, relativeTime } from "../utils";
import { SpotifyEmbed } from "./spotify-embed";
import { useState } from "react";

interface Props {
  displayData: SpotifyData;
  ui?: UiStrings;
  compact?: boolean;
  locale?: string;
}

const NowPlaying = ({ displayData, ui, compact, locale }: Props) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const lpLabel = ui?.lastPlayed ?? "LAST PLAYED";
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
      <div className="flex gap-3 @sm:gap-4 items-start">
        {!compact && (
          <div className="shrink-0 block">
            {displayData.albumArt ? (
              <Image
                src={displayData.albumArt}
                alt={displayData.album ?? "Album art"}
                width={64}
                height={64}
                className="w-16 h-16 rounded border border-border-medium opacity-80"
                unoptimized
              />
            ) : (
              SPOTIFY_ASCII.map((line, i) => (
                <span
                  key={i}
                  className="text-green-400/60 whitespace-pre text-xs leading-tight block"
                >
                  {line}
                </span>
              ))
            )}
          </div>
        )}

        <div className="min-w-0 text-xs  space-y-0.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold">
              {displayData.isPlaying ? (
                <PlayIcon className="h-3 w-3 fill-primary-muted" />
              ) : (
                <PauseIcon className="h-3 w-3 fill-primary-muted" />
              )}
            </span>
            <span className="text-faded">
              {displayData.isPlaying
                ? (ui?.nowPlaying ?? "NOW PLAYING")
                : lastPlayedLabel}
            </span>
          </div>
          <div>
            <span className="text-primary font-semibold">
              {ui?.track ?? "Track"}
            </span>
            <span className="text-muted-foreground"> </span>
            {displayData.songUrl ? (
              <a
                href={displayData.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary hover:underline transition-colors"
              >
                {displayData.title}
              </a>
            ) : (
              <span className="text-foreground">{displayData.title}</span>
            )}
          </div>
          <div>
            <span className="text-primary font-semibold">
              {ui?.artist ?? "Artist"}
            </span>
            <span className="text-muted-foreground"> {displayData.artist}</span>
          </div>
          {!compact && (
            <div>
              <span className="text-primary font-semibold">
                {ui?.album ?? "Album"}
              </span>
              <span className="text-muted-foreground">
                {" "}
                {displayData.album}
              </span>
            </div>
          )}
          {displayData.isPlaying && (
            <div className="flex pt-1 items-center gap-2">
              <span className="text-faded text-xs w-8">
                {formatTime(displayData.progressMs ?? 0)}
              </span>
              <div className="flex-1 flex items-center">
                <div className="w-full bg-progress-track h-1 rounded-full ">
                  <div
                    className="h-full bg-progress-fill rounded-full transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <span className="text-faded text-xs w-8 text-right">
                {formatTime(displayData.durationMs ?? 0)}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowEmbed((prev) => !prev)}
            className="text-xs mt-1  text-primary-soft hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded border border-wm-border hover:border-control-border-hover hover:bg-control-hover"
          >
            <PlayIcon className="h-2 w-2 fill-primary-soft" />
            {ui?.playInBrowser ?? "play in browser"}
          </button>
        </div>
      </div>

      {showEmbed && displayData.trackId && (
        <SpotifyEmbed trackId={displayData.trackId} />
      )}
    </>
  );
};

export default NowPlaying;
