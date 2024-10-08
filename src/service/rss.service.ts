import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { bodyurl } from '../drizzle/schema';
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
          timestamp: new Date(),
        })
        .execute();
    } catch (err) {
      console.log(err);
    }
  }

  async searchRSS(name: string) {
    try {
        const trim = name.trim()
        console.log(trim);
        
      const result = await this.db
        .select()
        .from(bodyurl)
        .where(sql`TRIM(${bodyurl.name}) ILIKE ${trim}`);
      return result;
    } catch (error) {
      throw new HttpException(
        'Dahili Sunucu Hatası',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addJSON(){
    try {
        const result = await this.db.insert()
        return result
    } catch (error) {
        throw new HttpException(
            "Dahili Sunucu Hatası",
            HttpStatus.INTERNAL_SERVER_ERROR
        )
    }
  }
}
