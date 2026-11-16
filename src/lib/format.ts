// Formato es-ES de importes, porcentajes y fechas (Europe/Madrid), compartido por landing, widget y panel.
const eurFmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
const eur0Fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' });
const pctFmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: 'Europe/Madrid',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export const eur = (n: number) => eurFmt.format(n);
export const eur0 = (n: number) => eur0Fmt.format(n);
export const pct = (n: number) => `${pctFmt.format(n)} %`;
export const fecha = (d: Date) => dateFmt.format(d).replace(',', '');
