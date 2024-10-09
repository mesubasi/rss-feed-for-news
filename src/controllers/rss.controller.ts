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
  async feedtoDB(@Body() body: { name: string; url: string }) {
    try {
      await this.rssService.addRSS(body.name, body.url);
      return { message: 'Veritabanına Başarıyla Kaydedildi!' };
    } catch (err) {
      console.log(err);
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
      
      if (feed) {
        try {
          const mappingFeedJSON = feed.items.map(
            (item: {
              title: string;
              link: string;
              pubDate: string;
              content: string;
              guid: string;
              isoDate: any;
            }) => {
              return {
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.content,
                guid: item.guid,
                isoDate: item.isoDate,
              };
            },
          );
          const JsonToDB = res.json(mappingFeedJSON);
          for (const json of mappingFeedJSON) {
            await this.rssService.addJSON(json.title, json.link, new Date(json.pubDate), json.content, json.guid, new Date(json.isoDate));
          }
  
          return res.json({ message: 'Veritabanına Başarıyla Kaydedildi!' });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error('RSS de bir problem oluştu');
    }
  }
}
