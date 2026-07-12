import { CaretLeft, CaretRight, MapPin } from "@phosphor-icons/react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import type { GalleryImage } from "@/server/gallery";
import Image from "@/shared/components/image";
import { formatAperture, formatDate, formatFocalLength, formatShutter } from "../utils";

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
  const exposure = [
    image.focalLengthMm != null ? formatFocalLength(image.focalLengthMm) : null,
    image.aperture != null ? formatAperture(image.aperture) : null,
    image.shutterSeconds != null ? formatShutter(image.shutterSeconds) : null,
    image.iso ? `ISO${image.iso}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
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
    <div className="relative flex min-h-0 flex-1 flex-col gap-1">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-control-border bg-black/20">
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
              className="pointer-events-none object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {onSwipe && (
        <>
          <button
            onClick={() => hasPrev && onSwipe("right")}
            className={`absolute top-1/2 left-1.5 z-10 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2 py-3 font-mono text-sm backdrop-blur-sm transition-all ${hasPrev ? "text-primary hover:bg-black/80 hover:text-primary-bold active:scale-95" : "pointer-events-none text-white/20"}`}
          >
            <CaretLeft weight="bold" />
          </button>
          <span className="absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2 rounded border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-2xs text-white/50 tabular-nums backdrop-blur-sm">
            [{currentIndex + 1}/{totalCount}]
          </span>
          <button
            onClick={() => hasNext && onSwipe("left")}
            className={`absolute top-1/2 right-1.5 z-10 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2 py-3 font-mono text-sm backdrop-blur-sm transition-all ${hasNext ? "text-primary hover:bg-black/80 hover:text-primary-bold active:scale-95" : "pointer-events-none text-white/20"}`}
          >
            <CaretRight weight="bold" />
          </button>
        </>
      )}
      <div className="flex min-h-[1.25rem] shrink-0 flex-wrap gap-x-3 gap-y-0.5 px-0.5 pt-2 text-2xs text-faded">
        {image.date && <span>{formatDate(image.date)}</span>}
        {image.filename && <span>{image.filename}</span>}
        {image.camera && <span>{image.camera}</span>}
        {exposure && <span>{exposure}</span>}
        {image.width && image.height && (
          <span>
            {image.width}×{image.height}
          </span>
        )}
        {image.latitude != null && image.longitude != null && (
          <a
            href={`https://www.google.com/maps?q=${image.latitude},${image.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary-dim transition-colors hover:text-primary-medium"
          >
            <MapPin size={12} />
            {image.latitude.toFixed(4)}, {image.longitude.toFixed(4)}
          </a>
        )}
      </div>
    </div>
  );
}
