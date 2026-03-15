"use client";

import { SpotifyPane } from "@/components/HomePage/Contact/SpotifyPane";
import type { SpotifyData } from "@/components/HomePage/Contact/types";
import type { UiStrings } from "../WindowManager";

interface Props {
  initialData: SpotifyData;
  ui: UiStrings;
}

export function SpotifyPaneWrapper({ initialData, ui }: Props) {
  return <SpotifyPane initialData={initialData} bare ui={ui} />;
}
