import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { config } from '@/db/schema';

export const CONFIG_ID = 'main';
export const configQuery = () => db.select().from(config).where(eq(config.id, CONFIG_ID)).limit(1);
export const defaultConfig = { umbralVerde: 30, umbralAmbar: 40, webhookUrl: '', emailAviso: '' };
