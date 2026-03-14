"use client";

import { SpotifyPane } from "@/components/HomePage/Contact/SpotifyPane";
import type { SpotifyData } from "@/components/HomePage/Contact/types";

interface Props {
  initialData: SpotifyData;
}

export function SpotifyPaneWrapper({ initialData }: Props) {
  return (
    <div className="h-full overflow-auto">
      <SpotifyPane initialData={initialData} />
    </div>
  );
}
