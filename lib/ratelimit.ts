// ==============================================
// Rate Limiting for Zomi Love Guru
// ==============================================

import type { RateLimitEntry } from './types';

// In-memory store for rate limiting
// In production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.firstRequest > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 60000);
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  // Use the first available IP
  let ip = cfConnectingIp || realIp || forwarded?.split(',')[0]?.trim() || 'unknown';

  // Hash the IP for privacy
  return `client_${hashString(ip)}`;
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check rate limit for a client
 * Returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(clientId: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || now - entry.firstRequest > WINDOW_MS) {
    // First request or window expired
    rateLimitStore.set(clientId, { count: 1, firstRequest: now });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: WINDOW_MS,
    };
  }

  // Within the window
  const resetIn = WINDOW_MS - (now - entry.firstRequest);

  if (entry.count >= MAX_REQUESTS) {
    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(clientId, entry);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn,
  };
}

/**
 * Create rate limit headers for response
 */
export function getRateLimitHeaders(
  remaining: number,
  resetIn: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
  };
}
