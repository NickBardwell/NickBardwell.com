CREATE TABLE `club_settings` (
	`club_id` text PRIMARY KEY NOT NULL,
	`members` integer,
	`join_method` text NOT NULL,
	`join_url` text,
	`verified_at` text NOT NULL,
	`updated_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `request_events` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`actor_id` text NOT NULL,
	`status` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`club_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `membership_club_user` ON `memberships` (`club_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`active_key` text,
	`user_id` text NOT NULL,
	`user_email` text NOT NULL,
	`type` text NOT NULL,
	`club_id` text,
	`club_name` text NOT NULL,
	`name` text NOT NULL,
	`student_email` text NOT NULL,
	`message` text NOT NULL,
	`category` text,
	`advisor` text,
	`status` text DEFAULT 'submitted' NOT NULL,
	`reviewer_note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `requests_active_key_unique` ON `requests` (`active_key`);