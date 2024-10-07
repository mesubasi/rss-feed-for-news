import { Body, Controller, Get, OnModuleInit, Post, Res } from '@nestjs/common';
import { response, Response } from 'express';
import * as Parser from 'rss-parser';

@Controller('feedtodb')
export class FeedToDatabase{

    @Post()
    async feedtoDB(@Body() body: {name: string, url: string}, @Res() res: Response){
        try {
            response.status(201).json("Veritabanına Başarıyla Kaydedildi!")
        } catch (err) {
          console.log(err);
          throw new Error("DB'ye veri gönderilirken hata oluştu")
        }
    }
}

@Controller('feed')
export class RSSController {
    parser: Parser = new Parser()

    @Get()
    async rssFeed(@Res() res : Response){
        try {
            const feed = await this.parser.parseURL("https://www.cnnturk.com/feed/rss/all/news")
            return res.json(feed)
        } catch (err) {
            console.log(err);
            throw new Error("RSS de bir problem oluştu");
        }
    }
}

