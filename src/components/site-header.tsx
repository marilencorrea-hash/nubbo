import Link from 'next/link';

import { SignOutEs } from '@/components/sign-out-es';
import { currentSession } from '@/lib/auth';
import { hasShell, site } from '@/lib/site';

const link =
  'rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40';

// La cabecera que comparten todas las rutas (la pinta layout.tsx, salvo en /embed): enlaces en `src/lib/site.ts`.
export async function SiteHeader() {
  if (!hasShell()) return null;
  const session = site.accounts ? await currentSession({ admin: false }) : null;
  const links = session ? [...site.nav, ...site.appNav] : site.nav;
  const items = (
    <>
      {links.map((l) => (
        <Link className={link} href={l.href} key={l.href}>
          {l.label}
        </Link>
      ))}
      {!site.accounts ? null : session ? (
        <SignOutEs className={`${link} text-left`} />
      ) : (
        <>
          <Link className={link} href="/login">
            Acceder
          </Link>
          <Link
            className="rounded-md bg-brand px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-brand/40"
            href="/embed"
          >
            Ver demo
          </Link>
        </>
      )}
    </>
  );
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-brand" href="/">
          {site.logo ? (
            <img alt="" className="h-9 w-auto" src={site.logo} />
          ) : (
            <svg aria-hidden className="size-6" viewBox="0 0 24 24">
              <rect fill="currentColor" height="24" rx="5" width="24" />
              <rect fill="#34d399" height="3" rx="1.5" width="12" x="6" y="6.5" />
              <rect fill="#fbbf24" height="3" rx="1.5" width="9" x="6" y="10.5" />
              <rect fill="#f87171" height="3" rx="1.5" width="6" x="6" y="14.5" />
            </svg>
          )}
          {site.name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{items}</nav>
        <details className="relative md:hidden">
          <summary
            aria-label="Menú"
            className="cursor-pointer list-none rounded-md p-2 text-zinc-700 hover:bg-zinc-100 [&::-webkit-details-marker]:hidden"
          >
            <svg aria-hidden className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </summary>
          <nav className="absolute right-0 mt-2 grid w-56 gap-1 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg">
            {items}
          </nav>
        </details>
      </div>
    </header>
  );
}
