/**
 * Simple in-memory cache with expiration
 * For production, consider using Redis or a similar solution
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached value if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Delete a key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
    });
  }
}

// Singleton instance
export const cache = new SimpleCache();

// Run cleanup every 5 minutes
if (typeof window === "undefined") {
  // Only run in server environment
  setInterval(() => cache.cleanup(), 5 * 60 * 1000);
}

/**
 * Cache decorator for async functions
 */
export function withCache<T>(
  key: string,
  ttlSeconds: number = 300
): (fn: () => Promise<T>) => Promise<T> {
  return async (fn: () => Promise<T>): Promise<T> => {
    const cached = cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn();
    cache.set(key, result, ttlSeconds);
    return result;
  };
}
