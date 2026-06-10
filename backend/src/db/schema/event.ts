import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user';

export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'published',
  'cancelled',
]);

export const event = pgTable('event', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  date: timestamp('date', { precision: 6, withTimezone: true }).notNull(),
  createdBy: text('created_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: eventStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Event = typeof event.$inferSelect;
export type NewEvent = typeof event.$inferInsert;
