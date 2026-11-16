'use client';

import { useActionState, useState } from 'react';

import { guardarAjustes } from '@/app/admin/ajustes/actions';
import { ScaleBar } from '@/components/semaforo';
import { Card, button, input } from '@/components/ui';

type Inicial = { umbralVerde: number; umbralAmbar: number; webhookUrl: string; emailAviso: string };

export function AjustesForm({ inicial }: { inicial: Inicial }) {
  const [state, action, pending] = useActionState(guardarAjustes, null);
  const [verde, setVerde] = useState(String(inicial.umbralVerde));
  const [ambar, setAmbar] = useState(String(inicial.umbralAmbar));
  const v = Number(verde);
  const a = Number(ambar);
  const valido = v > 0 && a > v && a <= 100;
  const label = 'block text-sm font-medium text-zinc-800';
  const hint = 'mt-1.5 block text-xs font-normal text-zinc-500';

  return (
    <form action={action} className="grid gap-6">
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
