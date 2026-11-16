'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

import { obtenerUmbrales, solicitarContacto, type DatosWizard } from '@/app/embed/actions';
import { ScaleBar, ViabBadge, viabStyle } from '@/components/semaforo';
import { eur, eur0, pct } from '@/lib/format';
import { calcular, textoViabilidad, type Viabilidad } from '@/lib/scoring';

type F = 'precio' | 'entrada' | 'importe' | 'plazo' | 'interes' | 'ingresos' | 'otras';
type Values = Record<F, string>;
type Errors = Partial<Record<F, string>>;
type Result = { cuotaMensual: number; dti: number; viabilidad: Viabilidad; umbrales: { verde: number; ambar: number } };

const STEPS = [
  { titulo: 'Datos del inmueble', corto: 'Inmueble' },
  { titulo: 'Financiación', corto: 'Financiación' },
  { titulo: 'Tu situación', corto: 'Situación' },
] as const;

const num = (s: string) => (s.trim() === '' ? NaN : Number(s.replace(',', '.')));

function validate(step: number, v: Values): Errors {
  const e: Errors = {};
  const n = (k: F) => num(v[k]);
  if (step === 0) {
    if (!(n('precio') > 0)) e.precio = 'Indica un precio mayor que 0.';
    if (!(n('entrada') >= 0)) e.entrada = 'Indica la entrada (0 si no aportas).';
    else if (n('precio') > 0 && n('entrada') >= n('precio')) e.entrada = 'La entrada debe ser menor que el precio.';
  }
  if (step === 1) {
    if (!(n('importe') > 0)) e.importe = 'Indica un importe mayor que 0.';
    if (!(n('plazo') >= 1 && n('plazo') <= 50)) e.plazo = 'El plazo debe estar entre 1 y 50 años.';
    else if (!Number.isInteger(n('plazo'))) e.plazo = 'Indica el plazo en años completos.';
    if (!(n('interes') >= 0 && n('interes') <= 30)) e.interes = 'El tipo de interés debe estar entre 0 y 30 %.';
  }
  if (step === 2) {
    if (!(n('ingresos') > 0)) e.ingresos = 'Indica tus ingresos netos mensuales (mayor que 0).';
    if (!(n('otras') >= 0)) e.otras = 'Indica tus otras cuotas (0 si no tienes).';
  }
  return e;
}

function NumField(props: {
  id: F;
  label: string;
  unit: string;
  value: string;
  error?: string;
  hint?: string;
  step?: string;
  onChange: (id: F, value: string) => void;
}) {
  const hid = `${props.id}-msg`;
  return (
    <div>
      <label className="text-sm font-medium text-zinc-800" htmlFor={props.id}>
        {props.label}
      </label>
      <div
        className={`mt-1.5 flex items-stretch overflow-hidden rounded-lg border bg-white transition-colors focus-within:ring-2 ${
          props.error ? 'border-red-500 focus-within:ring-red-500/20' : 'border-zinc-300 focus-within:border-accent focus-within:ring-accent/20'
        }`}
      >
        <input
          aria-describedby={hid}
          aria-invalid={props.error ? true : undefined}
          className="font-data min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none"
          id={props.id}
          inputMode="decimal"
          min={0}
          name={props.id}
          onChange={(e) => props.onChange(props.id, e.target.value)}
          step={props.step ?? 'any'}
          type="number"
          value={props.value}
        />
        <span className="font-data flex items-center border-l border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500">{props.unit}</span>
      </div>
      <p className={`mt-1 min-h-5 text-xs ${props.error ? 'text-red-700' : 'text-zinc-500'}`} id={hid} role={props.error ? 'alert' : undefined}>
        {props.error ?? props.hint ?? ''}
      </p>
    </div>
  );
}

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50';
const btnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-accent/40';
const inputCls =
  'mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20';

