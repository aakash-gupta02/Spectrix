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

  async setValue(key: string, value: string, ttlInSeconds?: number) {
    if (ttlInSeconds) {
      await redis.setEx(key, ttlInSeconds, value);
      return;
    }

    await redis.set(key, value);
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

  async incrementBy(key: string, value: number): Promise<number> {
    return await redis.incrBy(key, value);
  }

  async expire(key: string, ttlInSeconds: number): Promise<void> {
    await redis.expire(key, ttlInSeconds);
  }

  async flush(): Promise<void> {
    await redis.flushDb();
  }

  async getDel<T>(key: string): Promise<T | null> {
    const value = await redis.getDel(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async addToSet(key: string, ...members: string[]): Promise<number> {
    return redis.sAdd(key, members);
  }

  async getSetMembers(key: string): Promise<string[]> {
    return redis.sMembers(key);
  }

  async removeFromSet(key: string, ...members: string[]): Promise<number> {
    return redis.sRem(key, members);
  }
}

export const cache = new CacheService();
