import React from "react";
import Image from "next/image";
import TerminalComponent from "@/components/Terminal/Terminal";
import { Language } from "@/lib/types/types";
import { getDictionary } from "@/app/[locale]/dictionaries";

const LandingComponent = async ({ lang }: Language) => {
  const dict = await getDictionary(lang);

  const { title, mainText, errorText } = dict.landing.terminal;

  return (
    <div
      id="start"
      className="flex flex-col items-center justify-center pt-32 px-4 min-h-[700px]"
    >
      <div className="rounded-full overflow-hidden w-60 h-60">
        <Image
          src={"/Fredrik_Carsten_Hansteen.png"}
          alt={"Portrett of Fredrik Carsten Hansteen"}
          priority
          width={400}
          height={400}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="dark:text-white rounded-3xl px-4 py-2 mt-4 border-solid border-2 border-gray-400 dark:border-gray-600">
        <h1 className="text-2xl font-bold text-center">
          <span>{title}</span>
          <span className="text-green-700 dark:text-green-500">
            {" <Fredrik/>"}
          </span>
        </h1>
      </div>

      <TerminalComponent mainText={mainText} errorText={errorText} />
    </div>
  );
};

export default LandingComponent;
