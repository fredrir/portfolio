"use server";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

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

export async function fetchSpotifyData() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return { isPlaying: false, notConfigured: true };
  }

  try {
    const { access_token } = await getAccessToken();

    const nowPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (nowPlayingRes.status === 200) {
      const data = await nowPlayingRes.json();

      if (data.is_playing && data.item) {
        return {
          isPlaying: true,
          title: data.item.name as string,
          artist: data.item.artists
            .map((a: { name: string }) => a.name)
            .join(", ") as string,
          album: data.item.album.name as string,
          albumArt: data.item.album.images?.[0]?.url as string | undefined,
          songUrl: data.item.external_urls.spotify as string,
          progressMs: data.progress_ms as number,
          durationMs: data.item.duration_ms as number,
        };
      }
    }

    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (recentRes.status === 200) {
      const data = await recentRes.json();
      const track = data.items?.[0]?.track;

      if (track) {
        return {
          isPlaying: false,
          title: track.name as string,
          artist: track.artists
            .map((a: { name: string }) => a.name)
            .join(", ") as string,
          album: track.album.name as string,
          albumArt: track.album.images?.[0]?.url as string | undefined,
          songUrl: track.external_urls.spotify as string,
        };
      }
    }

    return { isPlaying: false };
  } catch {
    return { isPlaying: false };
  }
}
