import { DynamicModule } from '@nestjs/common';
import { CacheService } from './cache.service';

import { CACHE_SERVICE, CACHEABLE_FUNC } from './cache.injection-keys';

export class CacheModule {
  static forRoot(options?: {
    isCacheableValue: (value: any) => boolean;
  }): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CACHEABLE_FUNC,
          useValue: options?.isCacheableValue || (() => true),
        },
        {
          provide: CACHE_SERVICE,
          useClass: CacheService,
        },
      ],
      exports: [CACHE_SERVICE],
      global: true,
    };
  }
}
