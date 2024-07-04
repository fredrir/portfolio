import React from "react";
import JourneyCard from "./JourneyCard";
import JourneyDescriptions from "@/lib/descriptions/JourneyDescriptions";
import Image from "next/image";
import JourneyImage from "./JourneyImage";

const Journey = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="pb-32">
        <div className="bg-white dark:bg-gray-900 dark:text-white rounded-3xl px-4 py-2 mt-4 w-fit text-center">
          <h1 className="text-2xl font-bold">My Journey</h1>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-4 px-12 gap-10 items-center max-w-4xl border-solid rounded-2xl overflow-hidden">
        {JourneyDescriptions.map((journey, index) => (
          <div key={journey.id} className="flex items-center w-full">
            {index % 2 !== 0 && (
              <div className="flex-1 flex justify-end pr-8">
                <JourneyCard journey={journey} />
              </div>
            )}
            <JourneyImage journey={journey} />
            {index % 2 === 0 && (
              <div className="flex-1 flex justify-start pl-24">
                <JourneyCard journey={journey} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;
