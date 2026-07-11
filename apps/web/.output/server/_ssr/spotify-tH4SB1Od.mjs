import { t as getSupabase } from "./supabase-DH_U1O8d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spotify-tH4SB1Od.js
var CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
var CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
var REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
var TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
var NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
var RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=5";
var TOP_ARTISTS_ENDPOINT = "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5";
var CACHE_KEY = "spotify_last_played";
async function getAccessToken() {
	const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
	const response = await fetch(TOKEN_ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Basic ${basic}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: REFRESH_TOKEN
		})
	});
	if (!response.ok) throw new Error(`Spotify token refresh failed: ${response.status}`);
	const data = await response.json();
	if (!data.access_token) throw new Error("Spotify token response missing access_token");
	return data.access_token;
}
function parseTrack(track) {
	return {
		title: track.name,
		artist: track.artists.map((a) => a.name).join(", "),
		album: track.album.name,
		albumArt: track.album.images?.[0]?.url,
		songUrl: track.external_urls.spotify,
		trackId: track.id,
		previewUrl: track.preview_url ?? void 0
	};
}
async function fetchTopArtists(accessToken) {
	try {
		const res = await fetch(TOP_ARTISTS_ENDPOINT, { headers: { Authorization: `Bearer ${accessToken}` } });
		if (res.status !== 200) return [];
		return ((await res.json()).items ?? []).map((a) => ({
			name: a.name,
			imageUrl: a.images?.[0]?.url,
			url: a.external_urls.spotify,
			genres: a.genres?.slice(0, 2)
		}));
	} catch {
		return [];
	}
}
async function fetchRecentTracks(accessToken) {
	try {
		const res = await fetch(RECENTLY_PLAYED_ENDPOINT, { headers: { Authorization: `Bearer ${accessToken}` } });
		if (res.status !== 200) return { tracks: [] };
		const items = (await res.json()).items ?? [];
		return {
			tracks: items.map((item) => parseTrack(item.track)),
			lastPlayedAt: items[0]?.played_at
		};
	} catch {
		return { tracks: [] };
	}
}
async function saveToSupabase(data) {
	const sb = getSupabase();
	if (!sb) return;
	try {
		await sb.from("spotify_cache").upsert({
			id: CACHE_KEY,
			data: JSON.stringify(data),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "id" });
	} catch (e) {
		console.error("Supabase save error:", e);
	}
}
async function loadFromSupabase() {
	const sb = getSupabase();
	if (!sb) return null;
	try {
		const { data, error } = await sb.from("spotify_cache").select("data, updated_at").eq("id", CACHE_KEY).single();
		if (error || !data) return null;
		const parsed = JSON.parse(data.data);
		if (data.updated_at) parsed.lastPlayedAt = data.updated_at;
		return parsed;
	} catch {
		return null;
	}
}
async function fetchSpotifyData() {
	if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return {
		ok: false,
		error: "Spotify credentials not set"
	};
	const cached = await loadFromSupabase();
	try {
		const accessToken = await getAccessToken();
		const [nowPlayingRes, freshArtists, recentResult] = await Promise.all([
			fetch(NOW_PLAYING_ENDPOINT, { headers: { Authorization: `Bearer ${accessToken}` } }),
			fetchTopArtists(accessToken),
			fetchRecentTracks(accessToken)
		]);
		const { tracks: freshTracks, lastPlayedAt } = recentResult;
		const topArtists = freshArtists.length > 0 ? freshArtists : cached?.topArtists ?? [];
		const recentTracks = freshTracks.length > 0 ? freshTracks : cached?.recentTracks ?? [];
		if (nowPlayingRes.status === 200) {
			const body = await nowPlayingRes.json();
			if (body.is_playing && body.item) {
				const result = {
					isPlaying: true,
					...parseTrack(body.item),
					progressMs: body.progress_ms,
					durationMs: body.item.duration_ms,
					topArtists,
					recentTracks
				};
				await saveToSupabase(result);
				return result;
			}
		}
		if (recentTracks.length > 0) {
			const result = {
				isPlaying: false,
				...recentTracks[0],
				lastPlayedAt,
				topArtists,
				recentTracks: recentTracks.slice(1)
			};
			await saveToSupabase(result);
			return result;
		}
		if (cached) return {
			...cached,
			isPlaying: false,
			progressMs: void 0,
			durationMs: void 0,
			topArtists,
			recentTracks
		};
		return {
			isPlaying: false,
			topArtists,
			recentTracks
		};
	} catch (error) {
		console.error("Spotify fetch error:", error);
		if (cached) return {
			...cached,
			isPlaying: false,
			progressMs: void 0,
			durationMs: void 0
		};
		return { isPlaying: false };
	}
}
//#endregion
export { fetchSpotifyData as t };
