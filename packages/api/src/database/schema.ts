import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'employee',
  'client',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'cancelled',
  'expired',
]);

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
]);

export const serviceCategoryEnum = pgEnum('service_category', [
  'faciales',
  'dermapen',
  'masajes_corporales',
  'depilacion',
  'corporales',
]);

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 32 }),
  role: userRoleEnum().notNull().default('client'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const servicesTable = pgTable('services', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1024 }),
  category: serviceCategoryEnum().notNull(),
  durationMin: integer('duration_min').notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const plansTable = pgTable('plans', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1024 }),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  durationDays: integer('duration_days').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subscriptionsTable = pgTable('subscriptions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  planId: integer('plan_id')
    .notNull()
    .references(() => plansTable.id),
  status: subscriptionStatusEnum().notNull().default('active'),
  startDate: timestamp('start_date', { withTimezone: true })
    .notNull()
    .defaultNow(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const appointmentsTable = pgTable('appointments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  serviceId: integer('service_id')
    .notNull()
    .references(() => servicesTable.id),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  status: appointmentStatusEnum().notNull().default('pending'),
  notes: varchar({ length: 1024 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
