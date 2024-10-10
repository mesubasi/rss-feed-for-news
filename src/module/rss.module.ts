import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { FeedToDatabase, RSSController } from 'src/controllers/rss.controller';
import { RssService } from 'src/service/rss.service';


@Module({
    imports: [],
    controllers: [RSSController, FeedToDatabase],
    providers: [RssService, AppService]
})

export class RSS {}