CREATE TABLE `agent_introductions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`agentId` int NOT NULL,
	`introducedAt` timestamp NOT NULL DEFAULT (now()),
	`customName` varchar(128),
	`renamedAt` timestamp,
	`interactionCount` int NOT NULL DEFAULT 0,
	CONSTRAINT `agent_introductions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destiny_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`wave` enum('safe','reflective','deep') NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`askedAt` timestamp NOT NULL DEFAULT (now()),
	`answeredAt` timestamp,
	`readinessScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `destiny_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destiny_synthesis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`coreValues` text,
	`strengths` text,
	`purpose` text,
	`moonshot` text,
	`synthesisText` text,
	`isRevealed` boolean NOT NULL DEFAULT false,
	`revealedAt` timestamp,
	`lastUpdatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `destiny_synthesis_id` PRIMARY KEY(`id`),
	CONSTRAINT `destiny_synthesis_profileId_unique` UNIQUE(`profileId`)
);
--> statement-breakpoint
CREATE TABLE `dignity_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`vampireSlayer` int NOT NULL DEFAULT 0,
	`nsfShield` int NOT NULL DEFAULT 0,
	`budgetMastery` int NOT NULL DEFAULT 0,
	`milkMoneyTrust` int NOT NULL DEFAULT 0,
	`engagement` int NOT NULL DEFAULT 0,
	`totalScore` int NOT NULL DEFAULT 0,
	`tier` varchar(32) NOT NULL DEFAULT 'starting_out',
	`snapshotDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dignity_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `promises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`direction` enum('made_by_ruby','made_to_ruby') NOT NULL,
	`description` text NOT NULL,
	`category` varchar(64) NOT NULL DEFAULT 'general',
	`commitmentScore` int NOT NULL DEFAULT 50,
	`status` enum('active','completed','broken','expired','dormant') NOT NULL DEFAULT 'active',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`willingnessLevel` int NOT NULL DEFAULT 3,
	`nudgeCount` int NOT NULL DEFAULT 0,
	`lastNudgedAt` timestamp,
	`source` varchar(64) NOT NULL DEFAULT 'conversation',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`storyType` enum('moment','feature') NOT NULL DEFAULT 'moment',
	`content` text NOT NULL,
	`grade` varchar(4),
	`physicalObject` varchar(256),
	`greatQuote` text,
	`triggerEvent` varchar(256),
	`isDelivered` boolean NOT NULL DEFAULT false,
	`deliveredAt` timestamp,
	`deliveryMethod` enum('grace_read','self_read') DEFAULT 'grace_read',
	`visibility` enum('private','friends','community') NOT NULL DEFAULT 'private',
	`isAnonymized` boolean DEFAULT false,
	`sharedToSocial` boolean DEFAULT false,
	`readCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `village_agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentKey` varchar(64) NOT NULL,
	`defaultName` varchar(128) NOT NULL,
	`tradeName` varchar(128) NOT NULL,
	`category` enum('inner_circle','specialist','creative_studio') NOT NULL,
	`personality` text,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `village_agents_id` PRIMARY KEY(`id`),
	CONSTRAINT `village_agents_agentKey_unique` UNIQUE(`agentKey`)
);
