import { Module } from '@nestjs/common';
import Parser from 'rss-parser';
import { RSSController } from 'src/controller/rss.controller';


@Module({
    imports: [Parser],
    controllers: [RSSController],
    providers: []
})

export class RSS {}
