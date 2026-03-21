CREATE TABLE `app_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(128) NOT NULL,
	`value` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `app_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `financial_impact_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`category` enum('subscription_cancelled','nsf_avoided','barter_value','neighbor_economy','wisdom_giants','expense_reduced','tp_delivery','other') NOT NULL,
	`description` text NOT NULL,
	`estimatedValue` int NOT NULL,
	`isEstimated` boolean NOT NULL DEFAULT true,
	`source` varchar(64) DEFAULT 'grace',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financial_impact_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_ambient_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`messageType` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_ambient_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`profileId` int,
	`role` varchar(16) NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_memory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`category` varchar(64) NOT NULL,
	`fact` text NOT NULL,
	`confidence` varchar(16) DEFAULT 'medium',
	`source` varchar(64) DEFAULT 'conversation',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_memory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_person_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`province` varchar(64),
	`city` varchar(128),
	`email` varchar(320),
	`phone` varchar(32),
	`address` text,
	`postalCode` varchar(16),
	`kidsCount` int,
	`kidsNames` text,
	`financialSituation` text,
	`biggestChallenge` text,
	`interests` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grace_person_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journey_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`day` int NOT NULL,
	`milestoneName` varchar(256) NOT NULL,
	`description` text,
	`completed` boolean DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journey_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`title` varchar(256),
	`lyrics` text,
	`genre` varchar(64),
	`mood` varchar(64),
	`personalDetails` text,
	`generationPrompt` text,
	`status` enum('generating','ready','failed') NOT NULL DEFAULT 'generating',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`monthlyCost` int NOT NULL,
	`annualCost` int,
	`category` varchar(64),
	`isVampire` boolean DEFAULT false,
	`vampireReason` text,
	`status` enum('active','cancelled','pending_cancel') NOT NULL DEFAULT 'active',
	`cancelledAt` timestamp,
	`savingsLogged` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trojan_horse_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`currentStep` int NOT NULL DEFAULT 1,
	`status` enum('in_progress','completed','abandoned') NOT NULL DEFAULT 'in_progress',
	`tpDeliveryConfirmed` boolean DEFAULT false,
	`recurringSetup` boolean DEFAULT false,
	`recurringIntervalWeeks` int DEFAULT 2,
	`songGenerated` boolean DEFAULT false,
	`songId` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trojan_horse_entries_id` PRIMARY KEY(`id`)
);
