import { Module } from '@nestjs/common';
import { RSSController } from 'src/controllers/rss.controller';


@Module({
    imports: [],
    controllers: [RSSController],
    providers: []
})

export class RSS {}