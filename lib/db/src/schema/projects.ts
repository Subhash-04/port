import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  siteUrl: text("site_url").notNull().default(""),
  category: text("category").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
