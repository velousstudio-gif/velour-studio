import Image from 'next/image';
import type { ClientWork } from '@/content/portfolio';

/** Marco de navegador con la captura real del sitio publicado. */
export function BrowserShot({ work, priority = false, sizes = '(max-width: 1200px) 100vw, 1200px' }: { work: ClientWork; priority?: boolean; sizes?: string }) {
  if (!work.screenshot) return null;
  return <div className="browser-shot">
    <div className="browser-shot-bar" aria-hidden="true"><span><i /><i /><i /></span><span className="browser-shot-url">{work.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span><span /></div>
    <div className="browser-shot-screen"><Image src={work.screenshot} alt={work.name} fill sizes={sizes} priority={priority} quality={90} /></div>
  </div>;
}

/**
 * Visual de un trabajo: la captura real si existe; si no, una composición genérica por tipo de proyecto
 * (sin logos, capturas ni datos del cliente).
 */
export function ClientWorkVisual({ work, label = 'CAPTURA DEL SITIO PUBLICADO' }: { work: ClientWork; label?: string }) {
  if (work.screenshot) return <div className="work-art work-art-shot"><BrowserShot work={work} /><span className="art-context">{label}</span></div>;
  return <div className={`work-art work-art-${work.mockup}`} aria-hidden="true">
    <div className="work-window">
      <div className="browser-chrome"><span><i /><i /><i /></span><span>{work.category} · {work.sector}</span><span /></div>
      <div className="work-screen">{SCREENS[work.mockup]}</div>
    </div>
    <span className="art-context">{work.category.toUpperCase()} / COMPOSICIÓN ILUSTRATIVA</span>
  </div>;
}

const SCREENS: Record<ClientWork['mockup'], React.ReactNode> = {
  gastronomy: <div className="ws-gastro">
    <div className="ws-hero"><small>CARTA DIGITAL</small><b>Tablas, brunch<br /><em>y catering</em></b><span className="ws-btn">Ver menú</span></div>
    <div className="ws-cards">{['Tablas', 'Restaurante', 'Saludable'].map((label, index) => <div key={label} data-tone={index}><i /><small>{label}</small></div>)}</div>
    <div className="ws-form"><small>RESERVA</small><span /><span /><span className="ws-btn ws-btn-wide">Enviar por WhatsApp</span></div>
  </div>,
  recruitment: <div className="ws-board">
    {['Postulados', 'En revisión', 'Aprobados', 'Reserva'].map((column, index) => <div key={column} className="ws-col"><small>{column}</small>{Array.from({ length: 4 - (index % 3) }, (_, card) => <div key={card} className="ws-card"><i /><span /></div>)}</div>)}
  </div>,
  ads: <div className="ws-tiers">
    <div className="ws-tiers-head"><small>PLANES</small><b>Elegí tu<br /><em>nivel</em></b></div>
    <div className="ws-tiers-row">{['Inicial', 'Avanzado', 'Completo'].map((tier, index) => <div key={tier} data-featured={index === 1}><small>{tier}</small><i /><span /><span /><span className="ws-btn" /></div>)}</div>
  </div>,
  operations: <div className="ws-ops">
    <aside><small>OPERACIÓN</small>{['Campañas', 'Entregas', 'Historial', 'Auditoría'].map((item, index) => <span key={item} data-active={index === 1}>{item}</span>)}</aside>
    <div className="ws-queue"><small>COLA DE REVISIÓN</small>{[0, 1, 2].map(row => <div key={row} className="ws-review"><i /><span /><b data-state={row === 0 ? 'ok' : row === 1 ? 'wait' : 'no'} /></div>)}<div className="ws-actions"><span>Rechazar</span><span>Aprobar</span></div></div>
  </div>,
};
