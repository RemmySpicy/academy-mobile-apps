import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CacheState, CacheEntry } from './types';

/**
 * Cache Store
 * 
 * Implements smart caching strategy for offline-first capabilities.
 * Manages in-memory cache with TTL, size limits, and cleanup.
 * 
 * Features:
 * - TTL-based cache expiration
 * - Size-limited cache with LRU eviction
 * - Bulk operations for efficiency
 * - Cache statistics for monitoring
 * - Automatic cleanup of expired entries
 */
export const useCacheStore = create<CacheState>()(
  devtools(
    (set, get) => {
      // Cache statistics tracking
      let cacheHits = 0;
      let cacheMisses = 0;
      let totalRequests = 0;

      return {
        // Initial state
        cache: new Map(),
        defaultTTL: 5 * 60 * 1000, // 5 minutes default
        maxSize: 100, // Maximum 100 cache entries

        // Set cache entry with TTL
        set: <T>(key: string, data: T, ttl?: number): void => {
          const { cache, maxSize, defaultTTL } = get();
          const expiresAt = Date.now() + (ttl ?? defaultTTL);
          
          const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            expiresAt,
            key,
          };

          // Create new Map to trigger React updates
          const newCache = new Map(cache);
          
          // If at max size, remove oldest entry (LRU)
          if (newCache.size >= maxSize) {
            const oldestKey = newCache.keys().next().value;
            if (oldestKey) {
              newCache.delete(oldestKey);
            }
          }
          
          newCache.set(key, entry);
          set({ cache: newCache });
        },

        // Get cache entry with expiration check
        get: <T>(key: string): T | null => {
          totalRequests++;
          const { cache } = get();
          const entry = cache.get(key) as CacheEntry<T> | undefined;
          
          if (!entry) {
            cacheMisses++;
            return null;
          }
          
          // Check if expired
          if (Date.now() > entry.expiresAt) {
            cacheMisses++;
            // Remove expired entry
            get().delete(key);
            return null;
          }
          
          cacheHits++;
          return entry.data;
        },

        // Check if key exists and is not expired
        has: (key: string): boolean => {
          const { cache } = get();
          const entry = cache.get(key);
          
          if (!entry) {
            return false;
          }
          
          // Check if expired
          if (Date.now() > entry.expiresAt) {
            get().delete(key);
            return false;
          }
          
          return true;
        },

        // Delete cache entry
        delete: (key: string): void => {
          const { cache } = get();
          const newCache = new Map(cache);
          newCache.delete(key);
          set({ cache: newCache });
        },

        // Clear all cache entries
        clear: (): void => {
          set({ cache: new Map() });
          cacheHits = 0;
          cacheMisses = 0;
          totalRequests = 0;
        },

        // Remove expired entries
        cleanup: (): void => {
          const { cache } = get();
          const newCache = new Map();
          const now = Date.now();
          
          for (const [key, entry] of cache) {
            if (now <= entry.expiresAt) {
              newCache.set(key, entry);
            }
          }
          
          set({ cache: newCache });
        },

        // Set multiple entries at once
        setMany: <T>(entries: Array<{ key: string; data: T; ttl?: number }>): void => {
          const { cache, maxSize, defaultTTL } = get();
          const newCache = new Map(cache);
          const now = Date.now();
          
          for (const { key, data, ttl } of entries) {
            const expiresAt = now + (ttl ?? defaultTTL);
            
            const entry: CacheEntry<T> = {
              data,
              timestamp: now,
              expiresAt,
              key,
            };
            
            // Remove oldest if at capacity
            if (newCache.size >= maxSize) {
              const oldestKey = newCache.keys().next().value;
              if (oldestKey) {
                newCache.delete(oldestKey);
              }
            }
            
            newCache.set(key, entry);
          }
          
          set({ cache: newCache });
        },

        // Get multiple entries at once
        getMany: <T>(keys: string[]): Array<{ key: string; data: T | null }> => {
          return keys.map(key => ({
            key,
            data: get().get<T>(key),
          }));
        },

        // Delete multiple entries at once
        deleteMany: (keys: string[]): void => {
          const { cache } = get();
          const newCache = new Map(cache);
          
          for (const key of keys) {
            newCache.delete(key);
          }
          
          set({ cache: newCache });
        },

        // Get cache statistics
        getStats: () => ({
          size: get().cache.size,
          hitRate: totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0,
          missRate: totalRequests > 0 ? (cacheMisses / totalRequests) * 100 : 0,
          totalRequests,
        }),
      };
    },
    {
      name: 'CacheStore',
      enabled: __DEV__,
    }
  )
);