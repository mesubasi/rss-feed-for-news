import { Module } from '@nestjs/common';
import { RSS } from './module/rss.module';
import { RssService } from './service/rss.service';
import * as dotenv from "dotenv"
dotenv.config()
@Module({
  imports: [RSS],
  controllers: [],
  providers: [RssService],
})
export class AppModule {}
