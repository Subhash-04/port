import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const adminSessionsTable = pgTable("admin_sessions", {
  token: text("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
