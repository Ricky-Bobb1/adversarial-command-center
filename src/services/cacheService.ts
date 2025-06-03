interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

import { environment } from '../utils/environment';
import { logger } from '../utils/logger';

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL: number;

  constructor() {
    this.defaultTTL = environment.cacheTimeout;
    logger.info('Cache Service initialized', 'CacheService', {
      defaultTTL: this.defaultTTL,
      environment: environment.isDevelopment ? 'development' : 'production'
    });
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    logger.debug(`Cache set: ${key}`, 'Cache', { ttl });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug(`Cache miss: ${key}`, 'Cache');
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`, 'Cache');
      return null;
    }

    logger.debug(`Cache hit: ${key}`, 'Cache');
    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      logger.debug(`Cache hit for key: ${key}`, 'Cache');
      return cached;
    }

    logger.debug(`Cache miss for key: ${key}, fetching...`, 'Cache');
    const startTime = performance.now();
    
    try {
      const data = await fetcher();
      this.set(key, data, ttl);
      
      const duration = performance.now() - startTime;
      logger.performance(`Cache fetch: ${key}`, duration, 'Cache');
      
      return data;
    } catch (error) {
      logger.error(`Cache fetch failed: ${key}`, 'Cache', error as Error);
      throw error;
    }
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export const cacheService = new CacheService();

// Cache key generators
export const cacheKeys = {
  simulations: () => 'simulations',
  simulation: (id: string) => `simulation:${id}`,
  simulationStatus: (id: string) => `simulation:${id}:status`,
  agents: () => 'agents',
  agent: (id: string) => `agent:${id}`,
  agentsBySimulation: (simulationId: string) => `agents:simulation:${simulationId}`,
  nodes: () => 'nodes',
  node: (id: string) => `node:${id}`,
  networkTopology: () => 'network:topology',
  scenarios: () => 'scenarios',
};
