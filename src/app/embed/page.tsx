import type { Metadata } from 'next';

import { Wizard } from './wizard';

export const metadata: Metadata = {
  title: 'Simulador de viabilidad hipotecaria',
  description: 'Calcula tu cuota mensual, tu nivel de endeudamiento y la viabilidad de tu hipoteca en tres pasos.',
};

// El widget que las webs insertan por script o iframe: sin cabecera ni pie (ver ShellGate en layout.tsx).
export default function EmbedPage() {
  return <Wizard />;
}
