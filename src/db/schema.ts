// The project's Drizzle schema — the source of truth for `npm run db:generate` (A3.5). Add the app's tables
// below. Event logs, telemetry and analytics streams do not belong in this database (A3.18).
export * from './schema.auth';

import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable(
  'leads',
  {
    id: text().primaryKey(),
    nombre: text().notNull(),
    email: text().notNull(),
    telefono: text().notNull(),
    precioInmueble: real('precio_inmueble').notNull(),
    entrada: real().notNull(),
    importe: real().notNull(),
    plazoAnios: integer('plazo_anios').notNull(),
    tipoInteres: real('tipo_interes').notNull(),
    ingresosNetos: real('ingresos_netos').notNull(),
    otrasCuotas: real('otras_cuotas').notNull(),
    cuotaMensual: real('cuota_mensual').notNull(),
    dti: real().notNull(),
    viabilidad: text({ enum: ['verde', 'ambar', 'rojo'] }).notNull(),
    consentimientoRgpd: integer('consentimiento_rgpd', { mode: 'boolean' }).notNull(),
    webhookEstado: text('webhook_estado'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [index('leads_created_idx').on(t.createdAt), index('leads_viabilidad_created_idx').on(t.viabilidad, t.createdAt)],
);

export const config = sqliteTable('config', {
  id: text().primaryKey(),
  umbralVerde: real('umbral_verde').notNull().default(30),
  umbralAmbar: real('umbral_ambar').notNull().default(40),
  webhookUrl: text('webhook_url').notNull().default(''),
  emailAviso: text('email_aviso').notNull().default(''),
});
