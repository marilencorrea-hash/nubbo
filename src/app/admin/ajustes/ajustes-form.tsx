'use client';

import { useActionState, useState } from 'react';

import { guardarAjustes } from '@/app/admin/ajustes/actions';
import { ScaleBar } from '@/components/semaforo';
import { FUENTES, temaCliente } from '@/lib/tema';
import { Card, button, input } from '@/components/ui';

type Inicial = { umbralVerde: number; umbralAmbar: number; webhookUrl: string; emailAviso: string; colorPrimario: string; colorAcento: string; fuente: string };

export function AjustesForm({ inicial, clienteId }: { inicial: Inicial; clienteId: string }) {
  const [state, action, pending] = useActionState(guardarAjustes, null);
  const [verde, setVerde] = useState(String(inicial.umbralVerde));
  const [ambar, setAmbar] = useState(String(inicial.umbralAmbar));
  const [c1, setC1] = useState(inicial.colorPrimario);
  const [c2, setC2] = useState(inicial.colorAcento);
  const [fuente, setFuente] = useState(inicial.fuente);
  const tema = temaCliente({ colorPrimario: c1, colorAcento: c2, fuente });
  const v = Number(verde);
  const a = Number(ambar);
  const valido = v > 0 && a > v && a <= 100;
  const label = 'block text-sm font-medium text-zinc-800';
  const hint = 'mt-1.5 block text-xs font-normal text-zinc-500';

  return (
    <form action={action} className="grid gap-6">
      <input name="clienteId" type="hidden" value={clienteId} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Umbrales de DTI">
          <p className="text-sm leading-6 text-zinc-600">
            El semáforo compara el DTI de cada lead con dos umbrales: <strong className="font-medium text-emerald-700">Verde</strong> si el
            DTI es menor o igual que el umbral verde; <strong className="font-medium text-amber-700">Ámbar</strong> si es menor o igual que
            el umbral ámbar; <strong className="font-medium text-red-700">Rojo</strong> si lo supera.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Umbral verde (DTI %)
              <input className={`${input} font-data`} inputMode="decimal" max={100} min={1} name="umbralVerde" onChange={(e) => setVerde(e.target.value)} required step="any" type="number" value={verde} />
            </label>
            <label className={label}>
              Umbral ámbar (DTI %)
              <input className={`${input} font-data`} inputMode="decimal" max={100} min={1} name="umbralAmbar" onChange={(e) => setAmbar(e.target.value)} required step="any" type="number" value={ambar} />
            </label>
          </div>
          <p className="mt-2 text-xs text-zinc-500">Por defecto 30 y 40. El ámbar debe ser mayor que el verde.</p>
          {valido ? (
            <div className="mt-2">
              <p className="mt-4 text-xs font-medium text-zinc-500">Vista previa de la escala</p>
              <ScaleBar dti={(v + a) / 2} umbrales={{ verde: v, ambar: a }} viab="ambar" />
            </div>
          ) : (
            <p className="mt-4 text-sm text-amber-700">Revisa los umbrales para ver la escala.</p>
          )}
        </Card>

        <Card title="Webhook y avisos">
          <p className="text-sm leading-6 text-zinc-600">
            Cada vez que un visitante solicita contacto, enviamos el lead por <strong className="font-medium">POST</strong> con cuerpo JSON a
            esta URL, que debe ser <strong className="font-medium">HTTPS</strong>. El resultado del envío queda en el detalle del lead.
          </p>
          <div className="mt-5 grid gap-4">
            <label className={label}>
              URL del webhook
              <input autoComplete="off" className={`${input} font-data`} defaultValue={inicial.webhookUrl} name="webhookUrl" placeholder="https://tu-crm.com/hooks/leads" type="url" />
              <span className={hint}>Déjalo vacío para no enviar leads a ningún sistema externo.</span>
            </label>
            <label className={label}>
              E-mail de aviso
              <input autoComplete="email" className={input} defaultValue={inicial.emailAviso} name="emailAviso" placeholder="leads@tuempresa.es" type="email" />
              <span className={hint}>Recibirás un correo con cada lead nuevo. Vacío: se avisa al propietario de la cuenta.</span>
            </label>
          </div>
        </Card>
      </div>

      <Card title="Aspecto del simulador">
        <p className="text-sm leading-6 text-zinc-600">Adapta el simulador a la tipografía y los colores de tu web para que no desentone. Los cambios se ven al instante abajo.</p>
        {tema.googleHref && <link href={tema.googleHref} precedence="default" rel="stylesheet" />}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className={label}>
            Color principal
            <span className="mt-1.5 flex items-center gap-2">
              <input aria-label="Elegir color principal" className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1" onChange={(e) => setC1(e.target.value)} type="color" value={/^#[0-9a-f]{6}$/i.test(c1) ? c1 : '#0b2a6b'} />
              <input className={`${input} font-data mt-0`} maxLength={7} name="colorPrimario" onChange={(e) => setC1(e.target.value)} placeholder="#0B2A6B" value={c1} />
            </span>
          </label>
          <label className={label}>
            Color de acento
            <span className="mt-1.5 flex items-center gap-2">
              <input aria-label="Elegir color de acento" className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1" onChange={(e) => setC2(e.target.value)} type="color" value={/^#[0-9a-f]{6}$/i.test(c2) ? c2 : '#1d4ed8'} />
              <input className={`${input} font-data mt-0`} maxLength={7} name="colorAcento" onChange={(e) => setC2(e.target.value)} placeholder="#1D4ED8" value={c2} />
            </span>
          </label>
          <label className={label}>
            Tipografía
            <select className={`${input} mt-1.5`} name="fuente" onChange={(e) => setFuente(e.target.value)} value={fuente}>
              {FUENTES.map((f) => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-2 text-xs text-zinc-500">Deja los colores vacíos para usar los de HipoScore.</p>
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5" style={tema.style}>
          <p className="font-display text-sm font-semibold text-brand">Viabilidad hipotecaria</p>
          <p className="mt-1 text-sm text-zinc-600">Así verán el simulador tus visitantes: textos, cifras y botones.</p>
          <p className="font-data mt-2 text-2xl font-semibold text-brand">1.024,50 €</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white">Continuar</span>
            <span className="inline-flex rounded-lg border border-accent px-5 py-2.5 text-sm font-medium text-accent">Atrás</span>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <button className={`${button.primary} px-5 py-2.5`} disabled={pending} type="submit">
          {pending ? 'Guardando…' : 'Guardar ajustes'}
        </button>
        {state?.ok && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
            Ajustes guardados. Se aplican a los nuevos leads.
          </p>
        )}
        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
