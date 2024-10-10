import { Module } from '@nestjs/common';
import { RSS } from './module/rss.module';
import { RssService } from './service/rss.service';
import { RedisService } from './service/redis.service';
import * as dotenv from "dotenv"
import { CacheModule } from '@nestjs/cache-manager';
dotenv.config()
@Module({
  imports: [RSS],
  controllers: [],
  providers: [RssService, RedisService],
})
export class AppModule {}
