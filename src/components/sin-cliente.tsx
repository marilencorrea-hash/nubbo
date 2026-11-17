import Link from 'next/link';

import { Card } from '@/components/ui';

// Sesión iniciada pero sin cliente vinculado ni permiso de administración.
export function SinCliente() {
  return (
    <div className="min-h-[70dvh] bg-zinc-50">
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <Card>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Tu cuenta aún no tiene un panel</h1>
          <p className="mt-2 leading-7 text-zinc-600">
            Para ver tus leads necesitas el enlace de acceso que te ha enviado HipoScore. Ábrelo con esta sesión iniciada y tu cuenta quedará vinculada a tu empresa.
          </p>
          <Link className="mt-5 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-accent" href="/account">
            Ir a mi cuenta
          </Link>
        </Card>
      </main>
    </div>
  );
}
