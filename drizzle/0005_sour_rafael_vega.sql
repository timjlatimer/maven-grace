CREATE TABLE `essentials_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`profileId` int,
	`userId` int,
	`memberName` varchar(256),
	`memberEmail` varchar(320),
	`deliveryAddress` text NOT NULL,
	`postalCode` varchar(16),
	`itemsRequested` text,
	`status` enum('pending','packed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`courierMethod` varchar(256),
	`trackingNumber` varchar(256),
	`requestSource` varchar(64) NOT NULL DEFAULT 'member',
	`statusUpdatedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `essentials_orders_id` PRIMARY KEY(`id`)
);
