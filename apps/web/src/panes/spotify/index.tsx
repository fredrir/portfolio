"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import { SPOTIFY_POLL_INTERVAL } from "./constants";
import { CavaVisualizer } from "./components/cava-visualizer";
import { TopArtists } from "./components/top-artists";
import { RecentTracks } from "./components/recent-tracks";
import { getSpotifyData } from "@/server/spotify";
import type { SpotifyData } from "@/shared/types";
import type { UiStrings } from "@/i18n/types";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import NowPlaying from "./components/now-playing";
import SpotifyCard from "./components/spotify-card";

export function SpotifyPane({
  initialData,
  ui,
  locale = "en",
}: {
  initialData: SpotifyData | null;
  ui?: UiStrings;
  locale?: string;
}) {
  const [data, setData] = useState<SpotifyData | null>(initialData);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastKnownRef = useRef<SpotifyData | null>(initialData);
  const { ref: containerRef, height } = useContainerSize();
  const compact = height > 0 && height < 200;
  const { executeRecaptcha } = useRecaptcha();

  useEffect(() => {
    if (data?.title) {
      lastKnownRef.current = data;
    }
    if (audioRef.current && data?.previewUrl !== audioRef.current.src) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [data]);

  const fetchSpotify = useCallback(async () => {
    try {
      if (!executeRecaptcha) {
        return;
      }

      const captchaToken = await executeRecaptcha("spotify_data");
      const d = await getSpotifyData({ data: captchaToken });
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
  }, [executeRecaptcha]);

  useEffect(() => {
    // Spotify data is captcha-gated and loads client-side only.
    fetchSpotify();
    const interval = setInterval(fetchSpotify, SPOTIFY_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSpotify]);

  const displayData =
    data?.ok === false && lastKnownRef.current?.title
      ? {
          ...lastKnownRef.current,
          isPlaying: false,
          progressMs: undefined,
          durationMs: undefined,
        }
      : data;

  return (
      <div className="px-2 @sm:px-3 leading-relaxed h-full overflow-hidden">
        <div ref={containerRef} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto min-h-0">
            <SpotifyCard title="/proc/spotify/recently-played" command="cat ">
              {displayData ? (
                <NowPlaying
                  displayData={displayData}
                  ui={ui}
                  locale={locale}
                  compact={compact}
                />
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  loading…
                </p>
              )}
            </SpotifyCard>
            {displayData?.topArtists && displayData.topArtists.length > 0 && (
              <SpotifyCard
                title="/proc/spotify/top-artists"
                command="cat"
                className="border-t border-border-faint pt-2 @sm:pt-3"
              >
                <TopArtists artists={displayData.topArtists} />
              </SpotifyCard>
            )}

            {displayData?.recentTracks &&
              displayData.recentTracks.length > 0 && (
                <SpotifyCard
                  title="/var/log/spotify/history"
                  command="tail"
                  className="border-t border-border-faint pt-2 @sm:pt-3"
                >
                  <RecentTracks tracks={displayData.recentTracks} />
                </SpotifyCard>
              )}
          </div>
          <div className="shrink-0 mt-1">
            <CavaVisualizer />
          </div>
        </div>
    </div>
  );
}
