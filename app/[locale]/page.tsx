import Contact from "@/components/HomePage/Contact/Contact";
import Journey from "@/components/HomePage/Journey/Journey";
import LandingComponent from "@/components/HomePage/Landing/LandingComponent";
import Projects from "@/components/HomePage/Projects/Projects";
import { getDictionary } from "./dictionaries";
import { localeParams } from "@/lib/types/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "nb" }, { lang: "nn" }];
}

export default async function Home(props: { params: localeParams }) {
  const { locale } = await props.params;

  const dict = await getDictionary(locale);

  return (
    <>
      <Navbar navbar={dict.navbar} currentLocale={locale} />
      <main className="flex-grow bg-fixed z-20">
        <LandingComponent lang={locale} />
        <Journey lang={locale} />
        <Projects title={dict.project.title} projects={dict.project.projects} />
        <Contact contact={dict.contact} />
      </main>
      <Footer
        liscence1={dict.footer["liscence-1"]}
        liscence2={dict.footer["liscence-2"]}
      />
    </>
  );
}
