import { useRef, useCallback, useEffect } from "react";
import Image from "@/shared/components/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { GalleryImage } from "@/server/gallery";
import { CaretLeft, CaretRight, MapPin } from "@phosphor-icons/react";
import { useExifData } from "../hooks/use-exif";
import { formatDate } from "../utils";

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 300;

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function ImageDetail({
  image,
  onSwipe,
  currentIndex,
  totalCount,
  adjacentSrcs,
}: {
  image: GalleryImage;
  onSwipe?: (dir: "left" | "right") => void;
  currentIndex: number;
  totalCount: number;
  adjacentSrcs?: string[];
}) {
  const { data: exif, loading: exifLoading } = useExifData(image.originalSrc);
  const displayDate = exif?.dateTaken ?? image.date ?? null;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalCount - 1;

  const directionRef = useRef(0);
  const prevIndexRef = useRef(currentIndex);

  if (currentIndex !== prevIndexRef.current) {
    directionRef.current = currentIndex > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;
  }

  const direction = directionRef.current;

  useEffect(() => {
    if (!adjacentSrcs?.length) return;
    adjacentSrcs.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [adjacentSrcs]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (!onSwipe) return;
      const { offset, velocity } = info;
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
        if (hasNext) onSwipe("left");
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
        if (hasPrev) onSwipe("right");
      }
    },
    [onSwipe, hasNext, hasPrev],
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-1 relative">
      <div className="flex-1 min-h-0 rounded-md overflow-hidden relative border border-control-border bg-black/20">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={image.src}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.15 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 select-none"
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>
      </div>
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

      <div className="shrink-0 min-h-[1.25rem] flex pt-2 flex-wrap gap-x-3 gap-y-0.5 text-2xs text-faded px-0.5">
        {exifLoading && <span className="animate-pulse">...</span>}
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
