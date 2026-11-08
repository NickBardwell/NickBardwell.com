CREATE TABLE `club_organizers` (
	`id` text PRIMARY KEY NOT NULL,
	`club_id` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`added_by` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizer_club_email` ON `club_organizers` (`club_id`,`email`);--> statement-breakpoint
ALTER TABLE `memberships` ADD `status` text DEFAULT 'active' NOT NULL;