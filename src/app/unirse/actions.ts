'use server';
import { redirect } from 'next/navigation';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { clienteMiembros, config } from '@/db/schema';
import { loadPage } from '@/lib/load-page';

export async function vincularCuenta(form: FormData) {
  const token = String(form.get('t') ?? '').slice(0, 80);
  const { user, data } = await loadPage((_me) => [db.select({ id: config.id }).from(config).where(eq(config.invitacion, token || '-')).limit(1)] as const, { signedIn: true });
  if (!user) redirect('/login');
  const cli = data[0][0];
  if (!cli) redirect('/unirse');
  await db.batch([
    db
      .insert(clienteMiembros)
      .values({ id: crypto.randomUUID(), clienteId: cli.id, userId: user.id, createdAt: new Date() })
      .onConflictDoUpdate({ target: clienteMiembros.userId, set: { clienteId: cli.id } }),
    db.update(config).set({ invitacion: null }).where(eq(config.id, cli.id)),
  ]);
  console.log('cuenta vinculada a cliente', cli.id);
  redirect('/admin');
}
