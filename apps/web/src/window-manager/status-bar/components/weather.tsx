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

export function Weather({ data, strings }: Props) {
  if (!data) {
    return <span className="whitespace-nowrap text-subtle">Trondheim · {strings.unavailable}</span>;
  }

  const temperature = `${Math.round(data.temperatureC)}°C`;
  const condition = conditionFor(data.weatherCode, strings.conditions);
  const title = [
    condition,
    `${strings.observed} ${data.observedAt}`,
    data.stale ? strings.cached : null,
    strings.displayAdjustment,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <span className="whitespace-nowrap">
      <span title={title}>
        {data.location} · {temperature}
        <span className="hidden xl:inline"> · {condition}</span>
        {data.stale && <span className="sr-only"> ({strings.cached})</span>}
      </span>{" "}
      <a
        href="https://open-meteo.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xs text-subtle transition-colors hover:text-primary"
        title={strings.provider}
      >
        Open-Meteo
      </a>
    </span>
  );
}
