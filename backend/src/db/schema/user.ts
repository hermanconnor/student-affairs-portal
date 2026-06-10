import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['student', 'advisor', 'admin']);

// Users Table matching Better-Auth requirements
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  password: text('password'),
  role: roleEnum('role').notNull().default('student'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Session Table for Better-Auth tokens
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', {
    precision: 6,
    withTimezone: true,
  }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Required Account Table (For OAuth links / credentials separation)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', {
    precision: 6,
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
    precision: 6,
    withTimezone: true,
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Verification Table matching Better-Auth requirements
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', {
    precision: 6,
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Role = (typeof roleEnum.enumValues)[number];
