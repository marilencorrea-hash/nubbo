'use client';

import { useActionState } from 'react';

import { crearCliente } from '@/app/admin/ajustes/actions';
import { button, input } from '@/components/ui';

export function NuevoCliente() {
  const [state, action, pending] = useActionState(crearCliente, null);
  const label = 'block text-sm font-medium text-zinc-800';
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className={label}>
        Nombre del cliente
        <input className={input} name="nombre" placeholder="Inmobiliaria Sol" required />
      </label>
      <label className={label}>
        Clave del código de inserción
        <input className={`${input} font-data`} name="clave" pattern="[a-z0-9][a-z0-9\-]{1,38}" placeholder="inmobiliaria-sol" required />
      </label>
      <button className={`${button.primary} px-5 py-2.5`} disabled={pending} type="submit">
        {pending ? 'Creando…' : 'Crear cliente'}
      </button>
      {state?.ok && <p className="text-sm text-emerald-700 sm:col-span-3" role="status">Cliente creado.</p>}
      {state?.error && <p className="text-sm text-red-700 sm:col-span-3" role="alert">{state.error}</p>}
    </form>
  );
}
