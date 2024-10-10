CREATE TABLE IF NOT EXISTS "bodyurl" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rss" (
	"id" serial PRIMARY KEY NOT NULL,
	"contentOwner" text,
	"title" text,
	"description" varchar(256),
	"url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
