ALTER TABLE `config` ADD `nombre` text DEFAULT 'Cliente general' NOT NULL;--> statement-breakpoint
ALTER TABLE `config` ADD `clave` text;--> statement-breakpoint
ALTER TABLE `config` ADD `created_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `config_clave_uq` ON `config` (`clave`);--> statement-breakpoint
ALTER TABLE `leads` ADD `cliente_id` text DEFAULT 'main' NOT NULL;--> statement-breakpoint
CREATE INDEX `leads_cliente_created_idx` ON `leads` (`cliente_id`,`created_at`);--> statement-breakpoint
UPDATE `config` SET `clave` = 'general' WHERE `id` = 'main' AND `clave` IS NULL;
