import { pgTable, serial, varchar, timestamp, text, date } from 'drizzle-orm/pg-core';

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
  id: serial('id').notNull().primaryKey(),
  title: varchar('title'),
  link: varchar('link'),
  pubDate: varchar('pubdate'),
  content: varchar('content'),
  guid: varchar('guid'),
  isoDate: varchar('isodate'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: "string"
  }).defaultNow().notNull(),
});