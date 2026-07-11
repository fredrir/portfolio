import { GITHUB_USERNAME } from "./constants";

interface ContributionDay {
  count: number;
  date: string;
  level: number;
}

async function fetchContributions(
  year?: string,
): Promise<{ days: ContributionDay[]; total: number }> {
  try {
    const url = year
      ? `https://github.com/users/${GITHUB_USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`
      : `https://github.com/users/${GITHUB_USERNAME}/contributions`;
    const res = await fetch(url);
    if (!res.ok) return { days: [], total: 0 };
    const html = await res.text();

    const days: ContributionDay[] = [];
    const tdRegex =
      /<td[^>]*data-date="([^"]*)"[^>]*id="([^"]*)"[^>]*data-level="(\d)"/g;
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

      if (!count && level > 0) {
        count = level;
      }

      days.push({ count, date, level });
    }

    let total = days.reduce((sum, d) => sum + d.count, 0);
    const totalMatch = html.match(
      /(\d[\d,]*)\s+contributions?\s+in\s+(?:the last year|\d{4})/,
    );
    if (totalMatch) {
      total = parseInt(totalMatch[1].replace(/,/g, ""), 10);
    }

    return { days, total };
  } catch {
    return { days: [], total: 0 };
  }
}

type GitHubData = Awaited<ReturnType<typeof loadGitHubData>>;

const CACHE_TTL_MS = 3600_000;
let cache: { data: GitHubData; fetchedAt: number } | null = null;

export async function fetchGitHubData() {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }
  const data = await loadGitHubData();
  if (data) {
    cache = { data, fetchedAt: Date.now() };
  }
  return data;
}

async function loadGitHubData() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
        },
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = repos.reduce(
      (sum: number, repo: { stargazers_count: number }) =>
        sum + repo.stargazers_count,
      0,
    );

    const languageCounts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    }
    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({ lang, count }));

    const createdYear = new Date(user.created_at).getFullYear();
    const currentYear = new Date().getFullYear();

    const yearKeys = ["last"];
    for (let y = currentYear; y >= createdYear; y--) {
      yearKeys.push(String(y));
    }

    const allContributions = await Promise.all(
      yearKeys.map(async (y) => {
        const data = await fetchContributions(y === "last" ? undefined : y);
        return { year: y, ...data };
      }),
    );

    return {
      username: user.login as string,
      name: user.name as string,
      bio: user.bio as string,
      publicRepos: user.public_repos as number,
      followers: user.followers as number,
      following: user.following as number,
      totalStars,
      topLanguages,
      profileUrl: user.html_url as string,
      createdAt: user.created_at as string,
      contributionsByYear: allContributions,
    };
  } catch {
    return null;
  }
}
