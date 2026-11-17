CREATE TABLE `cliente_miembros` (
	`id` text PRIMARY KEY NOT NULL,
	`cliente_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `config`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cliente_miembros_user_uq` ON `cliente_miembros` (`user_id`);--> statement-breakpoint
CREATE INDEX `cliente_miembros_cliente_idx` ON `cliente_miembros` (`cliente_id`);--> statement-breakpoint
ALTER TABLE `config` ADD `invitacion` text;--> statement-breakpoint
CREATE UNIQUE INDEX `config_invitacion_uq` ON `config` (`invitacion`);