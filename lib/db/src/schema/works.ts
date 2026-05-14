import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const worksTable = pgTable("works", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  siteUrl: text("site_url").notNull().default(""),
  category: text("category").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Work = typeof worksTable.$inferSelect;
export type InsertWork = typeof worksTable.$inferInsert;
