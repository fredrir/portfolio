import React from "react";

export function InfoBox({ darkMode }: { darkMode: boolean }) {
  return (
    <div
      className={`my-4 rounded border-2 p-4  shadow-lg ${
        darkMode
          ? "bg-gradient-to-r from-indigo-800 via-pink-900 to-purple-800"
          : "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
      }`}
    >
      <p
        className={`text-shadow text-3xl font-semibold ${
          darkMode ? `text-white` : `text-black`
        }`}
      >
        {"Hi! I'm <Fredrik/>"}
      </p>
    </div>
  );
}
