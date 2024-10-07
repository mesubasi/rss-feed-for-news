import { Module } from '@nestjs/common';
import { Index } from './drizzle/index';
import { RSS } from './module/rss.module';
import { RssService } from './service/rss.service';
import * as dotenv from "dotenv"
dotenv.config()
@Module({
  imports: [Index, RSS],
  controllers: [],
  providers: [RssService],
})
export class AppModule {}
