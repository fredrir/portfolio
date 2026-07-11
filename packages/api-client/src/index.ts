import createOpenApiClient, { type ClientOptions } from "openapi-fetch";

import type { paths } from "./schema";

export type { components, paths } from "./schema";

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient(options: ClientOptions) {
  return createOpenApiClient<paths>(options);
}
