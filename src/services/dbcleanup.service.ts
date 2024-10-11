import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { feedtable } from '../drizzle/schema';

@Injectable()
export class DbCleanupService {
  constructor(@Inject('NodePgDatabase') private db: NodePgDatabase) {} 

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldData() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    try {
      const result = await this.db.execute(sql`
        DELETE FROM ${feedtable}
        WHERE ${feedtable.createdAt} < ${threeDaysAgo.toISOString()}
      `);

      console.log(`Eski kayıtlar silindi`, result.rowCount);
    } catch (error) {
      console.error('Eski kayıtları silerken bir hata oluştu:', error);
    }
  }
}

export { NodePgDatabase };
