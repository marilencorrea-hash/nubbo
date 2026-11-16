'use client';

import { useState } from 'react';

// Copia un fragmento de código al portapapeles y lo confirma.
export function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent/60"
      onClick={() => {
        void navigator.clipboard
          .writeText(text)
          .then(() => {
            setOk(true);
            setTimeout(() => setOk(false), 1800);
          })
          .catch(() => setOk(false));
      }}
      type="button"
    >
      <span aria-live="polite">{ok ? 'Copiado' : label}</span>
    </button>
  );
}
