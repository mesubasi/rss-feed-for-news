import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RSSController } from './controllers/rss.controller';
import { RssService} from './services/rss.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DrizzleModule } from './drizzle/drizzle.module';
import { DbCleanupService } from './services/dbcleanup.service';
import { RSSModule } from './module/rss.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT'), 10),
        ttl: parseInt(configService.get('CACHE_TTL'), 10),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    DrizzleModule,
    RSSModule,
  ],
  controllers: [RSSController],
  providers: [RssService, DbCleanupService],
})
export class AppModule {}