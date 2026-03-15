import Image from "next/image";
import type { SpotifyArtist } from "@/shared/types";

export function TopArtists({ artists }: { artists: SpotifyArtist[] }) {
  if (artists.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-faded text-2xs">
        <span className="text-primary">$</span> cat /proc/spotify/top-artists
      </div>
      <div className="space-y-0.5">
        {artists.map((artist, i) => (
          <div key={`${artist.name}-${i}`} className="flex items-center gap-2 py-0.5">
            <span className="text-primary-dim w-3 text-right text-2xs">{i + 1}</span>
            {artist.imageUrl && (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full border border-border-faint object-cover"
                unoptimized
              />
            )}
            <div className="min-w-0 flex-1">
              {artist.url ? (
                <a
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary hover:underline transition-colors text-2xs truncate block"
                >
                  {artist.name}
                </a>
              ) : (
                <span className="text-foreground text-2xs truncate block">
                  {artist.name}
                </span>
              )}
            </div>
            {artist.genres && artist.genres.length > 0 && (
              <span className="text-ghost text-3xs truncate max-w-24 hidden @xs:inline">
                {artist.genres.join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
