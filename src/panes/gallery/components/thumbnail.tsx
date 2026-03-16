import Image from "next/image";
import type { GalleryImage } from "@/app/actions/gallery";
import { isSvg } from "../utils";

export function Thumbnail({
  image,
  className,
}: {
  image: GalleryImage;
  className?: string;
}) {
  if (isSvg(image.src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image.src}
        alt={image.filename}
        className={`w-full h-full object-contain p-1.5 ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src={image.src}
      alt={image.filename}
      width={200}
      height={150}
      className={`w-full h-full object-cover ${className ?? ""}`}
    />
  );
}
