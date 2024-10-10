import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { bodyurl, feedtable } from '../drizzle/schema';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

@Injectable()
export class RssService {
  private db: any;

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

  async searchRSS(name: string) {
    try {
      const trim = name.trim().replace(/\s+/g, '')
      const result = await this.db
        .select()
        .from(bodyurl)
        .where(sql`REPLACE(TRIM(${bodyurl.name}), ' ', '') ILIKE ${trim}`);
      return result;
    } catch (error) {
      console.error('Error searching RSS:', error);
      throw new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addJSON(
    title: string,
    link: string,
    pubDate: string,
    content: string,
    guid: string,
    isoDate: string,
    url: string,
    created_at: Date = new Date(),
  ) {
    try {

      const existingItem = await this.db.select().from(feedtable).where(sql`${feedtable.title} = ${title} AND ${feedtable.pubDate} = ${pubDate}`)

      if (existingItem.length > 0) {        
        return
      }

      await this.db
        .insert(feedtable)
        .values({
          title,
          link,
          pubDate,
          url,
          content,
          guid,
          isoDate,
          createdAt: created_at,
        })
        .execute();
        
    
    } catch (error) {
      console.error('Error adding JSON:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
