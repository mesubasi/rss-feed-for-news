import { Module } from '@nestjs/common';
import { ControllerController } from './controller/rss.controller';
import { Index } from './drizzle/index';
import { RSS } from './module/rss.module';
import * as dotenv from "dotenv"
dotenv.config()
@Module({
  imports: [Index, RSS],
  controllers: [ControllerController],
  providers: [],
})
export class AppModule {}
