import { pgTable, text } from "drizzle-orm/pg-core";

export const adminConfigTable = pgTable("admin_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
