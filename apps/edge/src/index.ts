import { AwsClient } from "aws4fetch";

export interface Env {
  /** Access service token pair presented to the private origin. */
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
  /** Read-only credential scoped to GetObject on the variants/ prefix. */
  MEDIA_AWS_ACCESS_KEY_ID: string;
  MEDIA_AWS_SECRET_ACCESS_KEY: string;
  MEDIA_BUCKET: string;
  AWS_REGION: string;
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
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** SigV4-signed read of processed media variants; content-hashed keys are immutable. */
async function serveMedia(url: URL, env: Env, ctx: EdgeContext): Promise<Response> {
  const key = url.pathname.slice("/media/".length);
  if (!(key.startsWith("variants/") || key.startsWith("cv/")) || key.includes("..")) {
    return decorate(new Response("not found", { status: 404 }), ctx);
  }
  const aws = new AwsClient({
    accessKeyId: env.MEDIA_AWS_ACCESS_KEY_ID.trim(),
    secretAccessKey: env.MEDIA_AWS_SECRET_ACCESS_KEY.trim(),
    region: env.AWS_REGION,
    service: "s3",
  });
  const objectUrl = `https://${env.MEDIA_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  const signed = await aws.sign(objectUrl, { method: "GET" });
  const response = await fetch(signed, {
    cf: { cacheEverything: true, cacheTtl: 31536000 },
  });
  const out = decorate(response, ctx);
  if (response.ok) {
    out.headers.set("cache-control", "public, max-age=31536000, immutable");
  }
  return out;
}

async function proxyOrigin(request: Request, url: URL, env: Env, ctx: EdgeContext) {
  const originHost = env.ORIGIN_HOST ?? "origin.hansteen.dev";
  const originUrl = new URL(url.pathname + url.search, `https://${originHost}`);
  const originRequest = new Request(originUrl.toString(), request);
  originRequest.headers.set("CF-Access-Client-Id", env.CF_ACCESS_CLIENT_ID.trim());
  originRequest.headers.set(
    "CF-Access-Client-Secret",
    env.CF_ACCESS_CLIENT_SECRET.trim(),
  );
  originRequest.headers.set("x-request-id", ctx.requestId);
  originRequest.headers.set("x-forwarded-host", url.hostname);

  const response = await fetch(
    originRequest,
    IMMUTABLE_PATH.test(url.pathname)
      ? { cf: { cacheEverything: true, cacheTtl: 31536000 } }
      : undefined,
  );
  return decorate(response, ctx);
}

export default {
  async fetch(request, env): Promise<Response> {
    const ctx: EdgeContext = {
      start: Date.now(),
      requestId: crypto.randomUUID(),
      colo: String(request.cf?.colo ?? "unknown"),
    };
    const url = new URL(request.url);

    if (url.pathname.startsWith("/media/")) {
      return serveMedia(url, env, ctx);
    }
    return proxyOrigin(request, url, env, ctx);
  },
} satisfies ExportedHandler<Env>;
