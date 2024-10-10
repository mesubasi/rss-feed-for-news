import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as Parser from 'rss-parser';
import { RssService } from 'src/service/rss.service';
@Injectable()
@Controller('feedtodb')
export class FeedToDatabase {
  constructor(private readonly rssService: RssService) {}
  @Post()
  async feedtoDB(@Body() body: { name: string; url: string },  @Res() res: Response,) {
    try {
      await this.rssService.addRSS(body.name, body.url);
      return res.status(200).json({message: "Kaynaklar Başarıyla DB'ye Kaydedildi!"})
    } catch (err) {
      throw new Error("DB'ye veri gönderilirken hata oluştu");
    }
  }
}

@Controller('feed')
export class RSSController {
  constructor(private readonly rssService: RssService) {}
  parser: Parser = new Parser();
  @Get()
  async rssFeed(
    @Query('dynamicname') dynamicname: string,
    @Res() res: Response,
  ) {
    try {
      const url = await this.rssService.searchRSS(dynamicname);
      const feed = await this.parser.parseURL(url[0].url);

      const feedToDB = await Promise.all(
        feed.items.map(async (item) => {
          await this.rssService.addJSON(
            item.title,
            item.link,
            item.pubDate,
            item.guid,
            item.isoDate,
            item.content,
            item.url,
            new Date()
          );    
          return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            guid: item.guid,
            isoDate: item.isoDate,
            content: item.content,
            url: item.url,
          };
        })
      );
      return res.status(200).json(feedToDB)
    } catch (err) {
      throw new Error('RSS de bir problem oluştu');
    }
  }
}
