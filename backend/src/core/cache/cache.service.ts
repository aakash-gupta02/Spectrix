import redis from "./cache.client.js";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlInSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    if (ttlInSeconds) {
      await redis.setEx(key, ttlInSeconds, serialized);
      return;
    }

    await redis.set(key, serialized);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }

  async increment(key: string): Promise<number> {
    return await redis.incr(key);
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {
    await redis.expire(key, ttlInSeconds);
  }

  async flush(): Promise<void> {
    await redis.flushDb();
  }
}

export const cache = new CacheService();
