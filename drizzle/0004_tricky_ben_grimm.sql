PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_config` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text DEFAULT 'Cliente general' NOT NULL,
	`clave` text,
	`created_at` integer DEFAULT '"1970-01-01T00:00:00.000Z"' NOT NULL,
	`umbral_verde` real DEFAULT 30 NOT NULL,
	`umbral_ambar` real DEFAULT 40 NOT NULL,
	`webhook_url` text DEFAULT '' NOT NULL,
	`email_aviso` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_config`("id", "nombre", "clave", "created_at", "umbral_verde", "umbral_ambar", "webhook_url", "email_aviso") SELECT "id", "nombre", "clave", "created_at", "umbral_verde", "umbral_ambar", "webhook_url", "email_aviso" FROM `config`;--> statement-breakpoint
DROP TABLE `config`;--> statement-breakpoint
ALTER TABLE `__new_config` RENAME TO `config`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `config_clave_uq` ON `config` (`clave`);