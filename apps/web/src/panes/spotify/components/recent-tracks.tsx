import Image from "@/shared/components/image";
import type { SpotifyTrack } from "@/shared/types";

export function RecentTracks({ tracks }: { tracks: SpotifyTrack[] }) {
  if (tracks.length === 0) return null;

  return (
    <>
      {tracks.map((track, i) => (
        <div key={`${track.title}-${i}`} className="flex items-center gap-2 py-0.5">
          {track.albumArt && (
            <Image
              src={track.albumArt}
              alt={track.album}
              width={20}
              height={20}
              className="h-5 w-5 rounded border border-border-faint object-cover"
              unoptimized
            />
          )}
          <div className="min-w-0 flex-1">
            {track.songUrl ? (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-foreground text-xs transition-colors hover:text-primary hover:underline"
              >
                {track.title}
              </a>
            ) : (
              <span className="block truncate text-foreground text-xs">{track.title}</span>
            )}
          </div>
          <span className="@xs:inline hidden max-w-20 truncate text-3xs text-ghost">
            {track.artist}
          </span>
        </div>
      ))}
    </>
  );
}
