export type projectType = {
  id: number;
  title: string;
  description: string;
  languages: string;
  desktopImage?: string;
  mobileImages?: string[];
  githubLink?: string;
  websiteLink?: string;
  websiteAlias?: string;
};

export type journeyType = {
  id: number;
  jobTitle: string;
  company: string;
  description: string;
  date: string;
  lightModeImageUri: string;
  darkModeImageUri: string;
  isCurrent?: boolean;
};

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
  previewUrl?: string;
}

export interface SpotifyArtist {
  name: string;
  imageUrl?: string;
  url?: string;
  genres?: string[];
}

export interface SpotifyData {
  isPlaying?: boolean;
  ok?: boolean;
  error?: string;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
  trackId?: string;
  previewUrl?: string;
  progressMs?: number;
  durationMs?: number;
  recentTracks?: SpotifyTrack[];
  topArtists?: SpotifyArtist[];
  lastPlayedAt?: string;
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  weatherCode: number;
  observedAt: string;
  stale: boolean;
}
