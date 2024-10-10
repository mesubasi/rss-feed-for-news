import { Module } from '@nestjs/common';
import { RSS } from './module/rss.module';
import { RssService } from './service/rss.service';
import { RedisService } from './service/redis.service';
import * as dotenv from "dotenv"
import { CacheModule } from '@nestjs/cache-manager';
import { AppService } from './app.service';
dotenv.config()
@Module({
  imports: [CacheModule.register({
    isGlobal : true,
    ttl: 60,
    max: 1000
  }), RSS],
  controllers: [],
  providers: [RssService, RedisService, AppService],
})
export class AppModule {}
