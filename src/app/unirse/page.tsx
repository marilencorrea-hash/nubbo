import type { Metadata } from 'next';
import Link from 'next/link';

import { vincularCuenta } from './actions';

import { AppPage, Card, button } from '@/components/ui';
import { db } from '@/db';
import { config } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { loadPage } from '@/lib/load-page';

export const metadata: Metadata = { title: 'Acceso de cliente' };

export default async function Unirse({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const token = (t ?? '').slice(0, 80);
  const { user, data } = await loadPage(
    (_me) => [db.select({ id: config.id, nombre: config.nombre }).from(config).where(eq(config.invitacion, token || '-')).limit(1)] as const,
  );
  const cli = data[0][0];
  return (
    <AppPage description="Vincula tu cuenta para gestionar tus propios leads." title="Acceso de cliente">
      <Card>
        {!cli ? (
          <p className="text-zinc-600">Este enlace no es válido o ya se ha usado. Pide uno nuevo a HipoScore.</p>
        ) : !user ? (
          <div className="grid gap-4">
            <p className="text-zinc-700">
              Te han invitado a gestionar los leads de <strong>{cli.nombre}</strong>. Crea tu cuenta (o accede si ya tienes una) y vuelve a abrir este mismo enlace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className={button.primary} href="/register">Crear cuenta</Link>
              <Link className={button.secondary} href="/login">Acceder</Link>
            </div>
          </div>
        ) : (
          <form action={vincularCuenta} className="grid gap-4">
            <input name="t" type="hidden" value={token} />
            <p className="text-zinc-700">
              Vas a vincular tu cuenta <strong>{user.email}</strong> a <strong>{cli.nombre}</strong>. Verás solo los leads de esa empresa.
            </p>
            <div>
              <button className={`${button.primary} px-5 py-2.5`} type="submit">Vincular mi cuenta</button>
            </div>
          </form>
        )}
      </Card>
    </AppPage>
  );
}
