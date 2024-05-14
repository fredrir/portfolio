import React from "react";

export default function InfoBox({
  children,
  darkMode,
}: {
  children: React.ReactNode;
  darkMode: boolean;
}) {
  return (
    <div className="my-4 mx-auto w-full md:w-1/2 lg:w-1/3">
      <div
        className={`rounded border-2 p-4 shadow-lg text-center ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-200 bg-white text-black"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
