import type { SVGProps } from "react";

interface DockerIconProps extends Omit<SVGProps<SVGSVGElement>, "height" | "width"> {
  size?: number | string;
}

export function DockerIcon({ size = 24, ...props }: DockerIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M29.4 13.2c-1.5-.9-3.5-.8-4.8.2-.3-1.8-1.4-3.3-3-4.2l-.9-.5-.6.8c-.8 1.1-1.1 2.7-.8 4.1.2.8.6 1.5 1.1 2H3.2c-.6 0-1.1.5-1 1.2.3 3.1 1.4 5.5 3.3 7.2 2.1 1.9 5.1 2.8 8.9 2.8 8.2 0 14.3-3.8 17.1-10.8.3-.8-.1-1.8-.9-2.2l-1.2-.6Zm-14.8 11.1c-5.9 0-9.1-1.9-9.8-6.3h18.3c.5 0 .9-.1 1.3-.2 1.1-.2 2.1-.7 2.9-1.4.5-.4 1-.6 1.6-.6-2.6 5.7-7.3 8.5-14.3 8.5Z" />
      <path d="M6.1 12.8h3.3v-3H6.1v3Zm4.1 0h3.3v-3h-3.3v3Zm4.1 0h3.3v-3h-3.3v3Zm-4.1-3.8h3.3V6h-3.3v3Zm4.1 0h3.3V6h-3.3v3Zm0-3.8h3.3v-3h-3.3v3Z" />
    </svg>
  );
}
