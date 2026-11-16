import type { Viabilidad } from '@/lib/scoring';

// El semáforo de viabilidad: los únicos colores de riesgo del producto (verde, ámbar, rojo).
export const viabStyle: Record<Viabilidad, { label: string; dot: string; soft: string; text: string; border: string }> = {
  verde: {
    label: 'Verde',
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50 text-emerald-800 ring-emerald-600/25',
    text: 'text-emerald-700',
    border: 'border-emerald-500',
  },
  ambar: {
    label: 'Ámbar',
    dot: 'bg-amber-400',
    soft: 'bg-amber-50 text-amber-900 ring-amber-600/30',
    text: 'text-amber-700',
    border: 'border-amber-400',
  },
  rojo: {
    label: 'Rojo',
    dot: 'bg-red-500',
    soft: 'bg-red-50 text-red-800 ring-red-600/25',
    text: 'text-red-700',
    border: 'border-red-500',
  },
};

export function ViabBadge({ v }: { v: Viabilidad }) {
  const s = viabStyle[v];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.soft}`}>
      <span aria-hidden className={`size-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

const nf = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

/** Escala de DTI con los tres tramos y la posición del lead. */
export function ScaleBar({ dti, viab, umbrales }: { dti: number; viab: Viabilidad; umbrales: { verde: number; ambar: number } }) {
  const scale = Math.max(umbrales.ambar * 1.5, dti + 4);
  const at = (n: number) => `${Math.min(100, (n / scale) * 100)}%`;
  const seg = (v: Viabilidad) => `${viabStyle[v].dot} ${viab === v ? '' : 'opacity-25'} transition-opacity`;
  return (
    <div className="pb-6 pt-7">
      <div className="relative">
        <div className="flex h-2.5 overflow-hidden rounded-full">
          <div className={seg('verde')} style={{ width: at(umbrales.verde) }} />
          <div className={seg('ambar')} style={{ width: `${((umbrales.ambar - umbrales.verde) / scale) * 100}%` }} />
          <div className={`${seg('rojo')} flex-1`} />
        </div>
        <div className="absolute -top-6 -translate-x-1/2" style={{ left: at(dti) }}>
          <div className="flex flex-col items-center">
            <span className="font-data rounded bg-brand px-1.5 py-0.5 text-[11px] font-medium leading-none text-white">
              {nf.format(dti)} %
            </span>
            <span aria-hidden className="size-0 border-x-4 border-t-4 border-x-transparent border-t-brand" />
          </div>
        </div>
        <span className="font-data absolute top-4 left-0 text-[11px] text-zinc-500">0</span>
        <span className="font-data absolute top-4 -translate-x-1/2 text-[11px] text-zinc-500" style={{ left: at(umbrales.verde) }}>
          {umbrales.verde} %
        </span>
        <span className="font-data absolute top-4 -translate-x-1/2 text-[11px] text-zinc-500" style={{ left: at(umbrales.ambar) }}>
          {umbrales.ambar} %
        </span>
      </div>
    </div>
  );
}
