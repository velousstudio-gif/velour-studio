import { ArrowUpRight, Building2, MonitorSmartphone, Server, Sparkles, Table2, Truck, WifiOff, Wifi } from 'lucide-react';
import { capabilities, ownProducts } from '@/content/portfolio';
import { siteContent } from '@/content/site-content';
import { Reveal, ImageReveal, MotionLink as Link } from '../motion';
import { ServiceLink } from '../service-link';

const ICONS = { ai: Sparkles, airtable: Table2, logistics: Truck, backend: Server, frontend: MonitorSmartphone, enterprise: Building2 };

/** Producto propio + capacidades técnicas: separados de los trabajos de clientes y de los servicios. */
export function Solutions() {
  const product = ownProducts[0];
  return <section id="soluciones" className="solutions section-space" aria-labelledby="solutions-title"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">SOLUCIONES</span><h2 id="solutions-title">Productos propios<br /><em>y capacidades técnicas.</em></h2></div>
      <p>Además de diseñar y desarrollar webs, creamos software. Acá separamos lo que es un producto de Velour de las capacidades con las que construimos soluciones a medida.</p></div>

    <article className="product-feature" aria-labelledby="product-name">
      <Reveal className="product-copy">
        <span className="product-kind">{product.kind.toUpperCase()}</span>
        <h3 id="product-name">{product.name}</h3>
        <p className="product-title">{product.title}</p>
        <p className="section-description">{product.description}</p>
        <ul className="product-highlights">{product.highlights.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="product-availability">{product.availability}</p>
        <ServiceLink service={product.service} className="button">{product.cta}<ArrowUpRight size={17} aria-hidden="true" /></ServiceLink>
      </Reveal>
      <figure className="product-visual"><ImageReveal><LedgerMockup /></ImageReveal><figcaption>{product.name.toUpperCase()} / INTERFAZ ILUSTRATIVA</figcaption></figure>
    </article>

    <div className="capabilities-head"><span className="eyebrow">CAPACIDADES TÉCNICAS</span><p>Lo que podemos construir para tu operación. Cada proyecto se define con alcance y presupuesto antes de empezar.</p></div>
    <ul className="capability-grid">{capabilities.map((item, index) => {
      const Icon = ICONS[item.icon];
      return <li key={item.id} id={`capacidad-${item.id}`}><Reveal className="capability-card" delay={(index % 3) * .06}>
        <span className="capability-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
        <h3>{item.title}</h3><p>{item.description}</p>
        <ul className="capability-examples">{item.examples.map(example => <li key={example}>{example}</li>)}</ul>
        <ServiceLink service={item.service} className="text-link" label={`Consultar por ${item.title}`}>CONSULTAR<ArrowUpRight size={15} aria-hidden="true" /></ServiceLink>
      </Reveal></li>;
    })}</ul>

    <div className="solutions-outro"><p>¿No sabés qué solución necesitás?<br /><em>Contanos el problema y te proponemos el camino.</em></p><Link href={siteContent.links.form} className="button">CONTANOS TU PROYECTO<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </div></section>;
}

/** Interfaz ilustrativa de Velour Contabilidad: formas neutras, sin cifras ni funciones no confirmadas. */
export function LedgerMockup() {
  return <div className="ledger-art" aria-hidden="true">
    <div className="ledger-window">
      <div className="browser-chrome"><span><i /><i /><i /></span><span>Velour Contabilidad</span><span className="ledger-mode"><WifiOff size={10} />Offline</span></div>
      <div className="ledger-body">
        <aside className="ledger-nav"><b>VC</b>{['Resumen', 'Ventas', 'Contabilidad', 'Reportes'].map((item, index) => <span key={item} data-active={index === 1}>{item}</span>)}</aside>
        <div className="ledger-main">
          <div className="ledger-top"><strong>Ventas</strong><span className="ledger-pill">Nueva venta</span></div>
          <div className="ledger-tiles">{['Ventas', 'Cobros', 'Pendientes'].map(label => <div key={label}><small>{label}</small><i /><em /></div>)}</div>
          <div className="ledger-table">{[0, 1, 2, 3, 4].map(row => <div key={row} className="ledger-row"><i style={{ width: `${46 - row * 4}%` }} /><i /><span data-state={row % 3 === 0 ? 'ok' : row % 3 === 1 ? 'wait' : 'draft'} /></div>)}</div>
        </div>
      </div>
    </div>
    <div className="ledger-slip"><span className="ledger-slip-icon"><Wifi size={18} /></span><small>MODALIDAD</small><strong>Offline<br />y online</strong><span className="ledger-slip-line" /><small>La misma herramienta, con o sin conexión.</small></div>
  </div>;
}
