import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const businesses = pgTable("businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // Restaurant, Supermarché, etc.
  description: text("description"),
  address: text("address"),
  photoUrl: text("photo_url"),
  collectionInstructions: text("collection_instructions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").references(() => businesses.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Boulangerie, Plats, Légumes, etc.
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  expiryDate: timestamp("expiry_date"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").references(() => businesses.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  maxPerPerson: integer("max_per_person").notNull().default(1),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, paused, completed
  availableFrom: timestamp("available_from").notNull(),
  availableTo: timestamp("available_to").notNull(),
  collectionSlots: jsonb("collection_slots").$type<string[]>().notNull().default([]),
  taxBenefitValue: decimal("tax_benefit_value", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").references(() => businesses.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  isOpen: boolean("is_open").notNull().default(true),
  timeSlots: jsonb("time_slots").$type<{startTime: string, endTime: string, label: string}[]>().notNull().default([]),
  businessType: text("business_type").notNull(), // alimentaire, culture, bien-être
});

export const closures = pgTable("closures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").references(() => businesses.id).notNull(),
  date: timestamp("date").notNull(),
  reason: text("reason"),
  isEmergency: boolean("is_emergency").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
});

export const insertClosureSchema = createInsertSchema(closures).omit({
  id: true,
  createdAt: true,
});

// Types
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Closure = typeof closures.$inferSelect;
export type InsertClosure = z.infer<typeof insertClosureSchema>;
