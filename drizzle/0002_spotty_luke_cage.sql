CREATE TABLE `config` (
	`id` text PRIMARY KEY NOT NULL,
	`umbral_verde` real DEFAULT 30 NOT NULL,
	`umbral_ambar` real DEFAULT 40 NOT NULL,
	`webhook_url` text DEFAULT '' NOT NULL,
	`email_aviso` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`telefono` text NOT NULL,
	`precio_inmueble` real NOT NULL,
	`entrada` real NOT NULL,
	`importe` real NOT NULL,
	`plazo_anios` integer NOT NULL,
	`tipo_interes` real NOT NULL,
	`ingresos_netos` real NOT NULL,
	`otras_cuotas` real NOT NULL,
	`cuota_mensual` real NOT NULL,
	`dti` real NOT NULL,
	`viabilidad` text NOT NULL,
	`consentimiento_rgpd` integer NOT NULL,
	`webhook_estado` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_viabilidad_created_idx` ON `leads` (`viabilidad`,`created_at`);