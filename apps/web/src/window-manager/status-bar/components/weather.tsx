import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudWarning,
  type Icon,
  Sun,
} from "@phosphor-icons/react";
import type { UiStrings } from "@/i18n/types";
import type { WeatherData } from "@/shared/types";

interface Props {
  data: WeatherData | null;
  strings: UiStrings["weather"];
}

function conditionFor(code: number, strings: UiStrings["weather"]["conditions"]): string {
  switch (code) {
    case 0:
      return strings.clear;
    case 1:
      return strings.mostlyClear;
    case 2:
      return strings.partlyCloudy;
    case 3:
      return strings.overcast;
    case 45:
    case 48:
      return strings.fog;
    case 51:
    case 53:
    case 55:
      return strings.drizzle;
    case 56:
    case 57:
      return strings.freezingDrizzle;
    case 61:
    case 63:
    case 65:
      return strings.rain;
    case 66:
    case 67:
      return strings.freezingRain;
    case 71:
    case 73:
    case 75:
    case 77:
      return strings.snow;
    case 80:
    case 81:
    case 82:
      return strings.rainShowers;
    case 85:
    case 86:
      return strings.snowShowers;
    case 95:
      return strings.thunderstorm;
    case 96:
    case 99:
      return strings.hailThunderstorm;
    default:
      return strings.unknown;
  }
}

function iconFor(code: number): Icon {
  switch (code) {
    case 0:
      return Sun;
    case 1:
    case 2:
      return CloudSun;
    case 3:
      return Cloud;
    case 45:
    case 48:
      return CloudFog;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return CloudRain;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return CloudSnow;
    case 95:
    case 96:
    case 99:
      return CloudLightning;
    default:
      return CloudWarning;
  }
}

export function Weather({ data, strings }: Props) {
  if (!data) {
    return <span className="whitespace-nowrap text-subtle">Trondheim · {strings.unavailable}</span>;
  }

  const temperature = `${Math.round(data.temperatureC)}°C`;
  const condition = conditionFor(data.weatherCode, strings.conditions);
  const WeatherIcon = iconFor(data.weatherCode);

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span>
        {data.location} · {temperature}
      </span>
      <WeatherIcon
        aria-label={condition}
        className="shrink-0 text-primary-medium"
        role="img"
        size={14}
        weight="bold"
      />
    </span>
  );
}
