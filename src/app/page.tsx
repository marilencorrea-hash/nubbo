import Link from 'next/link';

import { CopyButton } from '@/components/copy-button';
import { ScaleBar, ViabBadge } from '@/components/semaforo';
import { ScrollFx } from '@/components/scroll-fx';
import { eur, pct } from '@/lib/format';
import { calcular, textoViabilidad } from '@/lib/scoring';
import { siteUrl } from '@/lib/seo';

const UMBRALES = { verde: 30, ambar: 40 };
// Caso de ejemplo del hero y de la fórmula: se calcula con la misma función que usa el widget.
const EJ = { importe: 180000, plazoAnios: 25, tipoInteres: 3.1, ingresosNetos: 2700, otrasCuotas: 120 };

const pasos = [
  ['Insertas el widget', 'Una línea de script o un iframe en tu web. Se adapta al ancho de tu página y no toca tus estilos.'],
  ['El visitante simula en tres pasos', 'Datos del inmueble, financiación y situación. Cada paso se valida antes de avanzar.'],
  ['Ve su semáforo al instante', 'Cuota mensual, DTI y una viabilidad Verde, Ámbar o Roja con una explicación en claro.'],
  ['Te llega el lead ya cualificado', 'Solo si acepta el consentimiento RGPD: panel con filtros, exportación CSV y envío por webhook a tu CRM.'],
] as const;

const filas = [
  ['Marta Beltrán', 'marta.b@ejemplo.es', '1.012,35 €', '24,80', 'verde'],
  ['Álvaro Quintana', 'alvaro.q@ejemplo.es', '1.208,90 €', '36,40', 'ambar'],
  ['Lucía Ferrer', 'lucia.f@ejemplo.es', '1.376,20 €', '47,10', 'rojo'],
  ['Daniel Ruiz', 'daniel.r@ejemplo.es', '864,05 €', '28,90', 'verde'],
] as const;

const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

