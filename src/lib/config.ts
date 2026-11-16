import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { config } from '@/db/schema';

export const CONFIG_ID = 'main';
export const configQuery = () => db.select().from(config).where(eq(config.id, CONFIG_ID)).limit(1);
export const defaultConfig = { umbralVerde: 30, umbralAmbar: 40, webhookUrl: '', emailAviso: '' };

/** Cliente por su clave pública (la del código de inserción); sin clave, el cliente general. */
export const clienteQuery = (clave?: string | null) =>
  db.select().from(config).where(clave ? eq(config.clave, clave.toLowerCase()) : eq(config.id, CONFIG_ID)).limit(1);
export const clienteIdQuery = (id: string) => db.select().from(config).where(eq(config.id, id)).limit(1);
