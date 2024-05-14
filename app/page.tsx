"use client";
import Navbar from "./ui/navbar";
import InfoBox from "./components/info_box";
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

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
      <div className="flex flex-col items-center p-4 md:p-10">
        <InfoBox darkMode={darkMode}>
          <p className="text-3xl font-semibold">{"Hi! I'm Fredrik"}</p>
        </InfoBox>
        <InfoBox darkMode={darkMode}>
          <p className="text-xl text-start font-semibold">
            {
              "I'm currently in my second year pursuing a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Welcome to my portfolio website, a space where I exhibit my personal projects and expertise in software development. For a deeper insight into my professional journey, feel free to explore my CV or get in touch with me."
            }
          </p>
        </InfoBox>
      </div>
    </animated.div>
  );
}