export default async function Home() {
  const origin = await siteUrl();
  const r = calcular(EJ, UMBRALES.verde, UMBRALES.ambar);
  const i = EJ.tipoInteres / 12 / 100;
  const scriptSnippet = `<script src="${origin}/embed.js"></script>`;
  const iframeSnippet = `<iframe src="${origin}/embed" style="width:100%;max-width:720px;height:640px;border:0"></iframe>`;
  const hook = `{\n  "nombre": "Álvaro Quintana",\n  "cuotaMensual": ${r.cuotaMensual},\n  "dti": ${r.dti},\n  "viabilidad": "${r.viabilidad}",\n  "consentimientoRgpd": true\n}`;

  return (
    <main>
      <ScrollFx />
      {/* HERO: el producto */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          aria-hidden
          className="bg-grid-fine absolute inset-x-0 -top-40 bottom-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
          data-parallax="0.2"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 size-[34rem] rounded-full bg-accent/30 blur-3xl" data-parallax="0.12" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="hero-in font-data inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span aria-hidden className="relative flex size-2">
                <span className="ping-soft absolute inline-flex size-full rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Scoring hipotecario embebible · B2B
            </p>
            <h1 className="hero-in mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl" style={d(90)}>
              Deja de llamar a curiosos: <span className="text-sky-300">consigue solo hipotecas financiables.</span>
            </h1>
            <p className="hero-in mt-5 max-w-prose text-base leading-7 text-white/75 sm:text-lg" style={d(180)}>
              HipoScore es el simulador que insertas en tu web: calcula la cuota, el DTI y un semáforo de viabilidad, y te
              entrega el contacto con su consentimiento RGPD. Cálculo determinista, sin cajas negras.
            </p>
            <div className="hero-in mt-8 flex flex-wrap gap-3" style={d(270)}>
              <Link
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-brand shadow-lg shadow-black/10 transition-all hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white/60"
                href="/embed"
              >
                Probar el widget en vivo
                <svg aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
                href="/login"
              >
                Acceder al panel
              </Link>
            </div>
          </div>

          {/* Mock del resultado del wizard */}
          <div className="hero-in relative min-w-0 lg:pb-10" style={d(200)}>
            <div className="overflow-hidden rounded-2xl bg-white text-zinc-900 shadow-2xl shadow-black/30 ring-1 ring-white/20">
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2">
                <span aria-hidden className="size-2.5 rounded-full bg-zinc-300" />
                <span aria-hidden className="size-2.5 rounded-full bg-zinc-300" />
                <span aria-hidden className="size-2.5 rounded-full bg-zinc-300" />
                <span className="font-data ml-2 min-w-0 flex-1 truncate rounded bg-white px-2 py-0.5 text-[11px] text-zinc-500 ring-1 ring-zinc-200">
                  tuinmobiliaria.es/hipotecas
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-3 gap-2">
                  {['01 Inmueble', '02 Financiación', '03 Situación'].map((t) => (
                    <div key={t}>
                      <div className="h-1 rounded-full bg-accent" />
                      <p className="font-data mt-1.5 truncate text-[11px] text-zinc-500">{t}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-display text-lg font-semibold tracking-tight">Tu resultado</p>
                <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200">
                  <div className="bg-white p-3">
                    <p className="text-[11px] text-zinc-500">Cuota mensual</p>
                    <p className="font-data mt-1 text-xl font-semibold text-brand sm:text-2xl">{eur(r.cuotaMensual)}</p>
                  </div>
                  <div className="bg-white p-3">
                    <p className="text-[11px] text-zinc-500">DTI</p>
                    <p className="font-data mt-1 text-xl font-semibold text-brand sm:text-2xl">{pct(r.dti)}</p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border-l-4 border-amber-400 bg-zinc-50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ViabBadge v={r.viabilidad} />
                    <p className="font-display text-sm font-semibold">{textoViabilidad[r.viabilidad].titulo}</p>
                  </div>
                  <ScaleBar dti={r.dti} umbrales={UMBRALES} viab={r.viabilidad} />
                  <p className="text-xs leading-5 text-zinc-600">{textoViabilidad[r.viabilidad].texto(r.dti, UMBRALES)}</p>
                </div>
              </div>
            </div>
            <div
              className="font-data mt-4 rounded-xl border border-white/15 bg-zinc-950/95 p-3 text-[11px] leading-5 text-zinc-300 shadow-xl backdrop-blur sm:absolute sm:right-[-0.5rem] sm:bottom-0 sm:mt-0 sm:w-60 lg:right-[-1.5rem]"
              data-parallax="-0.05"
            >
              <p className="mb-1 text-emerald-400">POST → tu CRM · 200</p>
              <pre className="overflow-x-auto whitespace-pre">{hook}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Cifras */}
      <section className="border-b border-zinc-200 bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-zinc-200 border-x border-zinc-200 lg:grid-cols-4 lg:divide-y-0">
          {(
            [
              [<><span data-count="100">100</span> %</>, 'determinista: la misma entrada da siempre la misma salida'],
              [<><span data-count="3">3</span> pasos</>, 'siete datos y un resultado en menos de un minuto'],
              [<><span data-count="30">30</span> / <span data-count="40">40</span> %</>, 'umbrales de DTI por defecto, editables en Ajustes'],
              ['RGPD', 'ningún lead se guarda sin consentimiento explícito'],
            ] as const
          ).map(([n, t], k) => (
            <div className="p-4 sm:p-6" data-reveal key={t} style={d(k * 90)}>
              <dt className="font-data text-2xl font-semibold text-brand sm:text-3xl">{n}</dt>
              <dd className="mt-1 text-sm leading-5 text-zinc-600">{t}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Cómo funciona */}
      <section className="scroll-mt-14 py-16 sm:py-24" id="como-funciona">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <div data-reveal="left">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">De visitante curioso a lead filtrado</h2>
            <p className="mt-3 max-w-prose leading-7 text-zinc-600">
              Tu web deja de recoger formularios vacíos. Cada contacto llega con su cuota, su nivel de endeudamiento y una
              viabilidad que puedes ordenar y filtrar.
            </p>
          </div>
          <ol className="border-t border-zinc-200">
            {pasos.map(([t, desc], n) => (
              <li className="grid grid-cols-[3rem_1fr] gap-2 border-b border-zinc-200 py-5" data-reveal key={t} style={d(n * 110)}>
                <span className="font-data text-sm text-accent">{String(n + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1 leading-7 text-zinc-600">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fórmula y umbrales */}
      <section className="scroll-mt-14 border-y border-zinc-200 bg-zinc-50 py-16 sm:py-24" id="formula">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div data-reveal>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Una fórmula que puedes comprobar con una calculadora</h2>
            <p className="mt-3 max-w-prose leading-7 text-zinc-600">
              Sin modelos opacos ni IA: sistema de amortización francés, ratio de endeudamiento y dos umbrales que tú decides.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 lg:grid-cols-3">
            <div className="min-w-0 bg-white p-5 sm:p-6 lg:col-span-2" data-reveal style={d(0)}>
              <p className="font-data text-xs text-zinc-500">CUOTA MENSUAL · SISTEMA FRANCÉS</p>
              <p className="font-data mt-3 text-base font-medium leading-8 break-words text-brand sm:text-xl">
                cuota = importe × i / (1 − (1 + i)<sup>−n</sup>)
              </p>
              <ul className="font-data mt-4 grid gap-1 text-xs leading-5 text-zinc-600 sm:text-sm">
                <li>i = tipo de interés anual / 12 / 100</li>
                <li>n = plazo en años × 12</li>
                <li>con tipo 0 %: cuota = importe / n</li>
              </ul>
            </div>
            <div className="min-w-0 bg-white p-5 sm:p-6" data-reveal style={d(120)}>
              <p className="font-data text-xs text-zinc-500">DTI</p>
              <p className="font-data mt-3 text-base font-medium leading-7 break-words text-brand">
                DTI = (cuota + otras cuotas) / ingresos netos × 100
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-600">El porcentaje de tus ingresos que se va en deuda cada mes.</p>
            </div>

            <div className="min-w-0 bg-white p-5 sm:p-6" data-reveal style={d(0)}>
              <p className="font-data text-xs text-zinc-500">SEMÁFORO · UMBRALES POR DEFECTO</p>
              <ul className="mt-4 grid gap-3 text-sm">
                {(
                  [
                    ['verde', 'DTI ≤ 30 %'],
                    ['ambar', '30 % < DTI ≤ 40 %'],
                    ['rojo', 'DTI > 40 %'],
                  ] as const
                ).map(([v, rule]) => (
                  <li className="flex items-center justify-between gap-3" key={v}>
                    <ViabBadge v={v} />
                    <span className="font-data text-xs text-zinc-700">{rule}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-zinc-600">Cambia ambos umbrales en Ajustes y se aplican a los nuevos leads.</p>
            </div>
            <div className="min-w-0 bg-white p-5 sm:p-6 lg:col-span-2" data-reveal style={d(120)}>
              <p className="font-data text-xs text-zinc-500">EJEMPLO RESUELTO</p>
              <dl className="font-data mt-3 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2 sm:text-sm">
                {[
                  ['importe', eur(EJ.importe)],
                  ['plazo', `${EJ.plazoAnios} años → n = ${EJ.plazoAnios * 12}`],
                  ['interés', `${EJ.tipoInteres} % → i = ${(i * 100).toFixed(4)} %`],
                  ['ingresos netos', eur(EJ.ingresosNetos)],
                  ['otras cuotas', eur(EJ.otrasCuotas)],
                  ['cuota', eur(r.cuotaMensual)],
                  ['DTI', pct(r.dti)],
                ].map(([k, val]) => (
                  <div className="flex justify-between gap-3 border-b border-dashed border-zinc-200 pb-1" key={k}>
                    <dt className="text-zinc-500">{k}</dt>
                    <dd className="text-right text-zinc-900">{val}</dd>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <dt className="text-zinc-500">viabilidad</dt>
                  <dd>
                    <ViabBadge v={r.viabilidad} />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Integración */}
      <section className="relative scroll-mt-14 overflow-hidden bg-zinc-950 py-16 text-white sm:py-24" id="integracion">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 -left-32 size-[30rem] rounded-full bg-accent/20 blur-3xl" data-parallax="-0.1" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-10">
            <div data-reveal="left">
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Insértalo en tu web en un minuto</h2>
              <p className="mt-3 max-w-prose leading-7 text-white/70">
                Pega el script donde quieras que aparezca el simulador. Crea un iframe aislado, así que ni tus estilos le
                afectan a él ni los suyos a ti, y ajusta su altura en cada paso.
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-brand focus-visible:ring-2 focus-visible:ring-white/60"
                href="/embed"
              >
                Abrir la vista previa en vivo
                <svg aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="grid min-w-0 gap-4">
              {[
                ['Opción A · script (recomendada)', scriptSnippet],
                ['Opción B · iframe de altura fija', iframeSnippet],
              ].map(([t, code], k) => (
                <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900" data-reveal key={t} style={d(k * 130)}>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
                    <p className="font-data truncate text-xs text-white/60">{t}</p>
                    <CopyButton text={code} />
                  </div>
                  <pre className="font-data overflow-x-auto p-4 text-xs leading-6 text-sky-200 sm:text-sm">{code}</pre>
                </div>
              ))}
              <p className="text-sm leading-6 text-white/60" data-reveal style={d(260)}>
                El widget envía su altura a la página anfitriona con <span className="font-data text-white/80">postMessage</span>;
                el script la aplica solo. Con el iframe fijo, el contenido se desplaza dentro del marco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Panel */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal="left">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Los leads llegan ordenados por viabilidad</h2>
            <ul className="mt-6 grid gap-5">
              {[
                ['Panel con filtros', 'Filtra por Verde, Ámbar o Rojo y por rango de fechas; abre el detalle de cada simulación.'],
                ['Exportación CSV', 'Descarga los leads filtrados para tu hoja de cálculo o tu CRM.'],
                ['Webhook y aviso por e-mail', 'Cada lead se envía por POST en JSON a tu URL HTTPS en el momento en que lo solicita.'],
              ].map(([t, d]) => (
                <li className="border-l-2 border-accent pl-4" key={t}>
                  <h3 className="font-display font-semibold">{t}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-brand/5" data-reveal="right">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
              <p className="font-display text-sm font-semibold">Leads</p>
              <p className="font-data text-[11px] text-zinc-400">datos de ejemplo</p>
            </div>
            <ul className="divide-y divide-zinc-100">
              {filas.map(([n, e, c, dt, v], k) => (
                <li className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 sm:grid-cols-[1fr_6rem_4.5rem_5.5rem]" data-reveal key={n} style={d(200 + k * 110)}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{n}</p>
                    <p className="font-data truncate text-[11px] text-zinc-500">{e}</p>
                  </div>
                  <span className="font-data hidden text-right text-xs sm:block">{c}</span>
                  <span className="font-data hidden text-right text-xs sm:block">{dt} %</span>
                  <span className="justify-self-end">
                    <ViabBadge v={v} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand py-14 text-white sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-0 size-[26rem] rounded-full bg-accent/30 blur-3xl" data-parallax="0.15" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between" data-reveal="scale">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Empieza a recibir leads que ya sabes si son financiables</h2>
            <p className="mt-2 text-white/70">Entra en tu panel, ajusta tus umbrales y conecta tu webhook.</p>
          </div>
          <Link
            className="shrink-0 rounded-full bg-white px-7 py-3 text-center text-sm font-medium text-brand transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white/60"
            href="/login"
          >
            Acceder al panel
          </Link>
        </div>
      </section>
    </main>
  );
}
