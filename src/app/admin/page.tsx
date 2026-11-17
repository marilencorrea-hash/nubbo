import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ViabBadge } from '@/components/semaforo';
import { AppPage, Card, EmptyState, Stat, button, input } from '@/components/ui';
import { isAdmin } from '@/lib/admin';
import { eur, fecha, pct } from '@/lib/format';
import { db } from '@/db';
import { config } from '@/db/schema';
import { leadsFiltrados } from '@/lib/leads-query';
import { miClienteQuery } from '@/lib/acceso';
import { SinCliente } from '@/components/sin-cliente';
import { loadPage } from '@/lib/load-page';

export const metadata: Metadata = { title: 'Leads' };

const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : '');

export default async function AdminLeads({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const viab = one(sp.viabilidad);
  const desde = one(sp.desde);
  const hasta = one(sp.hasta);
  let cliente = one(sp.cliente);
  const { user, data } = await loadPage((me) => [leadsFiltrados(viab, desde, hasta, 500, cliente), db.select({ id: config.id, nombre: config.nombre }).from(config).limit(200), miClienteQuery(me)] as const, { signedIn: true });
  if (!user) redirect('/login');
  const admin = isAdmin(user);
  const mi = data[2][0];
  if (!admin && !mi) return <SinCliente />;
  if (!admin) cliente = mi!.id;
  const rows = admin ? data[0] : await leadsFiltrados(viab, desde, hasta, 500, cliente);
  const clientes = admin ? data[1] : [];

  const qs = new URLSearchParams();
  if (viab) qs.set('viabilidad', viab);
  if (desde) qs.set('desde', desde);
  if (hasta) qs.set('hasta', hasta);
  if (cliente) qs.set('cliente', cliente);
  const csv = `/api/admin/leads-csv${qs.size ? `?${qs}` : ''}`;
  const filtrado = !!(viab || desde || hasta || cliente);
  const n = (v: string) => rows.filter((r) => r.viabilidad === v).length;
  const label = 'block text-sm font-medium text-zinc-800';

  return (
    <AppPage
      action={
        <a className={button.secondary} href={csv}>
          <svg aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Exportar CSV
        </a>
      }
      description="Leads capturados por el widget, con su cuota, su DTI y su viabilidad."
      title="Leads"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total" value={rows.length} hint={filtrado ? 'con los filtros actuales' : 'leads'} />
        <Stat label="Verdes" value={<span className="text-emerald-700">{n('verde')}</span>} hint="viabilidad alta" />
        <Stat label="Ámbar" value={<span className="text-amber-700">{n('ambar')}</span>} hint="viabilidad media" />
        <Stat label="Rojos" value={<span className="text-red-700">{n('rojo')}</span>} hint="viabilidad baja" />
      </div>

      <Card>
        <form action="/admin" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]" method="get">
          {admin && <label className={label}>
            Cliente
            <select className={input} defaultValue={cliente} name="cliente">
              <option value="">Todos</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>}
          <label className={label}>
            Viabilidad
            <select className={input} defaultValue={viab} name="viabilidad">
              <option value="">Todas</option>
              <option value="verde">Verde</option>
              <option value="ambar">Ámbar</option>
              <option value="rojo">Rojo</option>
            </select>
          </label>
          <label className={label}>
            Desde
            <input className={input} defaultValue={desde} name="desde" type="date" />
          </label>
          <label className={label}>
            Hasta
            <input className={input} defaultValue={hasta} name="hasta" type="date" />
          </label>
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <button className={`${button.primary} flex-1 py-2.5`} type="submit">
              Filtrar
            </button>
            <Link className={`${button.secondary} flex-1 py-2.5`} href="/admin">
              Limpiar
            </Link>
          </div>
        </form>
      </Card>

      <Card title={`${rows.length} ${rows.length === 1 ? 'lead' : 'leads'}`}>
        {rows.length === 0 ? (
          <EmptyState
            action={
              filtrado ? (
                <Link className={button.secondary} href="/admin">
                  Quitar filtros
                </Link>
              ) : (
                <Link className={button.primary} href="/embed">
                  Probar el widget
                </Link>
              )
            }
            text={filtrado ? 'Ningún lead cumple los filtros elegidos.' : 'Cuando alguien solicite contacto desde el widget, aparecerá aquí.'}
            title={filtrado ? 'Sin resultados' : 'Todavía no hay leads'}
          />
        ) : (
          <div className="-mx-4 sm:-mx-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-3 py-2.5 sm:px-4">Nombre</th>
                  <th className="hidden px-3 py-2.5 sm:table-cell sm:px-4">Email</th>
                  <th className="hidden px-3 py-2.5 md:table-cell sm:px-4">Teléfono</th>
                  <th className="hidden px-3 py-2.5 text-right sm:table-cell sm:px-4">Cuota</th>
                  <th className="hidden px-3 py-2.5 text-right sm:table-cell sm:px-4">DTI</th>
                  <th className="px-3 py-2.5 sm:px-4">Viabilidad</th>
                  <th className="hidden px-3 py-2.5 lg:table-cell sm:px-4">Fecha</th>
                  <th className="hidden px-3 py-2.5 sm:table-cell sm:px-4">
                    <span className="sr-only">Detalle</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {rows.map((r) => (
                  <tr className="hover:bg-zinc-50" key={r.id}>
                    <td className="max-w-0 px-3 py-3 sm:max-w-none sm:px-4">
                      <Link className="block truncate font-medium text-brand hover:underline" href={`/admin/leads/${r.id}`}>
                        {r.nombre}
                      </Link>
                      <p className="font-data break-words text-xs text-zinc-500 sm:hidden">
                        {r.email} · {eur(r.cuotaMensual)} · {pct(r.dti)}
                      </p>
                      <p className="font-data text-xs text-zinc-500 sm:hidden">{fecha(r.createdAt)}</p>
                    </td>
                    <td className="hidden px-3 py-3 sm:table-cell sm:px-4">
                      <span className="break-all text-zinc-700">{r.email}</span>
                    </td>
                    <td className="font-data hidden whitespace-nowrap px-3 py-3 text-zinc-700 md:table-cell sm:px-4">{r.telefono}</td>
                    <td className="font-data hidden whitespace-nowrap px-3 py-3 text-right sm:table-cell sm:px-4">{eur(r.cuotaMensual)}</td>
                    <td className="font-data hidden whitespace-nowrap px-3 py-3 text-right sm:table-cell sm:px-4">{pct(r.dti)}</td>
                    <td className="px-3 py-3 sm:px-4">
                      <ViabBadge v={r.viabilidad} />
                    </td>
                    <td className="font-data hidden whitespace-nowrap px-3 py-3 text-zinc-600 lg:table-cell sm:px-4">{fecha(r.createdAt)}</td>
                    <td className="hidden whitespace-nowrap px-3 py-3 text-right sm:table-cell sm:px-4">
                      <Link className="font-medium text-accent hover:underline" href={`/admin/leads/${r.id}`}>
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length >= 500 && <p className="px-4 pt-4 text-xs text-zinc-500 sm:px-6">Se muestran los 500 leads más recientes; afina con los filtros.</p>}
          </div>
        )}
      </Card>
    </AppPage>
  );
}
