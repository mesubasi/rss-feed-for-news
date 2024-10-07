import { Module } from '@nestjs/common';
import { ControllerController } from './controller/rss.controller';
@Module({
  imports: [],
  controllers: [ControllerController],
  providers: [],
})
export class AppModule {}
