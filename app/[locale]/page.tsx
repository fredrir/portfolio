import Contact from "@/components/HomePage/Contact/Contact";
import Journey from "@/components/HomePage/Journey/Journey";
import LandingComponent from "@/components/HomePage/Landing/LandingComponent";
import Projects from "@/components/HomePage/Projects/Projects";
import { getDictionary } from "./dictionaries";
import { localeParams } from "@/lib/types/languageTypes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "nb" },
    { locale: "nn" },
    { locale: "fr" },
  ];
}

export default async function Home(props: { params: localeParams }) {
  const { locale } = await props.params;

  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar navbar={dict.navbar} currentLocale={locale} />
      <main className="flex-grow bg-fixed z-20">
        <LandingComponent landing={dict.landing} />
        <Journey lang={locale} />
        <Projects
          title={dict.project.title}
          projects={dict.project.projects}
          viewCode={dict.project.viewCode}
        />
        <Contact contact={dict.contact} />
      </main>
      <Footer license1={dict.footer.license1} license2={dict.footer.license2} />
    </>
  );
}
