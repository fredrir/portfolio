import { projectType } from "../types/types";

const ProjectDescriptions: projectType[] = [
  {
    id: 1,
    title: "Admission Page",
    description:
      "A page for students to apply for admission for roles in the student organization.",
    languages: "Next.js / MongoDB / Tailwind",
    imageUri: "/online-opptak.png",
    githubLink: "https://github.com/appKom/online-opptak/",
    websiteLink: "https://opptak.online.ntnu.no/",
  },
  {
    id: 5,
    title: "Y - Social Media",
    description:
      "A social media platform where you can share posts, like posts, and follow other users.",
    languages: "Vite / MongoDB / Express / Apache2 / Tailwind",
    imageUri: "/y.png",
    githubLink: "https://github.com/fredrir/Y",
    websiteLink: "https://yeeter.no/",
  },
  {
    id: 2,
    title: "Student Organization App",
    description:
      "A mobile app, designed for students, where they can sign up for events, get notified about events, and play games",
    languages: "Flutter / Firebase / Google Cloud Platform",
    imageUri: "/app-picture.png",
    githubLink: "https://github.com/appKom/online_events",
    websiteLink: "https://apps.apple.com/no/app/online/id6476830274",
    websiteAlias: "App Store",
  },
  {
    id: 3,
    title: "Movie Tracker",
    description:
      "A web app where you can track the movies you have watched and want to watch. Created as a project for a course in web development, in collaboration with 5 other students.",
    languages: "Next.js / PostgreSQL / Tailwind",
    imageUri: "/movie-tracker.png",
    githubLink: "https://github.com/fredrir/MovieTracker",
    websiteLink: "https://film-bice.vercel.app/",
  },
  {
    id: 4,
    title: "The Online Fond",
    description:
      "A web app showcasing the student organizations's fond, how it's used and it's performance. It also showcases the fond's members and the projects they have funded.",
    languages: "Next.js / Prisma/ PostgreSQL / Tailwind",
    imageUri: "/onlinefondet.png",
    githubLink: "https://github.com/appkom/onlinefondet",
    websiteLink: "https://onlinefondet.no",
  },
];

export default ProjectDescriptions;
