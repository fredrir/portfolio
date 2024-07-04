"use client";
import { useTheme } from "@/lib/hooks/UseTheme";
import { journeyType } from "@/lib/types/types";
import Image from "next/image";

interface Props {
  journey: journeyType;
}

const JourneyImage = ({ journey }: Props) => {
  const theme = useTheme();
  const imageSrc =
    theme === "dark" ? journey.darkModeImageUri : journey.lightModeImageUri;

  return (
    <div className="w-1/4 max-h-full flex items-center justify-center">
      <Image
        src={imageSrc}
        alt={journey.jobTitle}
        width={200}
        height={200}
        className="max-w-full h-auto mx-8 rounded-lg"
      />
    </div>
  );
};
export default JourneyImage;
