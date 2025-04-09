CREATE TABLE `user_ids` (
	`id` text NOT NULL,
	`identity_provider` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	PRIMARY KEY(`id`, `identity_provider`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT '019619cb-9056-7159-bf6d-cb1596c0f7c9' NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`user_id` text PRIMARY KEY NOT NULL,
	`currency` text DEFAULT 'USD',
	`language` text DEFAULT 'en',
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `asset_ids` (
	`type` text NOT NULL,
	`external_id` text NOT NULL,
	`asset_id` text NOT NULL,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL,
	PRIMARY KEY(`type`, `external_id`),
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `asset_type_idx` ON `asset_ids` (`type`);--> statement-breakpoint
CREATE INDEX `asset_external_id_idx` ON `asset_ids` (`external_id`);--> statement-breakpoint
CREATE TABLE `assets` (
	`id` text PRIMARY KEY DEFAULT '019619cb-9056-7159-bf6d-cb1596c0f7c9' NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`currency` text NOT NULL,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL,
	`refreshed_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `asset_rates` (
	`id` text NOT NULL,
	`date` text NOT NULL,
	`rate` real NOT NULL,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `asset_items` (
	`id` text PRIMARY KEY DEFAULT '019619cb-9056-7159-bf6d-cb1596c0f7c9' NOT NULL,
	`name` text NOT NULL,
	`currency` text NOT NULL,
	`user_id` text NOT NULL,
	`asset_id` text,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY DEFAULT '019619cb-9056-7159-bf6d-cb1596c0f7c9' NOT NULL,
	`date` text NOT NULL,
	`name` text NOT NULL,
	`asset_item_id` text,
	`type` text NOT NULL,
	`units` real NOT NULL,
	`created_at` text DEFAULT '2025-04-09T14:34:53.334+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T14:34:53.349+05:30' NOT NULL,
	FOREIGN KEY (`asset_item_id`) REFERENCES `asset_items`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "units_positive_check" CHECK("transactions"."units" > 0)
);
--> statement-breakpoint
CREATE INDEX `transaction_date_idx` ON `transactions` (`date`);--> statement-breakpoint
CREATE INDEX `asset_item_id_idx` ON `transactions` (`asset_item_id`);