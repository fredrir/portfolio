import type { GalleryImage } from "@/server/gallery";
import Image from "@/shared/components/image";
import { isSvg } from "../utils";

export function Thumbnail({ image, className }: { image: GalleryImage; className?: string }) {
  if (isSvg(image.src)) {
    return (
      <img
        src={image.src}
        alt={image.filename}
        className={`h-full w-full object-contain p-1.5 ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src={image.src}
      alt={image.filename}
      width={200}
      height={150}
      className={`h-full w-full object-cover ${className ?? ""}`}
    />
  );
}
