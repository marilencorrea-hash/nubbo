import { and, desc, eq, gte, lt } from 'drizzle-orm';

import { db } from '@/db';
import { leads } from '@/db/schema';

/** Filtros del panel y del CSV: viabilidad y rango de fechas (YYYY-MM-DD, ambos días incluidos). */
export function leadsFiltrados(viab?: string | null, desde?: string | null, hasta?: string | null, limit = 500, cliente?: string | null) {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const conds = [];
  if (cliente) conds.push(eq(leads.clienteId, cliente));
  if (viab === 'verde' || viab === 'ambar' || viab === 'rojo') conds.push(eq(leads.viabilidad, viab));
  if (desde && iso.test(desde)) conds.push(gte(leads.createdAt, new Date(`${desde}T00:00:00.000Z`)));
  if (hasta && iso.test(hasta)) conds.push(lt(leads.createdAt, new Date(new Date(`${hasta}T00:00:00.000Z`).getTime() + 86_400_000)));
  return db.select().from(leads).where(and(...conds)).orderBy(desc(leads.createdAt)).limit(limit);
}
