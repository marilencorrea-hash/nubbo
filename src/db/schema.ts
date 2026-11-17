// The project's Drizzle schema — the source of truth for `npm run db:generate` (A3.5). Add the app's tables
// below. Event logs, telemetry and analytics streams do not belong in this database (A3.18).
export * from './schema.auth';

import { index, uniqueIndex, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
    clienteId: text('cliente_id').notNull().default('main'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [index('leads_created_idx').on(t.createdAt), index('leads_viabilidad_created_idx').on(t.viabilidad, t.createdAt), index('leads_cliente_created_idx').on(t.clienteId, t.createdAt)],
);

// Cada fila es un cliente (id 'main' = el cliente general original): sus umbrales, webhook y e-mail de aviso.
export const config = sqliteTable('config', {
  id: text().primaryKey(),
  nombre: text().notNull().default('Cliente general'),
  clave: text(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(new Date(0)),
  umbralVerde: real('umbral_verde').notNull().default(30),
  umbralAmbar: real('umbral_ambar').notNull().default(40),
  webhookUrl: text('webhook_url').notNull().default(''),
  emailAviso: text('email_aviso').notNull().default(''),
  invitacion: text(),
}, (t) => [uniqueIndex('config_clave_uq').on(t.clave), uniqueIndex('config_invitacion_uq').on(t.invitacion)]);

/** Cuenta (usuario) que gestiona los leads de un cliente: cada usuario pertenece a un solo cliente. */
export const clienteMiembros = sqliteTable('cliente_miembros', {
  id: text().primaryKey(),
  clienteId: text('cliente_id').notNull().references(() => config.id),
  userId: text('user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => [uniqueIndex('cliente_miembros_user_uq').on(t.userId), index('cliente_miembros_cliente_idx').on(t.clienteId)]);
