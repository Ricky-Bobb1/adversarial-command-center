
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

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

  // Get or fetch pattern - common caching pattern
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      console.log(`Cache hit for key: ${key}`);
      return cached;
    }

    console.log(`Cache miss for key: ${key}, fetching...`);
    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  // Invalidate cache entries by pattern
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
