import Link from 'next/link';

import { hasShell, site } from '@/lib/site';

// El pie que comparten todas las rutas (la pinta layout.tsx, salvo en /embed).
export function SiteFooter() {
  if (!hasShell()) return null;
  const col = 'grid content-start gap-2 text-sm text-zinc-600';
  const a = 'transition-colors hover:text-brand';
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-12 text-sm text-zinc-600">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold tracking-tight text-brand">{site.name}</p>
          <p className="mt-2 leading-6">
            Cualificación previa de riesgo hipotecario para intermediarios. Cálculo determinista, sin cajas negras.
          </p>
        </div>
        <div className={col}>
          <p className="font-data text-xs uppercase tracking-wider text-zinc-500">Producto</p>
          {site.nav.map((l) => (
            <Link className={a} href={l.href} key={l.href}>
              {l.label}
            </Link>
          ))}
          <Link className={a} href="/embed">
            Demo en vivo
          </Link>
        </div>
        <div className={col}>
          <p className="font-data text-xs uppercase tracking-wider text-zinc-500">Intermediarios</p>
          <Link className={a} href="/login">
            Acceder al panel
          </Link>
          <Link className={a} href="/admin">
            Leads
          </Link>
          <Link className={a} href="/admin/ajustes">
            Ajustes y webhook
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-zinc-200 px-4 pt-6 text-xs text-zinc-500 sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}. La simulación es orientativa y no constituye una oferta
          vinculante de financiación.
        </p>
      </div>
    </footer>
  );
}
