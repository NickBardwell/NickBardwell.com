import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const requests = sqliteTable('requests', {
 id:text('id').primaryKey(), activeKey:text('active_key').unique(), userId:text('user_id').notNull(), userEmail:text('user_email').notNull(),
 type:text('type').notNull(), clubId:text('club_id'), clubName:text('club_name').notNull(),
 name:text('name').notNull(), studentEmail:text('student_email').notNull(),
 message:text('message').notNull(), category:text('category'), advisor:text('advisor'),
 status:text('status').notNull().default('submitted'), reviewerNote:text('reviewer_note').notNull().default(''),
 createdAt:text('created_at').notNull(), updatedAt:text('updated_at').notNull(),
});
export const events = sqliteTable('request_events', {
 id:text('id').primaryKey(), requestId:text('request_id').notNull().references(()=>requests.id),
 actorId:text('actor_id').notNull(), status:text('status').notNull(), note:text('note').notNull(), createdAt:text('created_at').notNull(),
});
export const memberships = sqliteTable('memberships', {
 id:text('id').primaryKey(), clubId:text('club_id').notNull(), userId:text('user_id').notNull(), createdAt:text('created_at').notNull(),
},t=>[uniqueIndex('membership_club_user').on(t.clubId,t.userId)]);
export const clubSettings = sqliteTable('club_settings', {
 clubId:text('club_id').primaryKey(), members:integer('members'), joinMethod:text('join_method').notNull(),
 joinUrl:text('join_url'), verifiedAt:text('verified_at').notNull(), updatedBy:text('updated_by').notNull(),
});
