import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { FeedToDatabase, RSSController } from 'src/controllers/rss.controller';
import { RssService } from 'src/services/rss.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [RSSController, FeedToDatabase],
  providers: [RssService],
  exports: [RssService], 
})
export class RSSModule {}