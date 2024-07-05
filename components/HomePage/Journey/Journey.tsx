import React from "react";
import JourneyCard from "./JourneyCard";
import JourneyDescriptions from "@/lib/descriptions/JourneyDescriptions";
import Image from "next/image";
import JourneyImage from "./JourneyImage";
import JourneyImageMobile from "./JourneyMobile";
import Link from "next/link";

const Journey = () => {
  return (
    <div className="flex flex-col items-center justify-center pb-32">
      <div className="pb-32">
        <Link href="#journey">
          <div className="bg-white dark:bg-gray-900 dark:text-white rounded-3xl px-4 py-2 mt-4 w-fit text-center border-solid border-2 border-gray-900 dark:border-white">
            <h1 className="text-4xl font-bold">My Journey</h1>
          </div>
        </Link>
      </div>
      <div
        id="journey"
        className="hidden md:flex flex flex-col justify-center mt-4 px-7 gap-20 items-center max-w-4xl border-solid rounded-2xl overflow-hidden"
      >
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
      <div className="md:hidden flex flex-col justify-center mt-4 px-7 gap-20 items-center max-w-4xl border-solid rounded-2xl overflow-hidden">
        {JourneyDescriptions.map((journey, index) => (
          <div
            key={journey.id}
            className="flex flex-col gap-4 items-center w-full"
          >
            <JourneyImageMobile journey={journey} />

            <div className="">
              <JourneyCard journey={journey} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;
