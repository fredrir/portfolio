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

  const { contact } = dict;

  return (
    <>
      <Navbar navbar={dict.navbar} />
      <main className="flex-grow bg-fixed z-20">
        <LandingComponent lang={locale} />
        <Journey lang={locale} />
        <Projects title={dict.project.title} projects={dict.project.projects} />
        <Contact
          name={contact.name}
          email={contact.email}
          phone={contact.phone}
          message={contact.message}
          submit={contact.submit}
          title={contact.title}
          submitSuccess={contact.submitSuccess}
          submitError={contact.submitError}
          submitLoading={contact.submitLoading}
          recaptchaError={contact.recaptchaError}
        />
      </main>
      <Footer
        liscence1={dict.footer["liscence-1"]}
        liscence2={dict.footer["liscence-2"]}
      />
    </>
  );
}
