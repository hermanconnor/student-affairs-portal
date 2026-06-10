import { pgTable, text, timestamp, boolean, unique } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';

export const registration = pgTable(
  'registration',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    eventId: text('event_id')
      .notNull()
      .references(() => event.id, { onDelete: 'cascade' }),
    checkedIn: boolean('checked_in').notNull().default(false),
    createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.userId, table.eventId)],
);

export type Registration = typeof registration.$inferSelect;
export type NewRegistration = typeof registration.$inferInsert;
