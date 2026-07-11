"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UiStrings } from "@/i18n/types";
import { getSpotifyData } from "@/server/spotify";
import { useRecaptcha } from "@/shared/components/recaptcha-provider";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import type { SpotifyData } from "@/shared/types";
import { CavaVisualizer } from "./components/cava-visualizer";
import NowPlaying from "./components/now-playing";
import { RecentTracks } from "./components/recent-tracks";
import SpotifyCard from "./components/spotify-card";
import { TopArtists } from "./components/top-artists";
import { SPOTIFY_POLL_INTERVAL } from "./constants";

export function SpotifyPane({
  initialData,
  ui,
  locale = "en",
}: {
  initialData: SpotifyData | null;
  ui: UiStrings;
  locale?: string;
}) {
  const [data, setData] = useState<SpotifyData | null>(initialData);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastKnownRef = useRef<SpotifyData | null>(initialData);
  const { ref: containerRef, height } = useContainerSize();
  const compact = height > 0 && height < 200;
  const { executeRecaptcha, configured: recaptchaConfigured } = useRecaptcha();

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
      if (recaptchaConfigured && !executeRecaptcha) {
        return;
      }

      const captchaToken = executeRecaptcha ? await executeRecaptcha("spotify_data") : "";
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
      } else {
        setData({ ok: false, error: "spotify_unavailable" });
      }
    }
  }, [executeRecaptcha, recaptchaConfigured]);

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
  const errorText =
    displayData?.ok === false ? ui.error.replace("{error}", ui.spotifyUnavailable) : "";

  return (
    <div className="h-full overflow-hidden @sm:px-3 px-2 leading-relaxed">
      <div ref={containerRef} className="flex h-full flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SpotifyCard title="/proc/spotify/recently-played" command="cat ">
            {displayData?.ok === false ? (
              <p className="py-2 text-muted-foreground text-xs">{errorText}</p>
            ) : displayData?.title ? (
              <NowPlaying displayData={displayData} ui={ui} locale={locale} compact={compact} />
            ) : (
              <p className="py-2 text-muted-foreground text-xs">{ui.loading}</p>
            )}
          </SpotifyCard>
          {displayData?.topArtists && displayData.topArtists.length > 0 && (
            <SpotifyCard
              title="/proc/spotify/top-artists"
              command="cat"
              className="border-border-faint border-t @sm:pt-3 pt-2"
            >
              <TopArtists artists={displayData.topArtists} />
            </SpotifyCard>
          )}

          {displayData?.recentTracks && displayData.recentTracks.length > 0 && (
            <SpotifyCard
              title="/var/log/spotify/history"
              command="tail"
              className="border-border-faint border-t @sm:pt-3 pt-2"
            >
              <RecentTracks tracks={displayData.recentTracks} />
            </SpotifyCard>
          )}
        </div>
        <div className="mt-1 shrink-0">
          <CavaVisualizer />
        </div>
      </div>
    </div>
  );
}
