"use client";
import { useTheme } from "@/lib/hooks/UseTheme";
import type { journeyType } from "@/lib/types/types";
import Image from "next/image";

interface Props {
  journey: journeyType;
}

const JourneyImage = ({ journey }: Props) => {
  const theme = useTheme();
  const imageSrc =
    theme === "dark" ? journey.darkModeImageUri : journey.lightModeImageUri;

  return (
    <div className="relative z-20 size-32 rounded-full overflow-hidden dark:bg-gray-800 bg-white shadow-lg bg-background flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={journey.jobTitle}
        width={80}
        height={80}
        className="object-contain z-50 size-32 p-2 transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
};

export default JourneyImage;
