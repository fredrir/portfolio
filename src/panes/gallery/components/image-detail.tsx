import { useRef, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/app/actions/gallery";
import { CaretLeft, CaretRight, MapPin } from "@phosphor-icons/react";
import { isSvg } from "../utils";
import { useExifData } from "../hooks/use-exif";
import { formatDate } from "../utils";

export function ImageDetail({
  image,
  onSwipe,
  narrow,
  currentIndex,
  totalCount,
}: {
  image: GalleryImage;
  onSwipe?: (dir: "left" | "right") => void;
  narrow: boolean;
  currentIndex: number;
  totalCount: number;
}) {
  const { data: exif, loading: exifLoading } = useExifData(image.originalSrc);
  const displayDate = exif?.dateTaken ?? image.date ?? null;
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalCount - 1;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!narrow || !onSwipe) return;
      touchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    [narrow, onSwipe],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!narrow || !onSwipe || !touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      touchRef.current = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        onSwipe(dx > 0 ? "right" : "left");
      }
    },
    [narrow, onSwipe],
  );

  return (
    <div
      className="flex-1 flex flex-col min-h-0 gap-1"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 flex items-center justify-center min-h-0 rounded-md overflow-hidden border border-control-border bg-black/20 relative">
        {isSvg(image.src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <Image
            src={image.src}
            alt=""
            width={1200}
            height={900}
            className="max-w-full max-h-full object-contain"
          />
        )}
        {onSwipe && (
          <>
            <button
              onClick={() => hasPrev && onSwipe("right")}
              className={`absolute left-1.5 top-1/2 -translate-y-1/2 z-10 font-mono text-sm px-2 py-3 rounded bg-black/60 backdrop-blur-sm border border-white/10 transition-all ${hasPrev ? "text-primary hover:text-primary-bold hover:bg-black/80 active:scale-95" : "text-white/20 pointer-events-none"}`}
            >
              <CaretLeft weight="bold" />
            </button>
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 font-mono text-2xs tabular-nums px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-white/50">
              [{currentIndex + 1}/{totalCount}]
            </span>
            <button
              onClick={() => hasNext && onSwipe("left")}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 z-10 font-mono text-sm px-2 py-3 rounded bg-black/60 backdrop-blur-sm border border-white/10 transition-all ${hasNext ? "text-primary hover:text-primary-bold hover:bg-black/80 active:scale-95" : "text-white/20 pointer-events-none"}`}
            >
              <CaretRight weight="bold" />
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 flex pt-2 flex-wrap gap-x-3 gap-y-0.5 text-2xs text-faded px-0.5">
        {exifLoading && <span className="animate-pulse">reading exif...</span>}
        {displayDate && <span>{formatDate(displayDate)}</span>}
        {image.filename && <span> {image.filename} </span>}
        {exif?.camera && <span>{exif.camera}</span>}
        {exif?.focalLength && (
          <span>
            {[
              exif.focalLength,
              exif.aperture,
              exif.shutter,
              exif.iso ? `ISO${exif.iso}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
        {exif?.width && exif?.height && (
          <span>
            {exif.width}×{exif.height}
          </span>
        )}
        {exif?.latitude != null && exif?.longitude != null && (
          <a
            href={`https://www.google.com/maps?q=${exif.latitude},${exif.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-dim hover:text-primary-medium transition-colors inline-flex items-center gap-0.5"
          >
            <MapPin size={12} />
            {exif.latitude.toFixed(4)}, {exif.longitude.toFixed(4)}
          </a>
        )}
      </div>
    </div>
  );
}
