import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as Parser from 'rss-parser';

@Controller('feed')
export class RSSController {
    parser: Parser = new Parser()

    @Get()
    async rssFeed(@Res() res : Response){
        try {
            const feed = await this.parser.parseURL("https://www.cnnturk.com/feed/rss/all/news")
            return res.json(feed)
            
        } catch (error) {
            console.log(error);
            throw new Error("RSS de bir problem oluştu");
        }
    }
}

