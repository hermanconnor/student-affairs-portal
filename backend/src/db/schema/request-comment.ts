import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user.js';
import { request } from './request.js';

export const requestComment = pgTable('request_comment', {
  id: text('id').primaryKey(),
  requestId: text('request_id')
    .notNull()
    .references(() => request.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type RequestComment = typeof requestComment.$inferSelect;
export type NewRequestComment = typeof requestComment.$inferInsert;
