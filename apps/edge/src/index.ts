import { AwsClient } from "aws4fetch";

export { RateLimiter } from "./rate-limiter";

export interface Env {
  /** Access service token pair presented to the private origin. */
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
  /** Read-only credential scoped to GetObject on published prefixes. */
  MEDIA_AWS_ACCESS_KEY_ID: string;
  MEDIA_AWS_SECRET_ACCESS_KEY: string;
  MEDIA_BUCKET: string;
  AWS_REGION: string;
  /** Overridable for previews; defaults to the production origin. */
  ORIGIN_HOST?: string;
  RATE_LIMITER: DurableObjectNamespace;
}

const SECURITY_HEADERS: Record<string, string> = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": [
    "default-src 'self'",
    // TanStack hydration + reCAPTCHA + PostHog; nonce wiring is a follow-up.
    "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://eu-assets.i.posthog.com",
    "style-src 'self' 'unsafe-inline'",
    // Spotify album art, GitHub avatars, media variants.
    "img-src 'self' data: https:",
    "connect-src 'self' https://eu.i.posthog.com https://api.github.com",
    "frame-src https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

// Vite emits content-hashed files under /assets; safe to cache forever.
const IMMUTABLE_PATH = /^\/assets\//;

const GENERAL_LIMIT = { bucket: "general", limit: 300, windowMs: 60_000 };
const API_WRITE_LIMIT = { bucket: "api-write", limit: 20, windowMs: 60_000 };

interface EdgeContext {
  requestId: string;
  colo: string;
  start: number;
}

