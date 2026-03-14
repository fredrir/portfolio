export interface ContactProps {
  contact: {
    title: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    submitSuccess: string;
    submitError: string;
    submitLoading: string;
    recaptchaError: string;
  };
}

export interface ContributionDay {
  count: number;
  date: string;
  level: number;
}

export interface GitHubData {
  username: string;
  name: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  topLanguages: { lang: string; count: number }[];
  profileUrl: string;
  createdAt: string;
  contributions: ContributionDay[];
  totalContributions: number;
}

export interface SpotifyData {
  isPlaying: boolean;
  notConfigured?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
}
