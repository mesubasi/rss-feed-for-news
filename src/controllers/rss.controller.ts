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
import { AppService } from 'src/app.service';
import { RssService } from 'src/service/rss.service';
import * as crypto from "crypto"
@Injectable()
@Controller('feedtodb')
export class FeedToDatabase {
  constructor(
    private readonly rssService: RssService,
    private readonly appService: AppService,
  ) {}
  @Post()
  async feedtoDB(
    @Body() body: { name: string; url: string },
    @Res() res: Response,
  ) {
    try {
      await this.rssService.addRSS(body.name, body.url);
      return res
        .status(200)
        .json({ message: "Kaynaklar Başarıyla DB'ye Kaydedildi!" });
    } catch (err) {
      throw new Error("DB'ye veri gönderilirken hata oluştu");
    }
  }
}

@Controller('feed')
export class RSSController {
  constructor(
    private readonly rssService: RssService,
    private readonly appService: AppService,
  ) {}
  parser: Parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'media:content', {keepArray: true}],
      ]
    }
  });
  @Get()
  async rssFeed(@Query('name') name: string, @Res() res: Response) {
    try {
      const url = await this.rssService.searchRSS(name);
      const feed = await this.parser.parseURL(url[0].url);

      const feedToDB = await Promise.all(
        feed.items.map(async (item) => {
          await this.rssService.addJSON(
            item.title,
            item.link,
            item.pubDate,
            item.content,
            item.guid,
            item.isoDate,
            item.url,
          );
          return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            content: item.content,
            guid: item.guid,
            isoDate: item.isoDate,
            url: item.url,
          };
        }),
      );
      return res.status(200).json(feedToDB);
    } catch (err) {
      throw new Error('RSS de bir problem oluştu');
    }
  }
}
