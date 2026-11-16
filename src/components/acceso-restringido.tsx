import Link from 'next/link';

import { Card } from '@/components/ui';

// Sesión iniciada pero sin permiso de administración (el e-mail aún no está verificado, o no es de administrador).
export function AccesoRestringido() {
  return (
    <div className="min-h-[70dvh] bg-zinc-50">
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <Card>
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
              <svg aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect height="10" rx="2" width="16" x="4" y="11" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Acceso restringido</h1>
              <p className="mt-2 leading-7 text-zinc-600">
                Esta zona es solo para el administrador. Si eres tú, verifica tu e-mail de administrador desde tu cuenta
                (te enviaremos un código de 8 dígitos) y vuelve a entrar.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-brand/40"
                  href="/account"
                >
                  Ir a mi cuenta
                </Link>
                <Link
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-brand/40"
                  href="/"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
