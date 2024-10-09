import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const message = pgTable('message', {
  id: serial('id').primaryKey().notNull(),
  username: varchar('username').notNull(),
  content: varchar('content').notNull(),
  usercontent: varchar('usercontent').notNull(),
  timestamp: timestamp('timestamp', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
});

export const bodyurl = pgTable('bodyurl', {
  id: serial('id').notNull().primaryKey(),
  name: varchar('name').notNull(),
  url: varchar('url').notNull().unique(),
  timestamp: timestamp('timestamp', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
});


export const feedtable = pgTable('feedtable', {
  id: serial('id').notNull().primaryKey().unique(),
  title: varchar('title'),
  url: varchar('url').unique(),
  content: varchar("content"),
  timestamp: timestamp('timestamp', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
});