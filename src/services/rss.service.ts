import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  Res,
} from '@nestjs/common';
import { bodyurl, feedtable} from '../drizzle/schema';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RSSItem } from 'src/controllers/rss.controller';

@Injectable()
export class RssService {
  private db: any;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    const pool = new Pool({
      connectionString: process.env.DB_URI,
    });
    this.db = drizzle(pool);
  }


  private parseDomain(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const parseUrl = parsedUrl.hostname.split('.');
      if (parseUrl.length >= 2) {
        return parseUrl[0] === 'www' ? parseUrl[1] : parseUrl[0];
      }
      return parseUrl[0]; 
    } catch (error) {
      console.error('URL Parse işleminde hata oluştu:', error);
      return '';
    }
  }

  async addRSS(name: string, url: string) {
    const cacheKey = `rss:${url}`;
    try {
      const existingItem = await this.db
        .select()
        .from(bodyurl)
        .where(sql`${bodyurl.url} = ${url}`);

      if (existingItem.length > 0) {
        await this.cacheManager.set(cacheKey, existingItem[0], 3600000);
      }
      await this.db
        .insert(bodyurl)
        .values({
          name,
          url,
          timestamp: new Date(),
        })
        .execute();
    } catch (err) {
      console.error('Error adding RSS:', err);
      throw new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllRSSNames(): Promise<string[]> {
    try {
      const result = await this.db.select({ name: bodyurl.name }).from(bodyurl);
      return result.map((item: { name: string }) => item.name);
    } catch (error) {
      console.error('RSS isimlerini alırken hata oluştu:', error);
      throw error;
    }
  }

  async searchRSS(name: string) {
    const cacheKey = `rss:${name}`;
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) return cachedResult;

    try {
      const trim = name.trim().replace(/\s+/g, '');

      const result = await this.db
        .select()
        .from(bodyurl)
        .where(sql`REPLACE(TRIM(${bodyurl.name}), ' ', '') ILIKE ${trim}`);

      await this.cacheManager.set(cacheKey, result, 3600000);
      return result;
    } catch (error) {
      console.error('RSS aramasında problem var:', error);
      throw new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addJSON(
    title: string,
    link: string,
    pubDate: Date = new Date(),
    content: string,
    guid: string,
    isoDate: string,
    url: string,
    media: string,
    parsedDomain: string,
    created_at: Date = new Date(),
  ) {
    const cacheKey = `feed:${guid}`;

    try {
      const cachedItem = await this.cacheManager.get(cacheKey);

      if (cachedItem) {
        return;
      }

      const existingItem = await this.db
        .select()
        .from(feedtable)
        .where(sql`${feedtable.link} = ${link}`);

      if (existingItem.length > 0) {
        await this.cacheManager.set(cacheKey, existingItem[0], 3600000);
        return;
      }

      const newItems = {
        title,
        link,
        pubDate,
        url,
        content,
        guid,
        isoDate,
        media,
        parsedDomain,
        createdAt: created_at,
      };
      

      await this.db.insert(feedtable).values(newItems).execute();
      await this.cacheManager.set(cacheKey, newItems, 3600000);
    } catch (error) {
      console.error('JSON Eklemede Sorun Var!:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getLatestItems(fromDate: Date): Promise<RSSItem[]> {
    try {
      const result = await this.db
        .select()
        .from(feedtable)
        .where(sql`${feedtable.pubDate} >= ${fromDate}`)
        .orderBy(sql`${feedtable.pubDate} DESC`);

      return result;
    } catch (error) {
      console.error('Son itemi çekmede problem var:', error);
      throw new HttpException(
        'Son RSS öğeleri alınırken bir hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
