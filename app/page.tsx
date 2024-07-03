import Journey from "@/components/HomePage/Journey/Journey";
import LandingComponent from "@/components/HomePage/Landing/LandingComponent";
import Projects from "@/components/HomePage/Projects/Projects";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <LandingComponent />
      <Projects />
      <Journey />
    </div>
  );
}
