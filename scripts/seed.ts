import { db } from '@/db';
import { config, leads } from '@/db/schema';
import { calcular } from '@/lib/scoring';

if (process.env.TOTALUM_ENV !== 'dev') throw new Error('seed: dev database only');
const now = Date.now();
const nombres = ['Lucía Fernández', 'Carlos Martín', 'Marta Gil', 'Javier Ortega', 'Elena Ruiz', 'Pablo Navarro', 'Sofía Herrera', 'Andrés Molina',
  'Laura Castillo', 'Diego Romero', 'Irene Vidal', 'Sergio Peña', 'Carmen Soto', 'Raúl Iglesias', 'Nuria Campos', 'Álvaro Prieto', 'Paula Medina', 'Hugo Cano'];
// precio, entrada, plazo, interés, ingresos, otras cuotas
const casos = [[250000,60000,30,3.2,3800,0],[180000,40000,25,3.5,2400,150],[320000,80000,30,3.0,5200,200],[210000,30000,30,3.6,2100,250],
  [150000,45000,20,3.1,3000,0],[400000,100000,30,2.9,6500,300],[275000,55000,30,3.4,2900,350],[190000,20000,35,3.8,2200,100],
  [230000,70000,25,3.0,4100,0],[360000,60000,30,3.3,4300,400],[140000,35000,25,3.5,2700,0],[300000,90000,30,3.1,4800,150],
  [220000,22000,30,3.9,2300,300],[260000,65000,25,3.2,3900,100],[175000,50000,30,3.0,3300,0],[340000,70000,35,3.4,3600,450],
  [200000,60000,30,3.2,3500,80],[310000,40000,30,3.7,3100,200]];
const rows = casos.map(([p, e, a, t, ing, o], i) => {
  const importe = p - e;
  const r = calcular({ importe, plazoAnios: a, tipoInteres: t, ingresosNetos: ing, otrasCuotas: o }, 30, 40);
  const n = nombres[i];
  return { id: `seed-lead-${i + 1}`, nombre: n, email: `${n.normalize('NFD').replace(/[^a-zA-Z ]/g, '').toLowerCase().replace(/ /g, '.')}@example.com`,
    telefono: `+34 6${String(10000000 + i * 3719283).slice(0, 8)}`.replace(/(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3'),
    precioInmueble: p, entrada: e, importe, plazoAnios: a, tipoInteres: t, ingresosNetos: ing, otrasCuotas: o,
    cuotaMensual: r.cuotaMensual, dti: r.dti, viabilidad: r.viabilidad, consentimientoRgpd: true, webhookEstado: i % 3 ? 'enviado' : null,
    createdAt: new Date(now - (i * 31 + 3) * 3_600_000) };
});
await db.batch([
  db.insert(config).values({ id: 'main', umbralVerde: 30, umbralAmbar: 40, webhookUrl: '', emailAviso: '' }).onConflictDoNothing(),
  db.insert(leads).values(rows.slice(0, 5)).onConflictDoNothing(),
  db.insert(leads).values(rows.slice(5, 10)).onConflictDoNothing(),
  db.insert(leads).values(rows.slice(10, 15)).onConflictDoNothing(),
  db.insert(leads).values(rows.slice(15)).onConflictDoNothing(),
]);
console.log('seeded', rows.map((r) => r.viabilidad).join(','));
