import { pgTable, text } from "drizzle-orm/pg-core";

export const sectionContentTable = pgTable("section_content", {
  section: text("section").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull().default(""),
});
