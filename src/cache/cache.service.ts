import { Inject, Injectable } from '@nestjs/common';
import { CACHEABLE_FUNC } from './cache.injection-keys';

import NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  private localCache = new NodeCache();

  constructor(
    @Inject(CACHEABLE_FUNC)
    private readonly isCacheableValue: (value: any) => boolean,
  ) {}

  async get<T>(key: string): Promise<T> {
    try {
      return this.localCache.get<T>(key);
    } catch (e) {
      console.error(`CacheService.get(${key}): error`, e.message);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    options?: {
      ttl?: number | Promise<number> | (() => number) | (() => Promise<number>);
    },
  ): Promise<void> {
    if (!this.isCacheableValue(value)) return;

    const ttl = await (typeof options?.ttl === 'function'
      ? options.ttl()
      : options?.ttl);

    try {
      this.localCache.set(key, value, ttl);
    } catch (e) {
      console.error('CacheService.set: error', e.message);
      throw e;
    }
  }

  async del(key: string): Promise<void> {
    this.localCache.del(key);
  }

  async wrap<T>(
    key: string,
    func: Promise<T> | (() => T) | (() => Promise<T>),
    options?: {
      ttl?: number | Promise<number> | (() => number) | (() => Promise<number>);
    },
  ): Promise<T> {
    const val = await this.get<T>(key);

    if (val === undefined || val === null) {
      const result = await (typeof func === 'function' ? func() : func);
      await this.set(key, result, options);
      return result;
    }

    return val;
  }

  reset() {
    return this.localCache.flushAll();
  }
}
