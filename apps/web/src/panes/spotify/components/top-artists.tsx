import Image from "@/shared/components/image";
import type { SpotifyArtist } from "@/shared/types";

export function TopArtists({ artists }: { artists: SpotifyArtist[] }) {
  if (artists.length === 0) return null;

  return (
    <>
      {artists.map((artist, i) => (
        <div key={`${artist.name}-${i}`} className="flex items-center gap-2 py-0.5">
          {artist.imageUrl && (
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              width={20}
              height={20}
              className="h-5 w-5 rounded-full border border-border-faint object-cover"
              unoptimized
            />
          )}
          <div className="min-w-0 flex-1">
            {artist.url ? (
              <a
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-foreground text-xs transition-colors hover:text-primary hover:underline"
              >
                {artist.name}
              </a>
            ) : (
              <span className="block truncate text-foreground text-xs">{artist.name}</span>
            )}
          </div>
          <span className="w-3 text-right text-primary-dim text-xs">{i + 1}</span>
        </div>
      ))}
    </>
  );
}
