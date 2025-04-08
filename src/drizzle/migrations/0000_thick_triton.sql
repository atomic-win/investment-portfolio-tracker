CREATE TABLE `user_ids` (
	`id` text NOT NULL,
	`identity_provider` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT '2025-04-09T00:11:28.276+05:30' NOT NULL,
	PRIMARY KEY(`id`, `identity_provider`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`currency` text DEFAULT 'USD',
	`language` text DEFAULT 'en',
	`created_at` text DEFAULT '2025-04-09T00:11:28.276+05:30' NOT NULL,
	`updated_at` text DEFAULT '2025-04-09T00:11:28.291+05:30' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
