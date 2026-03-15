"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { TerminalPane } from "./TerminalPane";
import {
  SPOTIFY_ASCII,
  CAVA_CHARS,
  CAVA_BAR_COUNT,
  SPOTIFY_POLL_INTERVAL,
} from "./constants";
import { formatTime } from "./utils";
import { getSpotifyData } from "@/app/actions/spotify";
import type { SpotifyData, SpotifyTrack, SpotifyArtist } from "./types";

interface UiStrings {
  nowPlaying: string;
  lastPlayed: string;
  track: string;
  artist: string;
  album: string;
  playInBrowser: string;
  hidePlayer: string;
}

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function CavaVisualizer() {
  const [bars, setBars] = useState<number[]>(Array(CAVA_BAR_COUNT).fill(2));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(
        Array(CAVA_BAR_COUNT)
          .fill(0)
          .map(() => Math.floor(Math.random() * 6) + 1),
      );
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end h-5 font-mono w-full">
      {bars.map((level, i) => (
        <span
          key={i}
          className="text-green-400 flex-1 text-center"
          style={{ transition: "all 150ms ease" }}
        >
          {CAVA_CHARS[Math.min(level - 1, CAVA_CHARS.length - 1)]}
        </span>
      ))}
    </div>
  );
}

function SpotifyEmbed({ trackId }: { trackId: string }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
      width="100%"
      height="80"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-md border border-primary/10"
      title="Spotify player"
    />
  );
}

function TopArtists({ artists }: { artists: SpotifyArtist[] }) {
  if (artists.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-muted-foreground/50 text-2xs">
        <span className="text-primary">$</span> cat /proc/spotify/top-artists
      </div>
      <div className="space-y-0.5">
        {artists.map((artist, i) => (
          <div key={`${artist.name}-${i}`} className="flex items-center gap-2 py-0.5">
            <span className="text-primary/40 w-3 text-right text-2xs">{i + 1}</span>
            {artist.imageUrl && (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full border border-primary/10 object-cover"
                unoptimized
              />
            )}
            <div className="min-w-0 flex-1">
              {artist.url ? (
                <a
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary hover:underline transition-colors text-2xs truncate block"
                >
                  {artist.name}
                </a>
              ) : (
                <span className="text-foreground text-2xs truncate block">
                  {artist.name}
                </span>
              )}
            </div>
            {artist.genres && artist.genres.length > 0 && (
              <span className="text-muted-foreground/30 text-3xs truncate max-w-24 hidden @xs:inline">
                {artist.genres.join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTracks({ tracks }: { tracks: SpotifyTrack[] }) {
  if (tracks.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-muted-foreground/50 text-2xs">
        <span className="text-primary">$</span> tail /var/log/spotify/history
      </div>
      <div className="space-y-0.5">
        {tracks.map((track, i) => (
          <div key={`${track.title}-${i}`} className="flex items-center gap-2 py-0.5">
            {track.albumArt && (
              <Image
                src={track.albumArt}
                alt={track.album}
                width={20}
                height={20}
                className="w-5 h-5 rounded border border-primary/10 object-cover"
                unoptimized
              />
            )}
            <div className="min-w-0 flex-1">
              {track.songUrl ? (
                <a
                  href={track.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary hover:underline transition-colors text-2xs truncate block"
                >
                  {track.title}
                </a>
              ) : (
                <span className="text-foreground text-2xs truncate block">
                  {track.title}
                </span>
              )}
            </div>
            <span className="text-muted-foreground/30 text-3xs truncate max-w-20 hidden @xs:inline">
              {track.artist}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpotifyPane({ initialData, bare = false, ui }: { initialData: SpotifyData; bare?: boolean; ui?: UiStrings }) {
  const [data, setData] = useState<SpotifyData>(initialData);
  const [showEmbed, setShowEmbed] = useState(false);
  const lastKnownRef = useRef<SpotifyData>(initialData);

  useEffect(() => {
    if (data?.title) {
      lastKnownRef.current = data;
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

  const displayData = data?.title ? data : lastKnownRef.current?.title ? {
    ...lastKnownRef.current,
    isPlaying: false,
    progressMs: undefined,
    durationMs: undefined,
  } : data;

  const lpLabel = ui?.lastPlayed ?? "LAST PLAYED";
  const lastPlayedLabel = !displayData?.isPlaying && displayData?.lastPlayedAt
    ? `${lpLabel} ${relativeTime(displayData.lastPlayedAt)}`
    : lpLabel;

  return (
    <TerminalPane title="cat /proc/spotify" bare={bare}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="text-muted-foreground/50 mb-2">
            <span className="text-primary">$</span> cat /proc/spotify
          </div>

          {!displayData?.title ? (
            <div className="flex gap-4 flex-col @sm:flex-row items-start">
              <div className="shrink-0 hidden @sm:block">
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
                  {displayData?.notConfigured
                    ? "spotify: daemon not configured"
                    : "spotify: no track data available"}
                </span>
                <div className="text-muted-foreground/30 text-2xs">
                  {displayData?.notConfigured
                    ? "# error: not configured"
                    : "# waiting for playback..."}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3 @sm:gap-4 flex-col @sm:flex-row items-start">
                <div className="shrink-0 block">
                  {displayData.albumArt ? (
                    <Image
                      src={displayData.albumArt}
                      alt={displayData.album ?? "Album art"}
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
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">
                      {displayData.isPlaying ? "▶" : "⏸"}
                    </span>
                    <span className="text-muted-foreground/50">
                      {displayData.isPlaying ? (ui?.nowPlaying ?? "NOW PLAYING") : lastPlayedLabel}
                    </span>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">{ui?.track ?? "Track"}</span>
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
                    <span className="text-primary font-semibold">{ui?.artist ?? "Artist"}</span>
                    <span className="text-muted-foreground"> {displayData.artist}</span>
                  </div>
                  <div>
                    <span className="text-primary font-semibold">{ui?.album ?? "Album"}</span>
                    <span className="text-muted-foreground"> {displayData.album}</span>
                  </div>

                  {displayData.isPlaying && displayData.progressMs && displayData.durationMs && (
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/50 text-2xs w-8">
                          {formatTime(displayData.progressMs)}
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
                          {formatTime(displayData.durationMs)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {displayData.trackId && (
                <div>
                  <button
                    onClick={() => setShowEmbed((prev) => !prev)}
                    className="text-2xs text-primary/60 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded border border-primary/15 hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span>{showEmbed ? "⏹" : "▶"}</span>
                    <span>{showEmbed ? (ui?.hidePlayer ?? "hide player") : (ui?.playInBrowser ?? "play in browser")}</span>
                  </button>
                  {showEmbed && (
                    <div className="mt-2">
                      <SpotifyEmbed trackId={displayData.trackId} />
                    </div>
                  )}
                </div>
              )}

              {displayData.topArtists && displayData.topArtists.length > 0 && (
                <div className="border-t border-primary/10 pt-2">
                  <TopArtists artists={displayData.topArtists} />
                </div>
              )}

              {displayData.recentTracks && displayData.recentTracks.length > 0 && (
                <div className="border-t border-primary/10 pt-2">
                  <RecentTracks tracks={displayData.recentTracks} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 mt-2">
          <CavaVisualizer />
        </div>
      </div>
    </TerminalPane>
  );
}
