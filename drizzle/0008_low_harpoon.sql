ALTER TABLE `grace_preferences` ADD `culturalBackground` varchar(64) DEFAULT 'universal';--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `languageStyle` enum('casual','formal','warm','direct') DEFAULT 'warm' NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `coachingMode` enum('chat','coach') DEFAULT 'chat' NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `reducedMotion` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `highContrast` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `fontSize` enum('normal','large','xlarge') DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `onboardingStep` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `onboardingComplete` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `grace_preferences` ADD `lastCelebrationAt` timestamp;