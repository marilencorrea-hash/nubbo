import type { Metadata } from 'next';

import { Wizard } from './wizard';

export const metadata: Metadata = {
  title: 'Simulador de viabilidad hipotecaria',
  description: 'Calcula tu cuota mensual, tu nivel de endeudamiento y la viabilidad de tu hipoteca en tres pasos.',
};

// El widget que las webs insertan por script o iframe: sin cabecera ni pie (ver ShellGate en layout.tsx).
// `?c=clave` elige el cliente (sus umbrales, webhook y aviso); sin clave, el cliente general.
export default async function EmbedPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { c } = await searchParams;
  return <Wizard cliente={typeof c === 'string' ? c.slice(0, 40) : undefined} />;
}