export function Wizard({ cliente }: { cliente?: string }) {
  const [step, setStep] = useState(0); // 0..2 pasos, 3 resultado
  const [v, setV] = useState<Values>({ precio: '', entrada: '', importe: '', plazo: '25', interes: '', ingresos: '', otras: '0' });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [c, setC] = useState({ nombre: '', email: '', telefono: '' });
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Avisa a la web anfitriona de la altura real del contenido (embed.js ajusta el iframe).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const post = () =>
      window.parent.postMessage({ type: 'mortgage-embed:height', height: Math.ceil(el.getBoundingClientRect().height) }, '*');
    post();
    const ro = new ResizeObserver(post);
    ro.observe(el);
    window.addEventListener('resize', post);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', post);
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    window.parent.postMessage({ type: 'mortgage-embed:height', height: Math.ceil(wrap.current?.getBoundingClientRect().height ?? document.documentElement.scrollHeight) }, '*');
  }, [step]);

  const set = (id: F, value: string) => {
    setV((p) => ({ ...p, [id]: value }));
    setErrors((p) => (p[id] ? { ...p, [id]: undefined } : p));
  };

  const datos = (): DatosWizard => ({
    precioInmueble: num(v.precio),
    entrada: num(v.entrada),
    importe: num(v.importe),
    plazoAnios: num(v.plazo),
    tipoInteres: num(v.interes),
    ingresosNetos: num(v.ingresos),
    otrasCuotas: num(v.otras),
  });

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate(step, v);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < 2) {
      if (step === 0 && v.importe.trim() === '') {
        const dif = num(v.precio) - num(v.entrada);
        if (dif > 0) setV((p) => ({ ...p, importe: String(Math.round(dif * 100) / 100) }));
      }
      setStep(step + 1);
      return;
    }
    setBusy(true);
    let umbrales = { verde: 30, ambar: 40 };
    try {
      umbrales = await obtenerUmbrales(cliente);
    } catch {
      /* se usan los umbrales por defecto */
    }
    const d = datos();
    const r = calcular({ importe: d.importe, plazoAnios: d.plazoAnios, tipoInteres: d.tipoInteres, ingresosNetos: d.ingresosNetos, otrasCuotas: d.otrasCuotas }, umbrales.verde, umbrales.ambar);
    setRes({ ...r, umbrales });
    setBusy(false);
    setStep(3);
  }

  async function onContact(ev: FormEvent) {
    ev.preventDefault();
    if (!consent || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const r = await solicitarContacto(datos(), { ...c, consentimiento: consent }, cliente);
      if (r.ok) setDone(true);
      else setSendError(r.error);
    } catch {
      setSendError('No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.');
    }
    setSending(false);
  }

  const cur = Math.min(step, 2);
  const s = res ? viabStyle[res.viabilidad] : null;

  return (
    <div className="mx-auto w-full max-w-[720px] p-1" ref={wrap}>
      <style>{'html,body{background:transparent!important}'}</style>
      <div className="rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
        <div className="border-b border-zinc-100 px-4 pt-4 pb-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-sm font-semibold text-brand">Viabilidad hipotecaria</p>
            <p className="font-data text-xs text-zinc-500">{step === 3 ? 'Resultado' : `Paso ${step + 1} de 3`}</p>
          </div>
          <ol className="mt-3 grid grid-cols-3 gap-2">
            {STEPS.map((st, i) => (
              <li aria-current={i === cur && step < 3 ? 'step' : undefined} key={st.titulo}>
                <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-zinc-200'}`} />
                <p className={`font-data mt-1.5 truncate text-[11px] ${i === step ? 'font-medium text-brand' : 'text-zinc-500'}`}>
                  {String(i + 1).padStart(2, '0')} {st.corto}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {step < 3 ? (
          <form className="px-4 py-5 sm:px-6" noValidate onSubmit={onSubmit}>
            <h2 className="font-display text-xl font-semibold tracking-tight outline-none" ref={heading} tabIndex={-1}>
              {STEPS[step].titulo}
            </h2>
            <div className="mt-4 grid gap-x-4 sm:grid-cols-2">
              {step === 0 && (
                <>
                  <NumField error={errors.precio} id="precio" label="Precio del inmueble" onChange={set} unit="€" value={v.precio} />
                  <NumField error={errors.entrada} hint="Ahorro que aportas de tu bolsillo." id="entrada" label="Entrada aportada" onChange={set} unit="€" value={v.entrada} />
                </>
              )}
              {step === 1 && (
                <>
                  <div className="sm:col-span-2">
                    <NumField error={errors.importe} hint="Por defecto, precio menos entrada." id="importe" label="Importe solicitado" onChange={set} unit="€" value={v.importe} />
                  </div>
                  <NumField error={errors.plazo} id="plazo" label="Plazo" onChange={set} step="1" unit="años" value={v.plazo} />
                  <NumField error={errors.interes} hint="TIN anual, p. ej. 3,1." id="interes" label="Tipo de interés" onChange={set} unit="%" value={v.interes} />
                </>
              )}
              {step === 2 && (
                <>
                  <NumField error={errors.ingresos} hint="Suma de todos los titulares." id="ingresos" label="Ingresos netos mensuales" onChange={set} unit="€" value={v.ingresos} />
                  <NumField error={errors.otras} hint="Préstamos, tarjetas, pensiones…" id="otras" label="Otras cuotas mensuales" onChange={set} unit="€" value={v.otras} />
                </>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  className={btnSecondary}
                  onClick={() => {
                    setErrors({});
                    setStep(step - 1);
                  }}
                  type="button"
                >
                  Atrás
                </button>
              ) : (
                <span />
              )}
              <button className={btnPrimary} disabled={busy} type="submit">
                {step < 2 ? 'Siguiente' : busy ? 'Calculando…' : 'Calcular viabilidad'}
              </button>
            </div>
          </form>
        ) : (
          res &&
          s && (
            <div className="px-4 py-5 sm:px-6">
              <h2 className="font-display text-xl font-semibold tracking-tight outline-none" ref={heading} tabIndex={-1}>
                Tu resultado
              </h2>
              <div aria-live="polite" className="mt-4 grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
                <div className="bg-white p-4">
                  <p className="text-xs text-zinc-500">Cuota mensual estimada</p>
                  <p className="font-data mt-1 text-3xl font-semibold tracking-tight text-brand">{eur(res.cuotaMensual)}</p>
                  <p className="mt-1 text-xs text-zinc-500">Sistema francés, cuota constante.</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-zinc-500">DTI (endeudamiento)</p>
                  <p className="font-data mt-1 text-3xl font-semibold tracking-tight text-brand">{pct(res.dti)}</p>
                  <p className="mt-1 text-xs text-zinc-500">(cuota + otras cuotas) / ingresos netos.</p>
                </div>
              </div>
              <div className={`mt-4 rounded-lg border-l-4 bg-zinc-50 p-4 ${s.border}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <ViabBadge v={res.viabilidad} />
                  <p className="font-display font-semibold">{textoViabilidad[res.viabilidad].titulo}</p>
                </div>
                <ScaleBar dti={res.dti} umbrales={res.umbrales} viab={res.viabilidad} />
                <p className="text-sm leading-6 text-zinc-700">{textoViabilidad[res.viabilidad].texto(res.dti, res.umbrales)}</p>
              </div>
              <dl className="font-data mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-600 sm:grid-cols-4">
                <div><dt className="text-zinc-400">Importe</dt><dd>{eur0(num(v.importe))}</dd></div>
                <div><dt className="text-zinc-400">Plazo</dt><dd>{num(v.plazo)} años</dd></div>
                <div><dt className="text-zinc-400">Interés</dt><dd>{num(v.interes)} %</dd></div>
                <div><dt className="text-zinc-400">Ingresos</dt><dd>{eur0(num(v.ingresos))}</dd></div>
              </dl>
              {!done && (
                <button className="mt-3 text-sm font-medium text-accent underline-offset-2 hover:underline" onClick={() => setStep(2)} type="button">
                  Modificar mis datos
                </button>
              )}

              <div className="mt-6 border-t border-zinc-100 pt-5">
                {done ? (
                  <div className="rounded-lg bg-emerald-50 p-4 text-emerald-900" role="status">
                    <p className="font-display text-lg font-semibold">Gracias, un asesor te contactará</p>
                    <p className="mt-1 text-sm leading-6">
                      Hemos recibido tu simulación y tus datos de contacto. Un intermediario hipotecario se pondrá en contacto contigo para revisar tu operación.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onContact}>
                    <h3 className="font-display text-lg font-semibold tracking-tight">Recibe tu estudio</h3>
                    <p className="mt-1 text-sm text-zinc-600">Déjanos tus datos y un asesor revisará tu caso sin compromiso.</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="nombre">Nombre</label>
                        <input autoComplete="name" className={inputCls} id="nombre" maxLength={120} name="nombre" onChange={(e) => setC({ ...c, nombre: e.target.value })} required type="text" value={c.nombre} />
                      </div>
                      <div>
                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                        <input autoComplete="email" className={inputCls} id="email" name="email" onChange={(e) => setC({ ...c, email: e.target.value })} required type="email" value={c.email} />
                      </div>
                      <div>
                        <label className="text-sm font-medium" htmlFor="telefono">Teléfono</label>
                        <input autoComplete="tel" className={inputCls} id="telefono" name="telefono" onChange={(e) => setC({ ...c, telefono: e.target.value })} required type="tel" value={c.telefono} />
                      </div>
                    </div>
                    <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-zinc-700">
                      <input checked={consent} className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]" name="consentimiento" onChange={(e) => setConsent(e.target.checked)} required type="checkbox" />
                      <span>Acepto que mis datos y los resultados de esta simulación sean tratados y cedidos a intermediarios hipotecarios para que me contacten (RGPD)</span>
                    </label>
                    {sendError && (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{sendError}</p>
                    )}
                    <div className="mt-4">
                      <button className={`${btnPrimary} w-full sm:w-auto`} disabled={!consent || sending} type="submit">
                        {sending ? 'Enviando…' : 'Solicitar contacto'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )
        )}
      </div>
      <p className="font-data px-1 pt-2 text-center text-[11px] text-zinc-400">Simulación orientativa, no vinculante.</p>
    </div>
  );
}
