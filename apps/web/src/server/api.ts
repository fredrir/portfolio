import { createApiClient } from "@portfolio/api-client";
import { getRequestHeader } from "@tanstack/react-start/server";

// Server-side only: the Axum API is a private origin service.
export const api = createApiClient({
  baseUrl: process.env.API_URL ?? "http://localhost:8080",
});

export function traceHeaders(): Record<string, string> {
  const requestId = getRequestHeader("x-request-id");
  return requestId ? { "x-request-id": requestId } : {};
}
