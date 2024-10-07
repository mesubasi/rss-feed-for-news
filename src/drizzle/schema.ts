import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const rss = pgTable('rss', {
  id: serial('id').primaryKey(),
  contentOwner: text("contentOwner"),
  title: text('title'),
  description: varchar('description', { length: 256 }),
  url: text("url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow() 
});

export const bodyUrl = pgTable("bodyurl", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull()
})