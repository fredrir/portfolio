import { NextResponse } from "next/server";

const GITHUB_USERNAME = "fredrir";
const CACHE_DURATION = 3600;

interface ContributionDay {
  count: number;
  date: string;
  level: number;
}

async function fetchContributions(): Promise<ContributionDay[]> {
  try {
    const res = await fetch(
      `https://github.com/users/${GITHUB_USERNAME}/contributions`,
      { next: { revalidate: CACHE_DURATION } },
    );
    if (!res.ok) return [];
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
      const tooltipRegex = new RegExp(
        `<tool-tip[^>]*for="${id}"[^>]*>([^<]*)`,
      );
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

    return days;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [userRes, reposRes, contributions] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: CACHE_DURATION },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: CACHE_DURATION },
        },
      ),
      fetchContributions(),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json(
        { error: "GitHub API error" },
        { status: 502 },
      );
    }

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

    const totalContributions = contributions.reduce(
      (sum, d) => sum + d.count,
      0,
    );

    return NextResponse.json({
      username: user.login,
      name: user.name,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      topLanguages,
      profileUrl: user.html_url,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      contributions,
      totalContributions,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 },
    );
  }
}
