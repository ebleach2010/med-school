// In-memory token bucket rate limiter, keyed by client address.

interface Bucket {
  tokens: number;
  updated: number;
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  constructor(private capacity: number, private refillPerMinute: number) {}

  take(key: string, nowMs = Date.now()): { ok: boolean; retryAfterSec: number } {
    const b = this.buckets.get(key) ?? { tokens: this.capacity, updated: nowMs };
    const elapsedMin = (nowMs - b.updated) / 60000;
    b.tokens = Math.min(this.capacity, b.tokens + elapsedMin * this.refillPerMinute);
    b.updated = nowMs;
    if (b.tokens >= 1) {
      b.tokens -= 1;
      this.buckets.set(key, b);
      return { ok: true, retryAfterSec: 0 };
    }
    this.buckets.set(key, b);
    return { ok: false, retryAfterSec: Math.ceil(((1 - b.tokens) / this.refillPerMinute) * 60) };
  }
}
