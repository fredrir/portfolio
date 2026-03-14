import { NextResponse } from "next/server";

const GITHUB_USERNAME = "fredrir";
const CACHE_DURATION = 3600;

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
    const res = await fetch(url, { next: { revalidate: CACHE_DURATION } });
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year") ?? undefined;

    const [userRes, reposRes, contributionData] = await Promise.all([
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
      fetchContributions(year),
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
      contributions: contributionData.days,
      totalContributions: contributionData.total,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 },
    );
  }
}
