'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// Oculta cabecera, pie y banner de desarrollo en /embed (el widget que otras webs insertan en un iframe).
export function ShellGate({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path === '/embed' || path?.startsWith('/embed/')) return null;
  return children;
}
