import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const adminOtpsTable = pgTable("admin_otps", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  used: boolean("used").notNull().default(false),
});
