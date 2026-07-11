import {
  CalendarBlank,
  Camera,
  CaretLeft,
  CaretRight,
  FileImage,
  MapPin,
  Ruler,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { type ReactNode, useCallback, useEffect, useRef } from "react";
import type { GalleryImage } from "@/server/gallery";
import Image from "@/shared/components/image";
import { useExifData } from "../hooks/use-exif";
import { formatDate, formatFileSize } from "../utils";

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

function MetadataItem({
  icon,
  label,
  children,
  href,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <span className="mt-px shrink-0 text-primary-dim">{icon}</span>
      <span className="shrink-0 text-3xs text-ghost uppercase tracking-[0.16em]">{label}</span>
      <span className="min-w-0 truncate text-faded">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 items-center gap-1.5 rounded border border-transparent px-1.5 py-1 transition-colors hover:border-control-border-hover hover:bg-control-hover hover:text-primary-medium"
      >
        {content}
      </a>
    );
  }

  return <div className="flex min-w-0 items-center gap-1.5 px-1.5 py-1">{content}</div>;
}

function formatLocation(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

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
  const dimensions =
    exif?.width && exif?.height
      ? `${exif.width}×${exif.height}`
      : image.width && image.height
        ? `${image.width}×${image.height}`
        : null;
  const fileDetails = [
    image.contentType?.replace(/^image\//, "").toUpperCase(),
    image.sizeBytes ? formatFileSize(image.sizeBytes) : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const exposure = [
    exif?.focalLength,
    exif?.aperture,
    exif?.shutter,
    exif?.iso ? `ISO ${exif.iso}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const location =
    exif?.latitude != null && exif?.longitude != null
      ? {
          text: formatLocation(exif.latitude, exif.longitude),
          href: `https://www.google.com/maps?q=${exif.latitude},${exif.longitude}`,
        }
      : null;
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
              alt={image.filename}
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
            type="button"
            aria-label="Previous image"
            onClick={() => hasPrev && onSwipe("right")}
            className={`absolute top-1/2 left-1.5 z-10 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2 py-3 font-mono text-sm backdrop-blur-sm transition-all ${hasPrev ? "text-primary hover:bg-black/80 hover:text-primary-bold active:scale-95" : "pointer-events-none text-white/20"}`}
          >
            <CaretLeft weight="bold" />
          </button>
          <span className="absolute bottom-1.5 left-1/2 z-10 -translate-x-1/2 rounded border border-white/10 bg-black/60 px-1.5 py-0.5 font-mono text-2xs text-white/50 tabular-nums backdrop-blur-sm">
            [{currentIndex + 1}/{totalCount}]
          </span>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => hasNext && onSwipe("left")}
            className={`absolute top-1/2 right-1.5 z-10 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2 py-3 font-mono text-sm backdrop-blur-sm transition-all ${hasNext ? "text-primary hover:bg-black/80 hover:text-primary-bold active:scale-95" : "pointer-events-none text-white/20"}`}
          >
            <CaretRight weight="bold" />
          </button>
        </>
      )}

      <div className="grid @md:max-h-40 max-h-32 shrink-0 @md:grid-cols-2 grid-cols-1 gap-x-2 overflow-y-auto rounded-md border border-border-faint bg-surface-faint p-1 text-2xs">
        {exifLoading && <div className="animate-pulse px-1.5 py-1 text-ghost">...</div>}
        <MetadataItem icon={<FileImage size={12} />} label="File">
          {fileDetails ? `${image.filename} · ${fileDetails}` : image.filename}
        </MetadataItem>
        {displayDate && (
          <MetadataItem icon={<CalendarBlank size={12} />} label="Date">
            {formatDate(displayDate)}
          </MetadataItem>
        )}
        {dimensions && (
          <MetadataItem icon={<Ruler size={12} />} label="Size">
            {dimensions}
          </MetadataItem>
        )}
        {exif?.camera && (
          <MetadataItem icon={<Camera size={12} />} label="Camera">
            {exif.camera}
          </MetadataItem>
        )}
        {exif?.lens && (
          <MetadataItem icon={<Camera size={12} />} label="Lens">
            {exif.lens}
          </MetadataItem>
        )}
        {exposure && (
          <MetadataItem icon={<Camera size={12} />} label="Shot">
            {exposure}
          </MetadataItem>
        )}
        {location && (
          <MetadataItem icon={<MapPin size={12} />} label="Location" href={location.href}>
            {location.text}
          </MetadataItem>
        )}
      </div>
    </div>
  );
}
