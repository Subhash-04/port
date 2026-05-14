import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const analyticsEventsTable = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  section: text("section"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
