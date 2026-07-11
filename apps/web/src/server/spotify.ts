import { createServerFn } from "@tanstack/react-start";

import { verifyCaptcha } from "@/lib/captcha";
import { fetchSpotifyData } from "@/lib/spotify";
import type { SpotifyData } from "@/shared/types";

export const getSpotifyData = createServerFn({ method: "POST" })
  .validator((captchaToken: string) => captchaToken)
  .handler(async ({ data: captchaToken }): Promise<SpotifyData> => {
    const captcha = await verifyCaptcha({
      minScore: 0.3,
      token: captchaToken,
      expectedAction: "spotify_data",
    });
    if (!captcha.ok) {
      return { ok: false, error: "captcha_failed" };
    }

    return fetchSpotifyData();
  });
