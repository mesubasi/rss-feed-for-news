import { drizzle } from 'drizzle-orm/node-postgres';
import { OnModuleInit } from '@nestjs/common';
import { db } from './db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { resolve } from 'path';
import { Pool } from 'pg';
export class Index implements OnModuleInit {
  private pool: Pool;
  db: any;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DB_URI,
    });

    this.db = drizzle(this.pool);
  }

  async onModuleInit() {
    try {
      await this.pool.connect();
      await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
      console.log('Migrations have been applied successfully.');
    } catch (error) {
      console.log(error);
      throw new Error('Modül Başlatılamadı!');
    }
  }
}
