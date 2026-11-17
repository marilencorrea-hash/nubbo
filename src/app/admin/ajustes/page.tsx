import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AjustesForm } from './ajustes-form';

import { AppPage, Card } from '@/components/ui';
import { isAdmin } from '@/lib/admin';
import { clienteIdQuery, defaultConfig } from '@/lib/config';
import { miClienteQuery } from '@/lib/acceso';
import { SinCliente } from '@/components/sin-cliente';
import { loadPage } from '@/lib/load-page';

export const metadata: Metadata = { title: 'Ajustes' };

export default async function Ajustes({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams;
  const { user, data } = await loadPage((me) => [clienteIdQuery(cliente || 'main'), miClienteQuery(me)] as const, { signedIn: true });
  if (!user) redirect('/login');
  const admin = isAdmin(user);
  const mi = data[1][0];
  if (!admin && !mi) return <SinCliente />;
  const fila = admin ? data[0][0] : (await clienteIdQuery(mi!.id))[0];
  if (!fila) redirect('/admin/clientes');
  const cfg = { ...defaultConfig, ...fila };
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? '';
  return (
    <AppPage description="Cómo se clasifica cada lead de este cliente y a dónde se envía." title={`Ajustes · ${cfg.nombre}`}>
      <AjustesForm
        clienteId={fila.id}
        inicial={{ umbralVerde: cfg.umbralVerde, umbralAmbar: cfg.umbralAmbar, webhookUrl: cfg.webhookUrl ?? '', emailAviso: cfg.emailAviso ?? '' }}
      />
      {!admin && (
        <Card title="Código para insertar el simulador en tu web">
          <pre className="font-data overflow-x-auto rounded-lg bg-zinc-50 p-3 text-xs text-zinc-800">{`<script src="${origin}/embed.js" data-cliente="${fila.clave ?? ''}"></script>`}</pre>
        </Card>
      )}
    </AppPage>
  );
}
