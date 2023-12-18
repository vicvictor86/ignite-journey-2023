import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { CacheRepository } from './cacheRepository';
import { RedisCacheRepository } from './redis/redisCacheRepository';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [EnvModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [
    CacheRepository,
  ],
})
export class CacheModule {}
