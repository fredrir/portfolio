"use client";

import { useState, useEffect } from "react";
import { KEYS, read, write } from "@/lib/storage";

export function Weather() {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    const stored = read(KEYS.weather, true);
    if (stored) {
      setWeather(stored);
      return;
    }
    fetch("https://wttr.in/?format=%t+%C&m")
      .then((r) => r.text())
      .then((text) => {
        const clean = text.trim().slice(0, 30);
        setWeather(clean);
        write(KEYS.weather, clean, true);
      })
      .catch(() => setWeather(null));
  }, []);

  if (!weather) return null;
  return <span>Trondheim • {weather}</span>;
}
