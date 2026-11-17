import { leads } from '@/db/schema';
import { isAdmin } from '@/lib/admin';
import { leadsFiltrados } from '@/lib/leads-query';
import { loadPage } from '@/lib/load-page';
import { miClienteQuery } from '@/lib/acceso';

const cols = ['id', 'nombre', 'email', 'telefono', 'precio_inmueble', 'entrada', 'importe', 'plazo_anios', 'tipo_interes',
  'ingresos_netos', 'otras_cuotas', 'cuota_mensual', 'dti', 'viabilidad', 'consentimiento_rgpd', 'created_at'];

// Neutraliza fórmulas de hoja de cálculo y escapa según RFC 4180.
const cell = (v: unknown) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s) && typeof v === 'string') s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(request: Request) {
  const { user, data } = await loadPage((me) => [miClienteQuery(me)] as const, { signedIn: true });
  if (!user) return Response.json({ error: 'No autenticado' }, { status: 401 });
  const admin = isAdmin(user);
  const mi = data[0][0];
  if (!admin && !mi) return Response.json({ error: 'Sin permiso' }, { status: 403 });
  const p = new URL(request.url).searchParams;
  const rows = await leadsFiltrados(p.get('viabilidad'), p.get('desde'), p.get('hasta'), 10000, admin ? p.get('cliente') : mi!.id);
  const lines = [cols.join(',')].concat(rows.map((r) => [r.id, r.nombre, r.email, r.telefono, r.precioInmueble, r.entrada, r.importe,
    r.plazoAnios, r.tipoInteres, r.ingresosNetos, r.otrasCuotas, r.cuotaMensual, r.dti, r.viabilidad, r.consentimientoRgpd,
    r.createdAt.toISOString()].map(cell).join(',')));
  console.log('export csv', rows.length);
  return new Response('﻿' + lines.join('\r\n') + '\r\n', {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="leads.csv"' },
  });
}
