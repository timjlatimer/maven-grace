CREATE TABLE `grace_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int NOT NULL,
	`userId` int,
	`personality` enum('angel','coach','fierce','bestfriend','antithesis') NOT NULL DEFAULT 'bestfriend',
	`expertise` varchar(64) DEFAULT 'general',
	`scheduleType` enum('early_bird','nine_to_five','night_shift','irregular','stay_at_home') NOT NULL DEFAULT 'nine_to_five',
	`wakeTime` varchar(8) DEFAULT '07:00',
	`sleepTime` varchar(8) DEFAULT '22:00',
	`consciousnessTier` enum('free','essentials','plus') NOT NULL DEFAULT 'free',
	`hapticsEnabled` boolean NOT NULL DEFAULT true,
	`kamiMomentEnabled` boolean NOT NULL DEFAULT true,
	`kamiMomentTime` varchar(8) DEFAULT '07:00',
	`graceHomeSetting` varchar(64) DEFAULT 'auto',
	`lastDailySelfAt` timestamp,
	`lastVulnerabilityAt` timestamp,
	`lastSelfCareCheckAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grace_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `grace_preferences_profileId_unique` UNIQUE(`profileId`)
);
--> statement-breakpoint
CREATE TABLE `grace_referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerProfileId` int NOT NULL,
	`referralCode` varchar(64) NOT NULL,
	`referredProfileId` int,
	`referredName` varchar(128),
	`status` enum('pending','joined','active') NOT NULL DEFAULT 'pending',
	`joinedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `grace_referrals_referralCode_unique` UNIQUE(`referralCode`)
);
