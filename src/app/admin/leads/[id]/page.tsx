import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { AccesoRestringido } from '@/components/acceso-restringido';
import { ScaleBar, ViabBadge } from '@/components/semaforo';
import { AppPage, Card, button } from '@/components/ui';
import { db } from '@/db';
import { config, leads } from '@/db/schema';
import { isAdmin } from '@/lib/admin';
import { defaultConfig } from '@/lib/config';
import { eur, eur0, fecha, pct } from '@/lib/format';
import { loadPage } from '@/lib/load-page';
import { textoViabilidad } from '@/lib/scoring';

export const metadata: Metadata = { title: 'Detalle del lead' };

function Dl({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div className="min-w-0" key={k}>
          <dt className="text-sm text-zinc-500">{k}</dt>
          <dd className="font-data mt-0.5 break-words font-medium text-zinc-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function LeadDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, data } = await loadPage((_me) => [db.select().from(leads).where(eq(leads.id, id)).limit(1), db.select().from(config).innerJoin(leads, eq(leads.clienteId, config.id)).where(eq(leads.id, id)).limit(1)] as const, { signedIn: true });
  if (!user) redirect('/login');
  if (!isAdmin(user)) return <AccesoRestringido />;
  const lead = data[0][0];
  if (!lead) notFound();
  const cfg = { ...defaultConfig, ...data[1][0]?.config };
  const umbrales = { verde: cfg.umbralVerde, ambar: cfg.umbralAmbar };
  const hook = lead.webhookEstado;

  return (
    <AppPage
      action={
        <Link className={button.secondary} href="/admin">
          ← Volver a leads
        </Link>
      }
      description={fecha(lead.createdAt)}
      title={
        <span className="flex flex-wrap items-center gap-3">
          {lead.nombre}
          <ViabBadge v={lead.viabilidad} />
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <Card title="Contacto">
            <Dl
              items={[
                ['Nombre', lead.nombre],
                ['Email', <a className="text-accent hover:underline" href={`mailto:${lead.email}`} key="e">{lead.email}</a>],
                ['Teléfono', <a className="text-accent hover:underline" href={`tel:${lead.telefono}`} key="t">{lead.telefono}</a>],
                ['Fecha de solicitud', fecha(lead.createdAt)],
              ]}
            />
          </Card>
          <Card title="Inmueble">
            <Dl items={[['Precio del inmueble', eur0(lead.precioInmueble)], ['Entrada aportada', eur0(lead.entrada)]]} />
          </Card>
          <Card title="Financiación">
            <Dl items={[['Importe solicitado', eur0(lead.importe)], ['Plazo', `${lead.plazoAnios} años`], ['Tipo de interés', pct(lead.tipoInteres)]]} />
          </Card>
          <Card title="Situación">
            <Dl items={[['Ingresos netos mensuales', eur(lead.ingresosNetos)], ['Otras cuotas mensuales', eur(lead.otrasCuotas)]]} />
          </Card>
        </div>

        <div className="grid content-start gap-6">
          <Card title="Resultado">
            <p className="text-sm text-zinc-500">Cuota mensual estimada</p>
            <p className="font-data text-3xl font-semibold tracking-tight text-brand">{eur(lead.cuotaMensual)}</p>
            <p className="mt-4 text-sm text-zinc-500">DTI</p>
            <p className="font-data text-3xl font-semibold tracking-tight text-brand">{pct(lead.dti)}</p>
            <ScaleBar dti={lead.dti} umbrales={umbrales} viab={lead.viabilidad} />
            <p className="font-display font-semibold">{textoViabilidad[lead.viabilidad].titulo}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{textoViabilidad[lead.viabilidad].texto(lead.dti, umbrales)}</p>
          </Card>
          <Card title="Consentimiento y envío">
            <Dl
              items={[
                ['Consentimiento RGPD', lead.consentimientoRgpd ? 'Aceptado' : 'No aceptado'],
                ['Webhook', hook ? (hook === 'enviado' ? 'Enviado' : `Fallido (${hook})`) : 'Sin webhook configurado'],
              ]}
            />
          </Card>
        </div>
      </div>
    </AppPage>
  );
}
