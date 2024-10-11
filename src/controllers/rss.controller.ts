import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Res,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as Parser from 'rss-parser';
import { RssService } from 'src/services/rss.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface RSSItem {
  title: string;
  link: string;
  pubDate: Date;
  content: string;
  guid: string;
  isoDate: string;
  url: string;
  media: string;
  parsedDomain: string;
}

@Injectable()
@Controller('feed')
export class RSSController {
  constructor(
    private readonly rssService: RssService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  parser: Parser = new Parser({
    customFields: {
      item: [['media:content', 'media:content', { keepArray: true }]],
    },
  });

  private parseDomain(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const hostParts = parsedUrl.hostname.split('.');

      if (hostParts.length >= 2) {
        const domainIndex = hostParts[0] === 'www' ? 1 : 0;
        const result = hostParts[domainIndex];
        return result;
      }
      return hostParts[0];
    } catch (error) {
      console.error('Error parsing URL:', error);
      return '';
    }
  }

  @Get()
  async rssFeed(@Query('name') name: string, @Res() res: Response) {
    const cacheKey = `feed:${name}`;
    try {
      let cachedResult = await this.cacheManager.get<RSSItem[]>(cacheKey);

      if (!cachedResult) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const allItems = await this.rssService.getLatestItems(oneDayAgo);

        cachedResult = allItems.filter(
          (item) =>
            item.parsedDomain &&
            item.parsedDomain.toLowerCase().includes(name.toLowerCase()),
        );

        const result = cachedResult.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          url: item.url,
          content: item.content,
          guid: item.guid,
          isoDate: item.isoDate,
          media: item.media,
        }));

        await this.cacheManager.set(cacheKey, result, 300000);

        return res.status(200).json(result);
      }

      return res.status(200).json(cachedResult);
    } catch (err) {
      console.error('RSS de bir problem oluştu:', err);
      throw new HttpException(
        'RSS de bir problem oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkAndUpdateRSSFeeds() {
    console.log('RSS kontrolü başlatılıyor...');
    const allRSSNames = await this.rssService.getAllRSSNames();
    for (const name of allRSSNames) {
      await this.fetchAndCacheRSSFeed(name);
    }
    console.log('RSS kontrolü tamamlandı.');
  }

  private async fetchAndCacheRSSFeed(name: string): Promise<RSSItem[]> {
    const url = await this.rssService.searchRSS(name);
    const feed = await this.parser.parseURL(url[0].url);

    const feedItems = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate),
      content: item.content,
      guid: item.guid,
      isoDate: item.isoDate,
      url: item.url,
      media: item['media:content']
        ? item['media:content'][0].$.url
        : 'Medya yok',
      parsedDomain: this.parseDomain(item.link),
    }));

    const cacheKey = `feed:${name}`;
    await this.cacheManager.set(cacheKey, feedItems, 300000);
    await this.saveToDB(feedItems, name);
    return feedItems;
  }

  private async saveToDB(feedItems: RSSItem[], name: string) {
    try {
      for (const item of feedItems) {
        await this.rssService.addJSON(
          item.title,
          item.link,
          item.pubDate,
          item.content,
          item.guid,
          item.isoDate,
          item.url,
          item.media,
          item.parsedDomain,
        );
      }
    } catch (error) {
      console.error(
        `RSS feed '${name}' veritabanına kaydedilirken hata oluştu:`,
        error,
      );
    }
  }
}

@Injectable()
@Controller('feedtodb')
export class FeedToDatabase {
  constructor(
    private readonly rssService: RssService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async feedtoDB(
    @Body() body: { name: string; url: string },
    @Res() res: Response,
  ) {
    try {
      await this.rssService.addRSS(body.name, body.url);
      await this.cacheManager.del(`feed:${body.name}`);
      return res
        .status(200)
        .json({ message: "Kaynaklar Başarıyla DB'ye Kaydedildi!" });
    } catch (err) {
      throw new HttpException(
        "DB'ye veri gönderilirken hata oluştu",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
