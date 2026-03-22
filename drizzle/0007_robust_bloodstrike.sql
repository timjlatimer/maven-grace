CREATE TABLE `conversation_summaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`summary` text NOT NULL,
	`messageCount` int DEFAULT 0,
	`lastConversationAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversation_summaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` varchar(256) NOT NULL,
	`auth` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_subscriptions_id` PRIMARY KEY(`id`)
);
