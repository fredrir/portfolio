"use client";
import Navbar from "./ui/navbar";
import { InfoBox } from "./components/info_box";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { AboutMeBox } from "./components/about_me";
import { GithubStats } from "./components/github_stats";
import Image from "next/image";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const backgroundProps = useSpring({
    background: darkMode
      ? "linear-gradient(to right, #232526, #414345)"
      : "linear-gradient(to right, #ff7e5f, #feb47b)",
  });

  return (
    <animated.div
      style={{ ...backgroundProps, minHeight: "100vh" }}
      className="flex flex-col"
    >
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col md:flex-row gap-10 items-start p-4 md:p-10">
        <div className="flex flex-col flex-1">
          <InfoBox darkMode={darkMode} />
          <AboutMeBox darkMode={darkMode} />
        </div>
        <div className="flex justify-end">
          <Image
            src="/fredrik-hansteen.png"
            alt="Description of image"
            className="my-4 rounded shadow-lg"
            width={"400"}
            height={"400"}
          />
        </div>
        <div className="w-auto md:w-auto">
          <GithubStats darkMode={darkMode} />
        </div>
      </div>
    </animated.div>
  );
}
