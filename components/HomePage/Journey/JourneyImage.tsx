"use client";
import { memo, useState, useEffect } from "react";
import type { journeyType } from "@/lib/types/types";
import { useTheme } from "next-themes";
import Image from "next/image";

interface Props {
  journey: journeyType;
}

const JourneyImage = memo(({ journey }: Props) => {
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    setImageSrc(
      theme === "dark" ? journey.darkModeImageUri : journey.lightModeImageUri
    );
  }, [theme, journey.darkModeImageUri, journey.lightModeImageUri]);

  return (
    <div className="relative z-20 size-32 rounded-full group overflow-hidden dark:bg-gray-800 bg-white shadow-lg bg-background flex items-center justify-center">
      {imageSrc && (
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={journey.jobTitle}
          width={80}
          height={80}
          className="object-contain z-50 size-32 p-4 group-hover:scale-110 transition-transform duration-300 ease-in-out"
          priority={false}
        />
      )}
    </div>
  );
});

JourneyImage.displayName = "JourneyImage";

export default JourneyImage;
