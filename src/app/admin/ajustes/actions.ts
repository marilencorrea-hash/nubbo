'use server';
import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { config } from '@/db/schema';
import { isAdmin } from '@/lib/admin';
import { clienteIdQuery, clienteQuery } from '@/lib/config';
import { loadPage } from '@/lib/load-page';

export async function guardarAjustes(_prev: { ok?: boolean; error?: string } | null, form: FormData) {
  const { user } = await loadPage(() => [clienteIdQuery(String(form.get('clienteId') ?? ''))] as const, { signedIn: true });
  if (!user || !isAdmin(user)) return { error: 'Sin permiso.' };
  const [cli] = (await loadPage(() => [clienteIdQuery(String(form.get('clienteId') ?? ''))] as const)).data[0];
  if (!cli) return { error: 'Cliente no encontrado.' };
  const verde = Number(form.get('umbralVerde'));
  const ambar = Number(form.get('umbralAmbar'));
  const webhookUrl = String(form.get('webhookUrl') ?? '').trim();
  const emailAviso = String(form.get('emailAviso') ?? '').trim().toLowerCase();
  if (!(verde > 0 && ambar > verde && ambar <= 100)) return { error: 'El umbral ámbar debe ser mayor que el verde (entre 1 y 100).' };
  if (webhookUrl && !/^https:\/\/[^\s]+$/.test(webhookUrl)) return { error: 'La URL del webhook debe empezar por https://' };
  if (emailAviso && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAviso)) return { error: 'E-mail de aviso no válido.' };
  await db.update(config).set({ umbralVerde: verde, umbralAmbar: ambar, webhookUrl, emailAviso }).where(eq(config.id, cli.id));
  revalidatePath('/admin/ajustes');
  return { ok: true };
}

export async function crearCliente(_prev: { ok?: boolean; error?: string } | null, form: FormData) {
  const { user, data } = await loadPage(() => [clienteQuery(String(form.get('clave') ?? '').trim() || 'x')] as const, { signedIn: true });
  if (!user || !isAdmin(user)) return { error: 'Sin permiso.' };
  const nombre = String(form.get('nombre') ?? '').trim().slice(0, 80);
  const clave = String(form.get('clave') ?? '').trim().toLowerCase();
  if (!nombre) return { error: 'Escribe el nombre del cliente.' };
  if (!/^[a-z0-9][a-z0-9-]{1,38}$/.test(clave)) return { error: 'La clave usa 2-39 letras minúsculas, números o guiones.' };
  const [existe] = data[0];
  if (existe) return { error: 'Esa clave ya existe.' };
  await db.insert(config).values({ id: crypto.randomUUID(), nombre, clave, createdAt: new Date() });
  console.log('cliente creado', clave);
  revalidatePath('/admin/clientes');
  return { ok: true };
}
