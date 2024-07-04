import Contact from "@/components/HomePage/Contact/Contact";
import Journey from "@/components/HomePage/Journey/Journey";
import LandingComponent from "@/components/HomePage/Landing/LandingComponent";
import Projects from "@/components/HomePage/Projects/Projects";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <LandingComponent />
      <Journey />
      <Projects />

      <Contact />
    </div>
  );
}
