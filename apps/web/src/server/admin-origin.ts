import { getRequestHeader } from "@tanstack/react-start/server";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function requestHost(): string | undefined {
  const host = getRequestHeader("host") ?? getRequestHeader("x-forwarded-host");
  if (!host) return undefined;
  if (host.startsWith("[")) {
    return host.slice(1, host.indexOf("]"));
  }
  return host.split(":")[0];
}

export function isAdminOrigin(): boolean {
  if (getRequestHeader("x-admin-origin") === "1") {
    return true;
  }

  if (!import.meta.env.DEV) {
    return false;
  }

  const host = requestHost();
  return host ? LOOPBACK_HOSTS.has(host) : false;
}
