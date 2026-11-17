export const FUENTES: { id: string; nombre: string; stack: string; google?: string }[] = [
  { id: '', nombre: 'Por defecto de HipoScore', stack: '' },
  { id: 'sistema', nombre: 'Sistema (la del dispositivo)', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { id: 'inter', nombre: 'Inter', stack: '"Inter", sans-serif', google: 'Inter:wght@400;500;600;700' },
  { id: 'poppins', nombre: 'Poppins', stack: '"Poppins", sans-serif', google: 'Poppins:wght@400;500;600;700' },
  { id: 'montserrat', nombre: 'Montserrat', stack: '"Montserrat", sans-serif', google: 'Montserrat:wght@400;500;600;700' },
  { id: 'roboto', nombre: 'Roboto', stack: '"Roboto", sans-serif', google: 'Roboto:wght@400;500;700' },
  { id: 'opensans', nombre: 'Open Sans', stack: '"Open Sans", sans-serif', google: 'Open+Sans:wght@400;500;600;700' },
  { id: 'lato', nombre: 'Lato', stack: '"Lato", sans-serif', google: 'Lato:wght@400;700' },
  { id: 'merriweather', nombre: 'Merriweather (con serifa)', stack: '"Merriweather", Georgia, serif', google: 'Merriweather:wght@400;700' },
  { id: 'georgia', nombre: 'Georgia (con serifa)', stack: 'Georgia, "Times New Roman", serif' },
];

export const esColor = (c: string) => /^#[0-9a-fA-F]{6}$/.test(c);

/** Variables CSS que reconfiguran el asistente con la marca del cliente. */
export function temaCliente(t: { colorPrimario?: string | null; colorAcento?: string | null; fuente?: string | null }) {
  const f = FUENTES.find((x) => x.id === t.fuente);
  const style: Record<string, string> = {};
  if (t.colorPrimario && esColor(t.colorPrimario)) style['--color-brand'] = t.colorPrimario;
  if (t.colorAcento && esColor(t.colorAcento)) style['--color-accent'] = t.colorAcento;
  if (f?.stack) {
    style['--font-body'] = f.stack;
    style['--font-heading'] = f.stack;
    style.fontFamily = f.stack;
  }
  return { style, googleHref: f?.google ? `https://fonts.googleapis.com/css2?family=${f.google}&display=swap` : null };
}
