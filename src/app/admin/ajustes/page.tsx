import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AjustesForm } from './ajustes-form';

import { AccesoRestringido } from '@/components/acceso-restringido';
import { AppPage } from '@/components/ui';
import { isAdmin } from '@/lib/admin';
import { configQuery, defaultConfig } from '@/lib/config';
import { loadPage } from '@/lib/load-page';

export const metadata: Metadata = { title: 'Ajustes' };

export default async function Ajustes() {
  const { user, data } = await loadPage((_me) => [configQuery()] as const, { signedIn: true });
  if (!user) redirect('/login');
  if (!isAdmin(user)) return <AccesoRestringido />;
  const cfg = { ...defaultConfig, ...data[0][0] };
  return (
    <AppPage description="Cómo se clasifica cada lead y a dónde se envía." title="Ajustes">
      <AjustesForm
        inicial={{ umbralVerde: cfg.umbralVerde, umbralAmbar: cfg.umbralAmbar, webhookUrl: cfg.webhookUrl ?? '', emailAviso: cfg.emailAviso ?? '' }}
      />
    </AppPage>
  );
}
