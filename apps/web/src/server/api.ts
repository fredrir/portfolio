import { createApiClient } from "@portfolio/api-client";

// Server-side only: the Axum API is a private origin service.
export const api = createApiClient({
  baseUrl: process.env.API_URL ?? "http://localhost:8080",
});
