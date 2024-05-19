import React from "react";

export function InfoBox() {
  return (
    <div
      className="my-4 rounded border-2 p-4  shadow-lg dark:bg-gradient-to-r dark:from-indigo-800 dark:via-pink-900 dark:to-purple-800 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
      style={{
        maxWidth: "600px",
      }}
    >
      <p className="`text-shadow text-3xl font-semibold text-black dark:text-white">
        {"Hi! I'm <Fredrik/>"}
      </p>
    </div>
  );
}
