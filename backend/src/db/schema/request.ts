import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user.js';

export const requestTypeEnum = pgEnum('request_type', [
  'event',
  'funding',
  'room_reservation',
]);

export const approvalStatusEnum = pgEnum('approval_status', [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'revision_requested',
]);

export const request = pgTable('request', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: requestTypeEnum('type').notNull(),
  submittedBy: text('submitted_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  advisorStatus: approvalStatusEnum('advisor_status')
    .notNull()
    .default('pending'),
  adminStatus: approvalStatusEnum('admin_status').notNull().default('pending'),
  createdAt: timestamp('created_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Request = typeof request.$inferSelect;
export type NewRequest = typeof request.$inferInsert;
