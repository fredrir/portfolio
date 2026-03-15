import "server-only";

import { getSupabase } from "@/lib/supabase";
import type {
  SpotifyData,
  SpotifyArtist,
  SpotifyTrack,
} from "@/shared/types";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=5";
const TOP_ARTISTS_ENDPOINT =
  "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5";

const CACHE_KEY = "spotify_last_played";

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN!,
    }),
  });

  return response.json();
}

interface SpotifyArtistRaw {
  name: string;
  images?: { url: string }[];
  external_urls: { spotify: string };
  genres?: string[];
}

interface SpotifyTrackRaw {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images?: { url: string }[];
  };
  external_urls: { spotify: string };
  id: string;
}

function parseTrack(track: SpotifyTrackRaw): SpotifyTrack {
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images?.[0]?.url,
    songUrl: track.external_urls.spotify,
    trackId: track.id,
  };
}

async function fetchTopArtists(
  accessToken: string,
): Promise<SpotifyArtist[]> {
  try {
    const res = await fetch(TOP_ARTISTS_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status !== 200) return [];
    const data = await res.json();
    return (data.items ?? []).map((a: SpotifyArtistRaw) => ({
      name: a.name,
      imageUrl: a.images?.[0]?.url,
      url: a.external_urls.spotify,
      genres: a.genres?.slice(0, 2),
    }));
  } catch {
    return [];
  }
}

interface RecentTracksResult {
  tracks: SpotifyTrack[];
  lastPlayedAt?: string;
}

async function fetchRecentTracks(
  accessToken: string,
): Promise<RecentTracksResult> {
  try {
    const res = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status !== 200) return { tracks: [] };
    const data = await res.json();
    const items = data.items ?? [];
    const tracks = items.map((item: { track: SpotifyTrackRaw }) =>
      parseTrack(item.track),
    );
    const lastPlayedAt = items[0]?.played_at as string | undefined;
    return { tracks, lastPlayedAt };
  } catch {
    return { tracks: [] };
  }
}

async function saveToSupabase(data: SpotifyData) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.from("spotify_cache").upsert(
      {
        id: CACHE_KEY,
        data: JSON.stringify(data),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (e) {
    console.error("Supabase save error:", e);
  }
}

async function loadFromSupabase(): Promise<SpotifyData | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("spotify_cache")
      .select("data, updated_at")
      .eq("id", CACHE_KEY)
      .single();
    if (error || !data) return null;
    const parsed = JSON.parse(data.data) as SpotifyData;
    if (data.updated_at) {
      parsed.lastPlayedAt = data.updated_at;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function fetchSpotifyData(): Promise<SpotifyData> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return { isPlaying: false, notConfigured: true };
  }

  try {
    const { access_token } = await getAccessToken();

    const [nowPlayingRes, topArtists, recentResult] = await Promise.all([
      fetch(NOW_PLAYING_ENDPOINT, {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetchTopArtists(access_token),
      fetchRecentTracks(access_token),
    ]);

    const { tracks: recentTracks, lastPlayedAt } = recentResult;

    if (nowPlayingRes.status === 200) {
      const body = await nowPlayingRes.json();

      if (body.is_playing && body.item) {
        const track = parseTrack(body.item);
        const result: SpotifyData = {
          isPlaying: true,
          ...track,
          progressMs: body.progress_ms,
          durationMs: body.item.duration_ms,
          topArtists,
          recentTracks,
        };
        saveToSupabase(result);
        return result;
      }
    }

    if (recentTracks.length > 0) {
      const last = recentTracks[0];
      const result: SpotifyData = {
        isPlaying: false,
        ...last,
        lastPlayedAt,
        topArtists,
        recentTracks: recentTracks.slice(1),
      };
      saveToSupabase(result);
      return result;
    }

    const cached = await loadFromSupabase();
    if (cached) {
      return {
        ...cached,
        isPlaying: false,
        progressMs: undefined,
        durationMs: undefined,
        topArtists: topArtists.length > 0 ? topArtists : cached.topArtists,
        recentTracks:
          recentTracks.length > 0 ? recentTracks : cached.recentTracks,
      };
    }

    return { isPlaying: false, topArtists, recentTracks };
  } catch (error) {
    console.error("Spotify fetch error:", error);
    const cached = await loadFromSupabase();
    if (cached) {
      return {
        ...cached,
        isPlaying: false,
        progressMs: undefined,
        durationMs: undefined,
      };
    }
    return { isPlaying: false };
  }
}
