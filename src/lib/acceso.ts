import { eq, type SQL } from 'drizzle-orm';

import { db } from '@/db';
import { clienteMiembros, config } from '@/db/schema';

/** Cliente al que pertenece la cuenta que ha iniciado sesión (vacío si no está vinculada a ninguno). */
export const miClienteQuery = (me: SQL) =>
  db
    .select({ id: config.id, nombre: config.nombre, clave: config.clave })
    .from(clienteMiembros)
    .innerJoin(config, eq(config.id, clienteMiembros.clienteId))
    .where(eq(clienteMiembros.userId, me))
    .limit(1);

export const nuevoToken = () => crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
