"use client";

import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "../../constants";

export function Weather() {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.weather);
    if (stored) {
      setWeather(stored);
      return;
    }
    fetch("https://wttr.in/?format=%t+%C&m")
      .then((r) => r.text())
      .then((text) => {
        const clean = text.trim().slice(0, 30);
        setWeather(clean);
        sessionStorage.setItem(STORAGE_KEYS.weather, clean);
      })
      .catch(() => setWeather(null));
  }, []);

  if (!weather) return null;
  return <span>Trondheim • {weather}</span>;
}
