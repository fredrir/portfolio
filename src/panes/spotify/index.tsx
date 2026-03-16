"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { SPOTIFY_ASCII, SPOTIFY_POLL_INTERVAL } from "./constants";
import { formatTime, relativeTime } from "./utils";
import { CavaVisualizer } from "./components/cava-visualizer";
import { SpotifyEmbed } from "./components/spotify-embed";
import { TopArtists } from "./components/top-artists";
import { RecentTracks } from "./components/recent-tracks";
import { getSpotifyData } from "@/app/actions/spotify";
import type { SpotifyData, UiStrings } from "@/shared/types";
import { PauseIcon } from "@phosphor-icons/react/dist/ssr";
import { PlayIcon } from "@phosphor-icons/react";

export function SpotifyPane({
  initialData,
  ui,
  locale = "en",
}: {
  initialData: SpotifyData;
  ui?: UiStrings;
  locale?: string;
}) {
  const [data, setData] = useState<SpotifyData>(initialData);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastKnownRef = useRef<SpotifyData>(initialData);
  const containerRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCompact(entry.contentRect.height < 200);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (data?.title) {
      lastKnownRef.current = data;
    }
    if (audioRef.current && data?.previewUrl !== audioRef.current.src) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPreviewPlaying(false);
    }
  }, [data]);

  const fetchSpotify = useCallback(async () => {
    try {
      const d = await getSpotifyData();
      if (d?.title) {
        setData(d);
      } else if (lastKnownRef.current?.title) {
        setData({
          ...lastKnownRef.current,
          isPlaying: false,
          progressMs: undefined,
          durationMs: undefined,
          topArtists: d?.topArtists ?? lastKnownRef.current.topArtists,
          recentTracks: d?.recentTracks ?? lastKnownRef.current.recentTracks,
        });
      } else {
        setData(d);
      }
    } catch {
      if (lastKnownRef.current?.title) {
        setData({
          ...lastKnownRef.current,
          isPlaying: false,
          progressMs: undefined,
          durationMs: undefined,
        });
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchSpotify, SPOTIFY_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSpotify]);

  const progressPct =
    data?.progressMs && data?.durationMs
      ? Math.round((data.progressMs / data.durationMs) * 100)
      : 0;

  const displayData = data?.title
    ? data
    : lastKnownRef.current?.title
      ? {
          ...lastKnownRef.current,
          isPlaying: false,
          progressMs: undefined,
          durationMs: undefined,
        }
      : data;

  const lpLabel = ui?.lastPlayed ?? "LAST PLAYED";
  const lastPlayedLabel =
    !displayData?.isPlaying && displayData?.lastPlayedAt
      ? `${lpLabel} ${relativeTime(displayData.lastPlayedAt, locale)}`
      : lpLabel;

  return (
    <div className="h-full overflow-hidden">
      <div className="p-2 @sm:p-3 font-mono text-xs leading-relaxed h-full overflow-hidden">
        <div ref={containerRef} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto min-h-0">
            {!compact && (
              <div className="text-faded mb-2">
                <span className="text-primary">$</span> cat
                /proc/spotify/recently-played
              </div>
            )}

            {!displayData?.title ? (
              <div className="flex gap-4 flex-col @sm:flex-row items-start">
                <div className="shrink-0 hidden @sm:block">
                  {SPOTIFY_ASCII.map((line, i) => (
                    <span
                      key={i}
                      className="text-ghost whitespace-pre text-2xs leading-tight block"
                    >
                      {line}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  <span className="text-faded">
                    {displayData?.notConfigured
                      ? "spotify: daemon not configured"
                      : "spotify: no track data available"}
                  </span>
                  <div className="text-ghost text-2xs">
                    {displayData?.notConfigured
                      ? "# error: not configured"
                      : "# waiting for playback..."}
                  </div>
                </div>
              </div>
            ) : (
              <div className={compact ? "space-y-1.5" : "space-y-3"}>
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
                            className="text-green-400/60 whitespace-pre text-2xs leading-tight block"
                          >
                            {line}
                          </span>
                        ))
                      )}
                    </div>
                  )}

                  <div className="min-w-0 space-y-0.5 flex-1">
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
                        <span className="text-foreground">
                          {displayData.title}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-primary font-semibold">
                        {ui?.artist ?? "Artist"}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        {displayData.artist}
                      </span>
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

                    {displayData.isPlaying &&
                      displayData.progressMs &&
                      displayData.durationMs && (
                        <div className="pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-faded text-2xs w-8">
                              {formatTime(displayData.progressMs)}
                            </span>
                            <div className="flex-1 flex items-center">
                              <div className="w-full bg-progress-track h-1 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-progress-fill rounded-full transition-all duration-1000"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-faded text-2xs w-8 text-right">
                              {formatTime(displayData.durationMs)}
                            </span>
                          </div>
                        </div>
                      )}

                    {(displayData.previewUrl || displayData.trackId) && (
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            if (displayData.previewUrl) {
                              if (isPreviewPlaying) {
                                audioRef.current?.pause();
                                setIsPreviewPlaying(false);
                              } else {
                                if (
                                  !audioRef.current ||
                                  audioRef.current.src !==
                                    displayData.previewUrl
                                ) {
                                  audioRef.current = new Audio(
                                    displayData.previewUrl,
                                  );
                                  audioRef.current.onended = () =>
                                    setIsPreviewPlaying(false);
                                }
                                audioRef.current.play();
                                setIsPreviewPlaying(true);
                              }
                            } else {
                              setShowEmbed((prev) => !prev);
                            }
                          }}
                          className="text-2xs text-primary-soft hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded border border-wm-border hover:border-control-border-hover hover:bg-control-hover"
                        >
                          <span>
                            {isPreviewPlaying || showEmbed ? "⏹" : "▶"}
                          </span>
                          <span>
                            {isPreviewPlaying || showEmbed
                              ? (ui?.hidePlayer ?? "hide player")
                              : (ui?.playInBrowser ?? "play in browser")}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {showEmbed &&
                  !displayData.previewUrl &&
                  displayData.trackId && (
                    <div>
                      <SpotifyEmbed trackId={displayData.trackId} />
                    </div>
                  )}

                {!compact &&
                  displayData.topArtists &&
                  displayData.topArtists.length > 0 && (
                    <div className="border-t border-border-faint pt-2">
                      <TopArtists artists={displayData.topArtists} />
                    </div>
                  )}

                {!compact &&
                  displayData.recentTracks &&
                  displayData.recentTracks.length > 0 && (
                    <div className="border-t border-border-faint pt-2">
                      <RecentTracks tracks={displayData.recentTracks} />
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="shrink-0 mt-1">
            <CavaVisualizer />
          </div>
        </div>
      </div>
    </div>
  );
}
