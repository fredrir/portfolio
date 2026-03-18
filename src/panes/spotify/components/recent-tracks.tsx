import Image from "next/image";
import type { SpotifyTrack } from "@/shared/types";

export function RecentTracks({ tracks }: { tracks: SpotifyTrack[] }) {
  if (tracks.length === 0) return null;

  return (
    <>
      {tracks.map((track, i) => (
        <div
          key={`${track.title}-${i}`}
          className="flex items-center gap-2 py-0.5"
        >
          {track.albumArt && (
            <Image
              src={track.albumArt}
              alt={track.album}
              width={20}
              height={20}
              className="w-5 h-5 rounded border border-border-faint object-cover"
              unoptimized
            />
          )}
          <div className="min-w-0 flex-1">
            {track.songUrl ? (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary hover:underline transition-colors text-2xs truncate block"
              >
                {track.title}
              </a>
            ) : (
              <span className="text-foreground text-2xs truncate block">
                {track.title}
              </span>
            )}
          </div>
          <span className="text-ghost text-3xs truncate max-w-20 hidden @xs:inline">
            {track.artist}
          </span>
        </div>
      ))}
    </>
  );
}
