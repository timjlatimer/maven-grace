CREATE TABLE `anthem_share_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`songId` int NOT NULL,
	`senderProfileId` int NOT NULL,
	`token` varchar(64) NOT NULL,
	`recipientName` varchar(128),
	`recipientMessage` text,
	`viewCount` int DEFAULT 0,
	`joinedCount` int DEFAULT 0,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `anthem_share_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `anthem_share_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`amountCents` int NOT NULL,
	`dueDay` int NOT NULL,
	`nextDueDate` timestamp,
	`category` varchar(64) DEFAULT 'other',
	`isPaid` boolean DEFAULT false,
	`paidAt` timestamp,
	`isAutoPay` boolean DEFAULT false,
	`nsfRiskFlagged` boolean DEFAULT false,
	`nsfRiskFlaggedAt` timestamp,
	`nsfFeeAmount` int,
	`nsfFeeDisputed` boolean DEFAULT false,
	`nsfFeeDisputeScript` text,
	`nsfFeeWaived` boolean DEFAULT false,
	`nsfFeeWaivedAmount` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budget_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` varchar(64) NOT NULL,
	`description` varchar(256) NOT NULL,
	`amountCents` int NOT NULL,
	`frequency` enum('one_time','weekly','biweekly','monthly') NOT NULL DEFAULT 'monthly',
	`dueDay` int,
	`nextDueDate` timestamp,
	`isPaid` boolean DEFAULT false,
	`paidAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budget_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maven_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`userId` int,
	`tier` enum('observer','essentials','plus') NOT NULL DEFAULT 'observer',
	`status` enum('active','paused','cancelled','pending') NOT NULL DEFAULT 'active',
	`stripeCustomerId` varchar(128),
	`stripeSubscriptionId` varchar(128),
	`stripePriceId` varchar(128),
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`weeklyAmountCents` int NOT NULL DEFAULT 0,
	`deliveryAddress` text,
	`deliveryPostalCode` varchar(16),
	`deliveryNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maven_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milk_money_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`tier` enum('rookie','regular','trusted','elite') NOT NULL DEFAULT 'rookie',
	`creditLimitCents` int NOT NULL DEFAULT 2000,
	`currentBalanceCents` int NOT NULL DEFAULT 0,
	`totalBorrowedCents` int NOT NULL DEFAULT 0,
	`totalRepaidCents` int NOT NULL DEFAULT 0,
	`onTimeRepayments` int NOT NULL DEFAULT 0,
	`lateRepayments` int NOT NULL DEFAULT 0,
	`trustScore` int NOT NULL DEFAULT 0,
	`isEligible` boolean NOT NULL DEFAULT true,
	`frozenReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milk_money_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `milk_money_accounts_profileId_unique` UNIQUE(`profileId`)
);
--> statement-breakpoint
CREATE TABLE `milk_money_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`profileId` int NOT NULL,
	`type` enum('borrow','repay','fee_waived') NOT NULL,
	`amountCents` int NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`repaidAt` timestamp,
	`isLate` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milk_money_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paychecks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`amountCents` int NOT NULL,
	`frequency` enum('weekly','biweekly','semimonthly','monthly') NOT NULL DEFAULT 'biweekly',
	`nextPayDate` timestamp,
	`employer` varchar(256),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paychecks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `songs` ADD `shareToken` varchar(64);--> statement-breakpoint
ALTER TABLE `songs` ADD `shareCount` int DEFAULT 0;