function decorate(response: Response, ctx: EdgeContext): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  headers.set("x-request-id", ctx.requestId);
  headers.set("x-edge-colo", ctx.colo);
  headers.set("x-edge-cache", response.headers.get("cf-cache-status") ?? "NONE");
  headers.append("server-timing", `edge;dur=${Date.now() - ctx.start}`);

  // The Access exchange with the private origin issues CF_* cookies; never
  // leak them to the browser or they poison this hostname's later requests.
  const setCookies =
    (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ??
    [];
  if (setCookies.length > 0) {
    headers.delete("set-cookie");
    for (const cookie of setCookies) {
      if (!/^\s*CF_/i.test(cookie)) headers.append("set-cookie", cookie);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** Drop Cloudflare Access cookies so origin auth relies only on the service token. */
function stripAccessCookies(request: Request): void {
  const cookie = request.headers.get("cookie");
  if (!cookie) return;
  const kept = cookie
    .split(/;\s*/)
    .filter((pair) => pair && !/^CF_/i.test(pair));
  if (kept.length > 0) {
    request.headers.set("cookie", kept.join("; "));
  } else {
    request.headers.delete("cookie");
  }
}

/** Globally-consistent sliding-window limit per client IP; fails open. */
async function rateLimited(
  request: Request,
  url: URL,
  env: Env,
  ctx: EdgeContext,
): Promise<Response | null> {
  const rule =
    request.method === "POST" && url.pathname.startsWith("/api/")
      ? API_WRITE_LIMIT
      : GENERAL_LIMIT;
  try {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const stub = env.RATE_LIMITER.get(env.RATE_LIMITER.idFromName(ip));
    const verdict = await stub.fetch("https://rate-limiter.internal/", {
      method: "POST",
      body: JSON.stringify(rule),
    });
    if (verdict.status === 429) {
      const { retryAfter } = (await verdict.json()) as { retryAfter: number };
      const response = decorate(
        new Response("rate limit exceeded", { status: 429 }),
        ctx,
      );
      response.headers.set("retry-after", String(retryAfter));
      return response;
    }
  } catch {
    // Fail open: an unavailable limiter must never take the site down.
  }
  return null;
}

/** SigV4-signed, edge-cached read of published media (variants + CVs). */
async function serveMedia(
  request: Request,
  url: URL,
  env: Env,
  execution: ExecutionContext,
  ctx: EdgeContext,
): Promise<Response> {
  const key = url.pathname.slice("/media/".length);
  if (!(key.startsWith("variants/") || key.startsWith("cv/")) || key.includes("..")) {
    return decorate(new Response("not found", { status: 404 }), ctx);
  }

  // Explicit Cache API: the SigV4 Authorization header would otherwise force
  // BYPASS. Keys are content-hashed, so cached bodies never go stale.
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: "GET" });
  const hit = await cache.match(cacheKey);
  if (hit) {
    const out = decorate(hit, ctx);
    out.headers.set("x-edge-cache", "HIT");
    return out;
  }

  const aws = new AwsClient({
    accessKeyId: env.MEDIA_AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: env.MEDIA_AWS_SECRET_ACCESS_KEY.trim(),
    region: env.AWS_REGION,
    service: "s3",
  });
  const objectUrl = `https://${env.MEDIA_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  const signed = await aws.sign(objectUrl, { method: "GET" });
  const response = await fetch(signed);

  if (!response.ok) {
    return decorate(response, ctx);
  }

  const body = await response.arrayBuffer();
  const cacheable = new Response(body, {
    status: 200,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/octet-stream",
      "content-length": String(body.byteLength),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
  execution.waitUntil(cache.put(cacheKey, cacheable.clone()));
  const out = decorate(cacheable, ctx);
  out.headers.set("x-edge-cache", "MISS");
  return out;
}

async function proxyOrigin(request: Request, url: URL, env: Env, ctx: EdgeContext) {
  const originHost = env.ORIGIN_HOST ?? "origin.hansteen.dev";
  const originUrl = new URL(url.pathname + url.search, `https://${originHost}`);
  const originRequest = new Request(originUrl.toString(), request);
  // A CF_Authorization cookie from an SSO sibling (e.g. admin.hansteen.dev)
  // would be evaluated against the wrong Access app and rejected.
  stripAccessCookies(originRequest);
  originRequest.headers.set("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID.trim());
  originRequest.headers.set(
    "CF-Access-Client-Secret",
    env.CF_ACCESS_CLIENT_SECRET.trim(),
  );
  originRequest.headers.set("x-request-id", ctx.requestId);
  originRequest.headers.set("x-forwarded-host", url.hostname);
  originRequest.headers.set(
    "x-visitor-country",
    String(request.cf?.country ?? ""),
  );
  // The admin origin marker only ever comes from Caddy's admin vhost.
  originRequest.headers.delete("x-admin-origin");

  const response = await fetch(
    originRequest,
    IMMUTABLE_PATH.test(url.pathname)
      ? { cf: { cacheEverything: true, cacheTtl: 31536000 } }
      : undefined,
  );

  // A redirect built from the origin's own URL would point the browser at the
  // private origin host; rewrite it back to the public hostname.
  const location = response.headers.get("location");
  if (location && location.includes(originHost)) {
    const fixed = location.split(originHost).join(url.hostname);
    const headers = new Headers(response.headers);
    headers.set("location", fixed);
    return decorate(
      new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      }),
      ctx,
    );
  }
  return decorate(response, ctx);
}

export default {
  async fetch(request, env, execution): Promise<Response> {
    const ctx: EdgeContext = {
      start: Date.now(),
      requestId: crypto.randomUUID(),
      colo: String(request.cf?.colo ?? "unknown"),
    };
    const url = new URL(request.url);

    // Administration lives on its own Access-protected hostname that does
    // not pass through this Worker.
    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      return decorate(new Response("not found", { status: 404 }), ctx);
    }

    const limited = await rateLimited(request, url, env, ctx);
    if (limited) {
      return limited;
    }

    if (url.pathname.startsWith("/media/")) {
      return serveMedia(request, url, env, execution, ctx);
    }
    return proxyOrigin(request, url, env, ctx);
  },
} satisfies ExportedHandler<Env>;
