import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

export const client = new Client({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: String(process.env.DB_PASSWORD!),
  database: process.env.DB_NAME!,
});


export const db = drizzle(client, { schema });