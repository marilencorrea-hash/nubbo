import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AjustesForm } from './ajustes-form';

import { AccesoRestringido } from '@/components/acceso-restringido';
import { AppPage } from '@/components/ui';
import { isAdmin } from '@/lib/admin';
import { clienteIdQuery, defaultConfig } from '@/lib/config';
import { loadPage } from '@/lib/load-page';

export const metadata: Metadata = { title: 'Ajustes' };

export default async function Ajustes({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams;
  const { user, data } = await loadPage((_me) => [clienteIdQuery(cliente || 'main')] as const, { signedIn: true });
  if (!user) redirect('/login');
  if (!isAdmin(user)) return <AccesoRestringido />;
  if (!data[0][0]) redirect('/admin/clientes');
  const cfg = { ...defaultConfig, ...data[0][0] };
  return (
    <AppPage description="Cómo se clasifica cada lead de este cliente y a dónde se envía." title={`Ajustes · ${cfg.nombre}`}>
      <AjustesForm
        clienteId={data[0][0].id}
        inicial={{ umbralVerde: cfg.umbralVerde, umbralAmbar: cfg.umbralAmbar, webhookUrl: cfg.webhookUrl ?? '', emailAviso: cfg.emailAviso ?? '' }}
      />
    </AppPage>
  );
}
