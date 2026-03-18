"use server";

import { fetchSpotifyData } from "@/lib/spotify";
import { SpotifyData } from "@/shared/types";
import { verifyCaptcha } from "@/lib/captcha";

export async function getSpotifyData(
  captchaToken: string,
): Promise<SpotifyData> {
  const captchaOk = await verifyCaptcha({
    minScore: 0.3,
    token: captchaToken,
    expectedAction: "spotify_data",
  });
  if (!captchaOk) {
    return { ok: false, error: "captcha_failed" };
  }

  return fetchSpotifyData();
}
