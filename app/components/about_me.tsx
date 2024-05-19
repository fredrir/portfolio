import React from "react";

export function AboutMeBox() {
  return (
    <div
      className="my-4 rounded border-2 p-4  shadow-lg dark:bg-gradient-to-r dark:from-indigo-800 dark:via-pink-900 dark:to-purple-800 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
      style={{
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <p className="text-shadow text-lg font-semibold text-black dark:text-white">
        {
          "I'm currently in my second year pursuing a Bachelor's degree in Informatics at the Norwegian University of Science and Technology (NTNU) in Trondheim, Norway. Welcome to my portfolio website, a space where I exhibit my personal projects and expertise in software development. For a deeper insight into my professional journey, feel free to explore my CV or get in touch with me."
        }
      </p>
    </div>
  );
}
