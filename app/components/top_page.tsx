import React from "react";
import { InfoBox } from "./info_box";
import { GithubStats } from "./github_stats";
import Image from "next/image";
import { AboutMeBox } from "./about_me";

export default function TopPage() {
  return (
    <div className="flex flex-col md:flex-row gap-10 items-start p-4 md:p-10">
      <div className="flex flex-col flex-1">
        <InfoBox />
        <AboutMeBox />
      </div>
      <div className="flex ">
        <Image
          src="/fredrik-hansteen.png"
          alt="Description of image"
          className="my-4 rounded shadow-lg"
          width={"400"}
          height={"400"}
        />
      </div>
      <div className="w-auto md:w-auto">
        <GithubStats />
      </div>
    </div>
  );
}
