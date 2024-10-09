import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { bodyurl, feedtable } from '../drizzle/schema';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

@Injectable()
export class RssService {
  db: any;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DB_URI,
    });
    this.db = drizzle(pool);
  }

  async addRSS(name: string, url: string) {
    try {
      await this.db
        .insert(bodyurl)
        .values({
          name,
          url,
          timestamp: new Date().toISOString(),
        })
        .execute();
    } catch (err) {
      console.log(err);
    }
  }

  async searchRSS(name: string) {
    try {
      const trim = name.trim();
      const result = await this.db
        .select()
        .from(bodyurl)
        .where(sql`TRIM(${bodyurl.name}) ILIKE ${trim}`);
      return result;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addJSON(
    title: string,
    link: string,
    pubDate: Date,
    content: string,
    guid: string,
    isoDate: Date,
  ) {
    try {
      const result = await this.db
        .insert(feedtable)
        .values({
          title,
          link,
          pubDate,
          content,
          guid,
          isoDate,
        })
        .execute();
        console.log(result);
      return result;
    } catch (error) {
      throw new HttpException(
        'Dahili Sunucu Hatası',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
