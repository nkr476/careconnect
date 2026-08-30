import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  preferredLanguage: varchar("preferred_language").default("en"),
  location: varchar("location"),
  emergencyContactName: varchar("emergency_contact_name"),
  emergencyContactPhone: varchar("emergency_contact_phone"),
  healthId: varchar("health_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare providers
export const providers = pgTable("providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  specialty: varchar("specialty").notNull(),
  clinic: varchar("clinic").notNull(),
  location: varchar("location").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  imageUrl: varchar("image_url"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  acceptsUninsured: boolean("accepts_uninsured").default(false),
  slidingScale: boolean("sliding_scale").default(false),
  cashPayments: boolean("cash_payments").default(false),
  languages: text("languages").array().default(sql`ARRAY['English']`),
  minPrice: decimal("min_price", { precision: 10, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }),
  distance: decimal("distance", { precision: 5, scale: 2 }),
  nextAvailable: timestamp("next_available"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  providerId: varchar("provider_id").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").default(30), // minutes
  type: varchar("type").default("in-person"), // in-person, telehealth
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled
  notes: text("notes"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health records
export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  providerId: varchar("provider_id"),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // exam, prescription, lab, imaging, etc.
  description: text("description"),
  summary: text("summary"),
  tags: text("tags").array().default(sql`ARRAY[]::text[]`),
  fileUrl: varchar("file_url"),
  recordDate: timestamp("record_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat conversations
export const chatConversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: varchar("title"),
  language: varchar("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  role: varchar("role").notNull(), // user, assistant
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Identity Passport
export const healthPassports = pgTable("health_passports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  medicalHistory: jsonb("medical_history"),
  allergies: text("allergies").array().default(sql`ARRAY[]::text[]`),
  medications: text("medications").array().default(sql`ARRAY[]::text[]`),
  immunizations: jsonb("immunizations"),
  conditions: text("conditions").array().default(sql`ARRAY[]::text[]`),
  emergencyContacts: jsonb("emergency_contacts"),
  insuranceInfo: jsonb("insurance_info"),
  bloodType: varchar("blood_type"),
  doctorNotes: text("doctor_notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Health Map Locations
export const communityLocations = pgTable("community_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // free_clinic, vaccination_drive, dental_van, health_fair
  address: text("address").notNull(),
  coordinates: jsonb("coordinates"), // {lat, lng}
  description: text("description"),
  schedule: jsonb("schedule"),
  contactInfo: jsonb("contact_info"),
  languages: text("languages").array().default(sql`ARRAY['English']`),
  services: text("services").array().default(sql`ARRAY[]::text[]`),
  requirements: text("requirements"),
  cost: varchar("cost"),
  verified: boolean("verified").default(false),
  verifiedBy: varchar("verified_by"),
  submittedBy: varchar("submitted_by"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Preventive Care Reminders
export const careReminders = pgTable("care_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: varchar("type").notNull(), // screening, vaccination, follow_up, medication
  title: varchar("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  priority: varchar("priority").default('medium'), // low, medium, high
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  language: varchar("language").default('en'),
  customMessage: text("custom_message"),
  ageGroup: varchar("age_group"), // child, adult, senior
  gender: varchar("gender"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cultural Provider Matching
export const culturalMatches = pgTable("cultural_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull(),
  culture: varchar("culture").notNull(),
  languages: text("languages").array().default(sql`ARRAY[]::text[]`),
  culturalNotes: text("cultural_notes"),
  religiousAccommodations: boolean("religious_accommodations").default(false),
  genderPreferences: varchar("gender_preferences"),
  communicationStyle: varchar("communication_style"),
  trustFactors: text("trust_factors").array().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
});

// Offline Data Cache
export const offlineCache = pgTable("offline_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  dataType: varchar("data_type").notNull(), // providers, health_records, reminders, etc.
  data: jsonb("data").notNull(),
  lastSync: timestamp("last_sync").defaultNow(),
  priority: integer("priority").default(1), // 1 = high, 5 = low
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({
  id: true,
  createdAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertHealthPassportSchema = createInsertSchema(healthPassports).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertCommunityLocationSchema = createInsertSchema(communityLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCareReminderSchema = createInsertSchema(careReminders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCulturalMatchSchema = createInsertSchema(culturalMatches).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type HealthPassport = typeof healthPassports.$inferSelect;
export type InsertHealthPassport = z.infer<typeof insertHealthPassportSchema>;
export type CommunityLocation = typeof communityLocations.$inferSelect;
export type InsertCommunityLocation = z.infer<typeof insertCommunityLocationSchema>;
export type CareReminder = typeof careReminders.$inferSelect;
export type InsertCareReminder = z.infer<typeof insertCareReminderSchema>;
export type CulturalMatch = typeof culturalMatches.$inferSelect;
export type InsertCulturalMatch = z.infer<typeof insertCulturalMatchSchema>;
