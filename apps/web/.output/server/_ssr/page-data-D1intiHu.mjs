import { n as createServerFn } from "./ssr.mjs";
import { n as GITHUB_USERNAME, u as locales } from "./types-C3uRy3ln.mjs";
import { t as createServerRpc } from "./createServerRpc-CtTvFnxR.mjs";
import { t as fetchSpotifyData } from "./spotify-tH4SB1Od.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-data-D1intiHu.js
var dictionaries = {
	en: () => import("./en-BSykYhc1.mjs").then((module) => module.default),
	nb: () => import("./nb-Z56yQzSO.mjs").then((module) => module.default),
	nn: () => import("./nn-BpuQ1PBq.mjs").then((module) => module.default),
	fr: () => import("./fr-B3wGOXLN.mjs").then((module) => module.default)
};
var getDictionary = async (locale) => dictionaries[locale]();
async function fetchContributions(year) {
	try {
		const url = year ? `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31` : `https://github.com/users/${GITHUB_USERNAME}/contributions`;
		const res = await fetch(url);
		if (!res.ok) return {
			days: [],
			total: 0
		};
		const html = await res.text();
		const days = [];
		const tdRegex = /<td[^>]*data-date="([^"]*)"[^>]*id="([^"]*)"[^>]*data-level="(\d)"/g;
		let match;
		while ((match = tdRegex.exec(html)) !== null) {
			const date = match[1];
			const id = match[2];
			const level = parseInt(match[3], 10);
			let count = 0;
			const tooltipRegex = new RegExp(`<tool-tip[^>]*for="${id}"[^>]*>([^<]*)`);
			const tooltipMatch = html.match(tooltipRegex);
			if (tooltipMatch) {
				const numMatch = tooltipMatch[1].match(/(\d+)/);
				count = numMatch ? parseInt(numMatch[1], 10) : 0;
			}
			if (!count && level > 0) count = level;
			days.push({
				count,
				date,
				level
			});
		}
		let total = days.reduce((sum, d) => sum + d.count, 0);
		const totalMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in\s+(?:the last year|\d{4})/);
		if (totalMatch) total = parseInt(totalMatch[1].replace(/,/g, ""), 10);
		return {
			days,
			total
		};
	} catch {
		return {
			days: [],
			total: 0
		};
	}
}
var CACHE_TTL_MS = 36e5;
var cache = null;
async function fetchGitHubData() {
	if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.data;
	const data = await loadGitHubData();
	if (data) cache = {
		data,
		fetchedAt: Date.now()
	};
	return data;
}
async function loadGitHubData() {
	try {
		const [userRes, reposRes] = await Promise.all([fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers: { Accept: "application/vnd.github.v3+json" } }), fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers: { Accept: "application/vnd.github.v3+json" } })]);
		if (!userRes.ok || !reposRes.ok) return null;
		const user = await userRes.json();
		const repos = await reposRes.json();
		const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
		const languageCounts = {};
		for (const repo of repos) if (repo.language) languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
		const topLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([lang, count]) => ({
			lang,
			count
		}));
		const createdYear = new Date(user.created_at).getFullYear();
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		const yearKeys = ["last"];
		for (let y = currentYear; y >= createdYear; y--) yearKeys.push(String(y));
		const allContributions = await Promise.all(yearKeys.map(async (y) => {
			return {
				year: y,
				...await fetchContributions(y === "last" ? void 0 : y)
			};
		}));
		return {
			username: user.login,
			name: user.name,
			bio: user.bio,
			publicRepos: user.public_repos,
			followers: user.followers,
			following: user.following,
			totalStars,
			topLanguages,
			profileUrl: user.html_url,
			createdAt: user.created_at,
			contributionsByYear: allContributions
		};
	} catch {
		return null;
	}
}
var getPageData_createServerFn_handler = createServerRpc({
	id: "3e44fc580f25301b5fc81d9c1d8c42d79e34f5a1d9e35f8dc102a5678c4016d2",
	name: "getPageData",
	filename: "src/server/page-data.ts"
}, (opts) => getPageData.__executeServer(opts));
var getPageData = createServerFn().validator((data) => {
	if (!locales.includes(data.locale)) throw new Error(`Unsupported locale: ${data.locale}`);
	return data;
}).handler(getPageData_createServerFn_handler, async ({ data }) => {
	const [dict, githubData, spotifyData] = await Promise.all([
		getDictionary(data.locale),
		fetchGitHubData(),
		fetchSpotifyData()
	]);
	return {
		locale: data.locale,
		dict,
		githubData,
		spotifyData
	};
});
//#endregion
export { getPageData_createServerFn_handler };
