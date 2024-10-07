import { Module } from '@nestjs/common';
import { ControllerController } from './controller/rss.controller';
import { Index } from './drizzle/index';
import * as dotenv from "dotenv"
dotenv.config()
@Module({
  imports: [Index],
  controllers: [ControllerController],
  providers: [],
})
export class AppModule {}
