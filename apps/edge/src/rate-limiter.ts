import { DurableObject } from "cloudflare:workers";

interface LimitRequest {
  bucket: string;
  limit: number;
  windowMs: number;
}

/**
 * Per-client sliding-window rate limiter. One DO instance per client IP
 * (idFromName), so counts are globally consistent across colos. State is
 * in-memory: hibernation wipes it, which fails open — acceptable for an
 * abuse brake, and it keeps the object free-tier friendly.
 */
export class RateLimiter extends DurableObject {
  private hits = new Map<string, number[]>();

  override async fetch(request: Request): Promise<Response> {
    const { bucket, limit, windowMs } = (await request.json()) as LimitRequest;
    const now = Date.now();
    const kept = (this.hits.get(bucket) ?? []).filter((t) => now - t < windowMs);

    if (kept.length >= limit) {
      this.hits.set(bucket, kept);
      const retryAfter = Math.max(1, Math.ceil((kept[0] + windowMs - now) / 1000));
      return Response.json({ limited: true, retryAfter }, { status: 429 });
    }

    kept.push(now);
    this.hits.set(bucket, kept);
    return Response.json({ limited: false });
  }
}
