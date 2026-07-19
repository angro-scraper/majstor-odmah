import { Logger } from "@nestjs/common";
import { randomUUID } from "crypto";

type RequestLike = {
  method?: string;
  originalUrl?: string;
  url?: string;
  ip?: string;
  socket?: { remoteAddress?: string };
  headers: Record<string, string | string[] | undefined>;
  requestId?: string;
};

type ResponseLike = {
  statusCode?: number;
  setHeader(name: string, value: string | number): void;
  end(payload?: string): void;
  on(event: "finish", listener: () => void): void;
};

type Bucket = { count: number; resetAt: number };

export type OperationalMiddlewareOptions = {
  generalLimit?: number;
  authLimit?: number;
  windowMs?: number;
  now?: () => number;
};

/**
 * Process-local API protection for the modular monolith. The edge/CDN and a
 * shared Redis limiter must enforce the same limits before horizontal scaling;
 * this middleware remains a safe per-instance fallback and gives every request
 * a trace identifier for logs and incident response.
 */
export function createOperationalMiddleware(options: OperationalMiddlewareOptions = {}) {
  const logger = new Logger("RequestLog");
  const buckets = new Map<string, Bucket>();
  const now = options.now ?? Date.now;
  const windowMs = options.windowMs ?? positiveInteger(process.env.RATE_LIMIT_WINDOW_SECONDS, 60) * 1000;
  const generalLimit = options.generalLimit ?? positiveInteger(process.env.RATE_LIMIT_MAX, 120);
  const authLimit = options.authLimit ?? positiveInteger(process.env.AUTH_RATE_LIMIT_MAX, 10);

  return (request: RequestLike, response: ResponseLike, next: () => void) => {
    const startedAt = now();
    const requestId = validRequestId(request.headers["x-request-id"]) ?? randomUUID();
    const path = (request.originalUrl ?? request.url ?? "/").split("?")[0];
    request.requestId = requestId;
    response.setHeader("X-Request-Id", requestId);
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    if (!path.startsWith("/api/") || path.startsWith("/api/docs") || path.endsWith("/health") || path.endsWith("/health/ready")) {
      logOnFinish(response, logger, request, path, requestId, startedAt, now);
      next();
      return;
    }

    const limit = path.startsWith("/api/v1/auth/") ? authLimit : generalLimit;
    const client = clientAddress(request);
    const key = `${client}:${path.startsWith("/api/v1/auth/") ? "auth" : "api"}`;
    const current = buckets.get(key);
    const bucket = !current || current.resetAt <= startedAt ? { count: 0, resetAt: startedAt + windowMs } : current;
    bucket.count += 1;
    buckets.set(key, bucket);
    response.setHeader("RateLimit-Limit", limit);
    response.setHeader("RateLimit-Remaining", Math.max(0, limit - bucket.count));
    response.setHeader("RateLimit-Reset", Math.ceil(bucket.resetAt / 1000));
    pruneBuckets(buckets, startedAt);

    if (bucket.count > limit) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - startedAt) / 1000));
      response.setHeader("Retry-After", retryAfter);
      response.statusCode = 429;
      logger.warn(JSON.stringify({ event: "RATE_LIMITED", requestId, method: request.method ?? "GET", path, retryAfter }));
      response.end(JSON.stringify({ success: false, error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } }));
      return;
    }

    logOnFinish(response, logger, request, path, requestId, startedAt, now);
    next();
  };
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function clientAddress(request: RequestLike) {
  const forwarded = request.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return firstForwarded?.trim() || request.ip || request.socket?.remoteAddress || "unknown";
}

function validRequestId(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && /^[A-Za-z0-9_-]{8,120}$/.test(candidate) ? candidate : undefined;
}

function logOnFinish(response: ResponseLike, logger: Logger, request: RequestLike, path: string, requestId: string, startedAt: number, now: () => number) {
  response.on("finish", () => logger.log(JSON.stringify({
    event: "HTTP_REQUEST", requestId, method: request.method ?? "GET", path,
    statusCode: response.statusCode ?? 200, durationMs: now() - startedAt,
  })));
}

function pruneBuckets(buckets: Map<string, Bucket>, currentTime: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) if (bucket.resetAt <= currentTime) buckets.delete(key);
}
