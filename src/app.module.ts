import { Module } from '@nestjs/common';
import { Index } from './drizzle/index';
import { RSS } from './module/rss.module';
import * as dotenv from "dotenv"
dotenv.config()
@Module({
  imports: [Index, RSS],
  controllers: [],
  providers: [],
})
export class AppModule {}
