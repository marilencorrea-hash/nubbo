'use server';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { config } from '@/db/schema';
import { isAdmin } from '@/lib/admin';
import { CONFIG_ID, configQuery } from '@/lib/config';
import { loadPage } from '@/lib/load-page';

export async function guardarAjustes(_prev: { ok?: boolean; error?: string } | null, form: FormData) {
  const { user } = await loadPage(() => [configQuery()] as const, { signedIn: true });
  if (!user || !isAdmin(user)) return { error: 'Sin permiso.' };
  const verde = Number(form.get('umbralVerde'));
  const ambar = Number(form.get('umbralAmbar'));
  const webhookUrl = String(form.get('webhookUrl') ?? '').trim();
  const emailAviso = String(form.get('emailAviso') ?? '').trim().toLowerCase();
  if (!(verde > 0 && ambar > verde && ambar <= 100)) return { error: 'El umbral ámbar debe ser mayor que el verde (entre 1 y 100).' };
  if (webhookUrl && !/^https:\/\/[^\s]+$/.test(webhookUrl)) return { error: 'La URL del webhook debe empezar por https://' };
  if (emailAviso && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAviso)) return { error: 'E-mail de aviso no válido.' };
  await db.insert(config).values({ id: CONFIG_ID, umbralVerde: verde, umbralAmbar: ambar, webhookUrl, emailAviso })
    .onConflictDoUpdate({ target: config.id, set: { umbralVerde: verde, umbralAmbar: ambar, webhookUrl, emailAviso } });
  revalidatePath('/admin/ajustes');
  return { ok: true };
}
