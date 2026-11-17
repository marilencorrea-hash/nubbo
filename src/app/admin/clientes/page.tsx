import { count, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { NuevoCliente } from './nuevo-cliente';

import { AccesoRestringido } from '@/components/acceso-restringido';
import { AppPage, Card } from '@/components/ui';
import { db } from '@/db';
import { config, leads } from '@/db/schema';
import { isAdmin } from '@/lib/admin';
import { generarInvitacion } from '@/app/admin/ajustes/actions';
import { loadPage } from '@/lib/load-page';

export const metadata: Metadata = { title: 'Clientes' };

export default async function Clientes() {
  const { user, data } = await loadPage(
    (_me) =>
      [
        db.select({ c: config, n: count(leads.id) }).from(config).leftJoin(leads, eq(leads.clienteId, config.id)).groupBy(config.id).limit(200),
      ] as const,
    { signedIn: true },
  );
  if (!user) redirect('/login');
  if (!isAdmin(user)) return <AccesoRestringido />;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? '';
  return (
    <AppPage description="Cada cliente tiene su código de inserción, sus umbrales, su webhook y su aviso por e-mail." title="Clientes">
      <Card title="Nuevo cliente">
        <NuevoCliente />
      </Card>
      {data[0].map(({ c, n }) => (
        <Card key={c.id} title={c.nombre}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            <span>{n} leads</span>
            <Link className="font-medium text-accent hover:underline" href={`/admin?cliente=${c.id}`}>Ver leads</Link>
            <Link className="font-medium text-accent hover:underline" href={`/admin/ajustes?cliente=${c.id}`}>Ajustes</Link>
          </div>
          <p className="mt-3 text-xs font-medium text-zinc-500">Acceso del cliente a su panel</p>
          {c.invitacion && <pre className="font-data mt-1 overflow-x-auto rounded-lg bg-zinc-50 p-3 text-xs text-zinc-800">{`${origin}/unirse?t=${c.invitacion}`}</pre>}
          <form action={generarInvitacion} className="mt-2">
            <input name="clienteId" type="hidden" value={c.id} />
            <button className="text-sm font-medium text-accent hover:underline" type="submit">{c.invitacion ? 'Generar otro enlace' : 'Generar enlace de acceso'}</button>
            <span className="ml-2 text-xs text-zinc-500">Se usa una vez: el cliente crea su cuenta y la vincula.</span>
          </form>
          <p className="mt-4 text-xs font-medium text-zinc-500">Código de inserción</p>
          <pre className="font-data mt-1 overflow-x-auto rounded-lg bg-zinc-50 p-3 text-xs text-zinc-800">{`<script src="${origin}/embed.js" data-cliente="${c.clave ?? ''}"></script>`}</pre>
        </Card>
      ))}
    </AppPage>
  );
}
