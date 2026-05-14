import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  quote: text("quote").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

export type Testimonial = typeof testimonialsTable.$inferSelect;
export type InsertTestimonial = typeof testimonialsTable.$inferInsert;
