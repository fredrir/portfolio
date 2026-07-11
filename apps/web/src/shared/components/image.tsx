import type { ImgHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

export default function Image({
  src,
  alt,
  fill,
  priority,
  unoptimized: _unoptimized,
  className,
  loading,
  ...rest
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding="async"
      className={fill ? cn("absolute inset-0 h-full w-full", className) : className}
      {...rest}
    />
  );
}
