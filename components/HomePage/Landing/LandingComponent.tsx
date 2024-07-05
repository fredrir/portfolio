import React from "react";
import Image from "next/image";
import TerminalComponent from "@/components/Terminal/Terminal";

const LandingComponent = () => {
  return (
    <div
      id="landing-component"
      className="flex flex-col items-center justify-center pt-32 px-7 min-h-[700px]"
    >
      <div className="rounded-full overflow-hidden w-52 h-52">
        <Image
          src={"/Fredrik_Hansteen.jpeg"}
          alt={"Portret of Fredrik Hansteen"}
          priority
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-3xl px-4 py-2 mt-4 border-solid border-2 border-gray-900 dark:border-white">
        <h1 className="text-2xl font-bold text-center">
          <span>{"Hi, I'm"}</span>
          <span className="text-green-700 dark:text-green-500">
            {" <Fredrik/>"}
          </span>
        </h1>
      </div>

      <TerminalComponent />
    </div>
  );
};

export default LandingComponent;
