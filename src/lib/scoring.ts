// Scoring hipotecario determinista (sin IA): sistema francés + DTI + semáforo. Reproducible a mano.
export type Viabilidad = 'verde' | 'ambar' | 'rojo';

export type Entrada = {
  importe: number;
  plazoAnios: number;
  tipoInteres: number; // % anual
  ingresosNetos: number;
  otrasCuotas: number;
};

/** cuota = importe × i / (1 − (1+i)^−n), i = tipo/12/100, n = años×12. Con tipo 0: importe / n. */
export function cuotaFrances(importe: number, plazoAnios: number, tipoInteres: number): number {
  const n = plazoAnios * 12;
  const i = tipoInteres / 12 / 100;
  if (n <= 0) return 0;
  if (i === 0) return importe / n;
  return (importe * i) / (1 - Math.pow(1 + i, -n));
}

export function calcular(e: Entrada, umbralVerde: number, umbralAmbar: number) {
  const cuota = cuotaFrances(e.importe, e.plazoAnios, e.tipoInteres);
  const dti = ((cuota + e.otrasCuotas) / e.ingresosNetos) * 100;
  const viabilidad: Viabilidad = dti <= umbralVerde ? 'verde' : dti <= umbralAmbar ? 'ambar' : 'rojo';
  return { cuotaMensual: round2(cuota), dti: round2(dti), viabilidad };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const textoViabilidad: Record<Viabilidad, { titulo: string; texto: (v: number, u: { verde: number; ambar: number }) => string }> = {
  verde: {
    titulo: 'Viabilidad alta',
    texto: (d, u) => `Tu nivel de endeudamiento (${d.toFixed(1)} %) está por debajo del ${u.verde} %. Tu operación encaja con los criterios habituales de las entidades.`,
  },
  ambar: {
    titulo: 'Viabilidad media',
    texto: (d, u) => `Tu nivel de endeudamiento (${d.toFixed(1)} %) está entre el ${u.verde} % y el ${u.ambar} %. Es posible, pero conviene estudiar el plazo, la entrada o las garantías.`,
  },
  rojo: {
    titulo: 'Viabilidad baja',
    texto: (d, u) => `Tu nivel de endeudamiento (${d.toFixed(1)} %) supera el ${u.ambar} %. Con estos datos sería difícil; un asesor puede proponerte alternativas.`,
  },
};
