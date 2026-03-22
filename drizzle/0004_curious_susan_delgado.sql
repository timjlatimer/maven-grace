CREATE TABLE `community_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`totalEarned` int NOT NULL DEFAULT 0,
	`totalRedeemed` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_credits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_credits_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`type` varchar(32) NOT NULL,
	`amount` int NOT NULL,
	`category` varchar(64) NOT NULL,
	`description` text,
	`validatedBy` varchar(64) NOT NULL DEFAULT 'big_mama',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_credits_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crisis_beacons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`agentsActivated` text,
	`communityAlertSent` boolean NOT NULL DEFAULT false,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crisis_beacons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destiny_moonshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`revealed` boolean NOT NULL DEFAULT false,
	`revealedAt` timestamp,
	`moonshotStatement` text,
	`coreValues` text,
	`strengths` text,
	`destinyAnthem` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `destiny_moonshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`batteryLevel` int NOT NULL DEFAULT 100,
	`tier` varchar(32) NOT NULL DEFAULT 'full',
	`speedStage` varchar(32) NOT NULL DEFAULT 'normal',
	`daysPastDue` int NOT NULL DEFAULT 0,
	`pauseRequested` boolean NOT NULL DEFAULT false,
	`pauseExpiresAt` timestamp,
	`lastPaymentAt` timestamp,
	`dignityScore100Achieved` boolean NOT NULL DEFAULT false,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payday_patterns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`frequency` varchar(32) NOT NULL,
	`nextPayday` timestamp,
	`lastPayday` timestamp,
	`dayOfWeek` int,
	`dayOfMonth1` int,
	`dayOfMonth2` int,
	`confidence` int NOT NULL DEFAULT 50,
	`source` varchar(32) NOT NULL DEFAULT 'manual',
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payday_patterns_id` PRIMARY KEY(`id`)
);
