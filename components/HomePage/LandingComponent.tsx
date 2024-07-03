import React from "react";
import Image from "next/image";

const LandingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-32">
      <div className="rounded-full overflow-hidden w-52 h-52 border-solid border-white border-4">
        <Image
          src={"/Fredrik_Hansteen.jpeg"}
          alt={"Portret of Fredrik Hansteen"}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="bg-white rounded-3xl px-4 py-2 mt-4">
        <h1 className="text-2xl font-bold text-center">{"Hi, I'm Fredrik"}</h1>
      </div>
    </div>
  );
};

export default LandingComponent;
