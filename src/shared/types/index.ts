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

export interface UiStrings {
  theme: string;
  language: string;
  wallpaper: string;
  customImage: string;
  nowPlaying: string;
  lastPlayed: string;
  track: string;
  artist: string;
  album: string;
  playInBrowser: string;
  hidePlayer: string;
  about: string;
  techStack: string;
  links: string;
  visitors: string;
  uptime: string;
  searchApps: string;
  noMatching: string;
  navigate: string;
  open: string;
  close: string;
  apps: string;
  tipLauncher: string;
  tipDrag: string;
  tipResize: string;
  entries: string;
  projects: string;
  images: string;
  clickToOpen: string;
  active: string;
  stop: string;
  start: string;
  lastYear: string;
  searchingGallery: string;
  emptyGallery: string;
  backgrounds: Record<string, string>;
  localeTitles: Record<string, string>;
  shortTitles: Record<string, string>;
}

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
  previewUrl?: string;
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
  previewUrl?: string;
  progressMs?: number;
  durationMs?: number;
  recentTracks?: SpotifyTrack[];
  topArtists?: SpotifyArtist[];
  lastPlayedAt?: string;
}
