'use client';

import { useRouter } from 'next/navigation';

import { signOut } from '@/lib/auth-client';

// Cerrar sesión, en español (el SignOutButton de la plantilla está en inglés).
export function SignOutEs({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={() => {
        void signOut().then(() => {
          router.refresh();
        });
      }}
      type="button"
    >
      Cerrar sesión
    </button>
  );
}
