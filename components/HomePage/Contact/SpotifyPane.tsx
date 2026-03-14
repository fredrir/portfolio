"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TerminalPane } from "./TerminalPane";
import { SPOTIFY_ASCII, CAVA_CHARS, CAVA_BAR_COUNT, SPOTIFY_POLL_INTERVAL } from "./constants";
import { formatTime } from "./utils";
import { getSpotifyData } from "@/app/actions/spotify";
import type { SpotifyData } from "./types";

function CavaVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(CAVA_BAR_COUNT).fill(2));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(CAVA_BAR_COUNT).fill(1));
      return;
    }
    const interval = setInterval(() => {
      setBars(
        Array(CAVA_BAR_COUNT)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1),
      );
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex gap-0.5 items-end h-5 font-mono">
      {bars.map((level, i) => (
        <span
          key={i}
          className={isPlaying ? "text-green-400" : "text-muted-foreground/40"}
          style={{
            transition: "all 150ms ease",
          }}
        >
          {CAVA_CHARS[Math.min(level - 1, CAVA_CHARS.length - 1)]}
        </span>
      ))}
    </div>
  );
}

export function SpotifyPane({ initialData }: { initialData: SpotifyData }) {
  const [data, setData] = useState<SpotifyData>(initialData);

  const fetchSpotify = useCallback(async () => {
    try {
      const d = await getSpotifyData();
      setData(d);
    } catch {
      setData({ isPlaying: false });
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

  return (
    <TerminalPane title="cat /proc/spotify">
      <div className="text-muted-foreground/50 mb-2">
        <span className="text-primary">$</span> cat /proc/spotify
      </div>

      {!data?.title ? (
        <div className="flex gap-4 flex-col sm:flex-row items-start">
          <div className="shrink-0 hidden sm:block">
            {SPOTIFY_ASCII.map((line, i) => (
              <span
                key={i}
                className="text-muted-foreground/30 whitespace-pre text-2xs leading-tight block"
              >
                {line}
              </span>
            ))}
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground/50">
              {data?.notConfigured
                ? "spotify: daemon not configured"
                : "spotify: no track data available"}
            </span>
            <div className="text-muted-foreground/30 text-2xs">
              {data?.notConfigured
                ? "# error: not configured"
                : "# waiting for playback..."}
            </div>
            {data?.notConfigured && (
              <div className="text-muted-foreground/30 text-2xs">
                # error: not configured
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-4 flex-col sm:flex-row items-start">
            <div className="shrink-0 hidden sm:block">
              {data.albumArt ? (
                <Image
                  src={data.albumArt}
                  alt={data.album ?? "Album art"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded border border-primary/20 opacity-80"
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

            <div className="min-w-0 space-y-0.5 flex-1">
              <div>
                <span className="text-primary font-semibold">
                  {data.isPlaying ? "▶" : "⏸"}
                </span>
                <span className="text-muted-foreground/50 ml-1">
                  {data.isPlaying ? "NOW PLAYING" : "LAST PLAYED"}
                </span>
              </div>
              <div>
                <span className="text-primary font-semibold">Track</span>
                <span className="text-muted-foreground"> </span>
                {data.songUrl ? (
                  <a
                    href={data.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {data.title}
                  </a>
                ) : (
                  <span className="text-foreground">{data.title}</span>
                )}
              </div>
              <div>
                <span className="text-primary font-semibold">Artist</span>
                <span className="text-muted-foreground"> {data.artist}</span>
              </div>
              <div>
                <span className="text-primary font-semibold">Album</span>
                <span className="text-muted-foreground"> {data.album}</span>
              </div>

              {data.isPlaying && data.progressMs && data.durationMs && (
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/50 text-2xs w-8">
                      {formatTime(data.progressMs)}
                    </span>
                    <div className="flex-1 flex items-center">
                      <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-muted-foreground/50 text-2xs w-8 text-right">
                      {formatTime(data.durationMs)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <CavaVisualizer isPlaying={data.isPlaying} />
        </div>
      )}
    </TerminalPane>
  );
}
