'use server';
import { randomUUID } from 'node:crypto';

import { eq } from 'drizzle-orm';
import { totalum } from 'totalum-sdk';

import { db } from '@/db';
import { leads } from '@/db/schema';
import { configQuery, defaultConfig } from '@/lib/config';
import { calcular, type Viabilidad } from '@/lib/scoring';
import { site } from '@/lib/site';

export type DatosWizard = {
  precioInmueble: number;
  entrada: number;
  importe: number;
  plazoAnios: number;
  tipoInteres: number;
  ingresosNetos: number;
  otrasCuotas: number;
};
export type Contacto = { nombre: string; email: string; telefono: string; consentimiento: boolean };
export type Resultado = { ok: true; cuotaMensual: number; dti: number; viabilidad: Viabilidad } | { ok: false; error: string };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : NaN);

/** Umbrales vigentes, para mostrar el resultado en el wizard (misma fórmula que el servidor). */
export async function obtenerUmbrales() {
  const [c] = await configQuery();
  return { verde: c?.umbralVerde ?? defaultConfig.umbralVerde, ambar: c?.umbralAmbar ?? defaultConfig.umbralAmbar };
}

/** Guarda el lead (solo con consentimiento RGPD), avisa por e-mail al admin y envía el webhook. */
export async function solicitarContacto(d: DatosWizard, c: Contacto): Promise<Resultado> {
  if (c.consentimiento !== true) return { ok: false, error: 'Debes aceptar el consentimiento para que podamos contactarte.' };
  const nombre = String(c.nombre ?? '').trim().slice(0, 120);
  const email = String(c.email ?? '').trim().toLowerCase().slice(0, 160);
  const telefono = String(c.telefono ?? '').trim().slice(0, 30);
  if (!nombre) return { ok: false, error: 'Escribe tu nombre.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Escribe un e-mail válido.' };
  if (!/^[+\d][\d\s().-]{6,}$/.test(telefono)) return { ok: false, error: 'Escribe un teléfono válido.' };
  const v = {
    precioInmueble: num(d?.precioInmueble), entrada: num(d?.entrada), importe: num(d?.importe),
    plazoAnios: num(d?.plazoAnios), tipoInteres: num(d?.tipoInteres), ingresosNetos: num(d?.ingresosNetos), otrasCuotas: num(d?.otrasCuotas),
  };
  if (Object.values(v).some(Number.isNaN) || v.precioInmueble <= 0 || v.importe <= 0 || v.entrada < 0 || v.otrasCuotas < 0 ||
    v.ingresosNetos <= 0 || v.plazoAnios < 1 || v.plazoAnios > 50 || v.tipoInteres < 0 || v.tipoInteres > 30)
    return { ok: false, error: 'Revisa los datos de la simulación.' };

  const [cfg] = await configQuery();
  const conf = { ...defaultConfig, ...cfg };
  const r = calcular(v, conf.umbralVerde, conf.umbralAmbar);
  const lead = {
    id: randomUUID(), nombre, email, telefono, ...v, cuotaMensual: r.cuotaMensual, dti: r.dti,
    viabilidad: r.viabilidad, consentimientoRgpd: true, webhookEstado: null as string | null, createdAt: new Date(),
  };

  // Webhook primero (para guardar su estado), sin bloquear si falla.
  if (conf.webhookUrl) {
    try {
      const res = await fetch(conf.webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...lead, createdAt: lead.createdAt.toISOString(), webhookEstado: undefined }),
        signal: AbortSignal.timeout(5000),
      });
      lead.webhookEstado = res.ok ? 'enviado' : `error ${res.status}`;
    } catch (e) {
      console.error('webhook lead falló', e instanceof Error ? e.message : e);
      lead.webhookEstado = 'error';
    }
  }
  await db.insert(leads).values(lead);
  console.log('lead guardado', lead.id, r.viabilidad);

  const to = conf.emailAviso || process.env.TOTALUM_OWNER_EMAIL;
  if (to) {
    try {
      await totalum.email.send({
        to,
        subject: `Nuevo lead ${r.viabilidad.toUpperCase()}: ${nombre}`,
        html: `<h2>Nuevo lead</h2><p><b>${esc(nombre)}</b><br>${esc(email)}<br>${esc(telefono)}</p>
<p>Cuota mensual: <b>${r.cuotaMensual.toFixed(2)} €</b><br>DTI: <b>${r.dti.toFixed(2)} %</b><br>Viabilidad: <b>${r.viabilidad}</b></p>
<p>Precio ${v.precioInmueble} € · Entrada ${v.entrada} € · Importe ${v.importe} € · ${v.plazoAnios} años · ${v.tipoInteres} %<br>Ingresos ${v.ingresosNetos} € · Otras cuotas ${v.otrasCuotas} €</p>`,
        replyTo: email,
        from: { name: site.name },
      });
    } catch (e) {
      console.error('e-mail lead falló', e instanceof Error ? e.message : e);
    }
  }
  return { ok: true, cuotaMensual: r.cuotaMensual, dti: r.dti, viabilidad: r.viabilidad };
}
