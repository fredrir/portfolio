export interface Env {
  /** Access service token pair presented to the private origin. */
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
  /** Overridable for previews; defaults to the production origin. */
  ORIGIN_HOST?: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

// Vite emits content-hashed files under /assets; safe to cache forever.
const IMMUTABLE_PATH = /^\/assets\//;

export default {
  async fetch(request, env): Promise<Response> {
    const start = Date.now();
    const requestId = crypto.randomUUID();
    const url = new URL(request.url);
    const originHost = env.ORIGIN_HOST ?? "origin.hansteen.dev";

    const originUrl = new URL(url.pathname + url.search, `https://${originHost}`);
    const originRequest = new Request(originUrl.toString(), request);
    originRequest.headers.set("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID.trim());
    originRequest.headers.set(
      "CF-Access-Client-Secret",
      env.CF_ACCESS_CLIENT_SECRET.trim(),
    );
    originRequest.headers.set("x-request-id", requestId);
    originRequest.headers.set("x-forwarded-host", url.hostname);

    const response = await fetch(
      originRequest,
      IMMUTABLE_PATH.test(url.pathname)
        ? { cf: { cacheEverything: true, cacheTtl: 31536000 } }
        : undefined,
    );

    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }
    headers.set("x-request-id", requestId);
    headers.set("x-edge-colo", String(request.cf?.colo ?? "unknown"));
    headers.set("x-edge-cache", response.headers.get("cf-cache-status") ?? "NONE");
    headers.append("server-timing", `edge;dur=${Date.now() - start}`);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
