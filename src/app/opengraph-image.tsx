import { ImageResponse } from 'next/og';

export const alt = 'HipoScore · Scoring hipotecario embebible';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#0b2a5b', color: 'white' }}>
        <div style={{ fontSize: 40, color: '#9db8e8' }}>HipoScore</div>
        <div style={{ fontSize: 74, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>Scoring hipotecario en tu propia web</div>
        <div style={{ fontSize: 34, marginTop: 32, color: '#c9d7f2' }}>Cuota, DTI y semáforo de riesgo. Leads con consentimiento RGPD.</div>
        <div style={{ display: 'flex', marginTop: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: '#22c55e', marginRight: 16 }} />
          <div style={{ width: 36, height: 36, borderRadius: 18, background: '#f59e0b', marginRight: 16 }} />
          <div style={{ width: 36, height: 36, borderRadius: 18, background: '#ef4444' }} />
        </div>
      </div>
    ),
    size,
  );
}
