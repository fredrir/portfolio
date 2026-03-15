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

export interface ContributionYear {
  year: string;
  days: ContributionDay[];
  total: number;
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
  contributionsByYear: ContributionYear[];
}

export interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumArt?: string;
  songUrl?: string;
  trackId?: string;
}

export interface SpotifyArtist {
  name: string;
  imageUrl?: string;
  url?: string;
  genres?: string[];
}

export interface SpotifyData {
  isPlaying: boolean;
  notConfigured?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
  trackId?: string;
  progressMs?: number;
  durationMs?: number;
  recentTracks?: SpotifyTrack[];
  topArtists?: SpotifyArtist[];
  lastPlayedAt?: string;
}
