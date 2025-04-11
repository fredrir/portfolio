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
};
