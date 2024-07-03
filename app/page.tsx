import LandingComponent from "@/components/HomePage/LandingComponent";
import Projects from "@/components/HomePage/Projects";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <LandingComponent />
      <Projects />
    </div>
  );
}
