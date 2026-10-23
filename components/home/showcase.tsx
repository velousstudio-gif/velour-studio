import { ArrowUpRight, Check } from 'lucide-react';
import { homeContent } from '@/content/home-content';
import { siteContent } from '@/content/site-content';
import { ownProducts } from '@/content/portfolio';
import { visibleClientWorks } from '@/lib/portfolio-preview';
import { MotionLink as Link } from '../motion';
import { ServiceLink } from '../service-link';
import { Reveal } from '../motion';
import { DeviceSlider, type Slide } from './device-slider';
import { ScrollRise3D, Tilt3D } from '../fx';

const desktopSlides = (): Slide[] => visibleClientWorks().filter(w => w.screenshot).map(w => ({ slug: w.slug, name: w.name, src: w.screenshot! }));
const mobileSlides = (): Slide[] => visibleClientWorks().filter(w => w.screenshotMobile).map(w => ({ slug: w.slug, name: w.name, src: w.screenshotMobile! }));

/** Webs de alto impacto: texto a la izquierda, tablet con trabajos reales sobre un círculo dorado. */
export function WebShowcase() {
  const copy = homeContent.webShowcase;
  return <section id="servicios" className="ix-light ix-split-section" aria-labelledby="web-title"><div className="container ix-split">
    <Reveal className="ix-split-copy">
      <span className="ix-label">{copy.label}</span>
      <h2 id="web-title">{copy.title} <span className="ix-gold">{copy.accent}</span></h2>
      <p className="ix-subhead">{copy.subhead}</p>
      <p className="ix-body"><strong>{copy.bodyStrong}</strong> {copy.body}</p>
      <div className="ix-actions ix-actions-left"><ServiceLink service="Página web" className="ix-btn ix-btn-gold">{copy.cta}<ArrowUpRight size={17} aria-hidden="true" /></ServiceLink></div>
    </Reveal>
    <div className="ix-split-visual"><span className="ix-blob" aria-hidden="true" /><ScrollRise3D><Tilt3D><DeviceSlider slides={desktopSlides()} device="tablet" sizes="(max-width: 1000px) 90vw, 620px" /></Tilt3D></ScrollRise3D></div>
  </div></section>;
}

/** Tienda online y sistemas: celular al centro con beneficios a ambos lados. */
export function CommerceShowcase() {
  const copy = homeContent.commerce;
  const half = Math.ceil(copy.features.length / 2);
  const Feature = ({ item, i }: { item: (typeof copy.features)[number]; i: number }) => <li className="ix-feature"><Reveal delay={i * .08}><span className="ix-ring" aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></Reveal></li>;
  return <section id="ecommerce" className="ix-light" aria-labelledby="commerce-title"><div className="container">
    <Reveal className="ix-heading-center"><span className="ix-label">{copy.label}</span><h2 id="commerce-title">{copy.title}</h2><p><strong>{copy.leadStrong}</strong> {copy.lead}</p></Reveal>
    <div className="ix-commerce">
      <ul className="ix-features">{copy.features.slice(0, half).map((item, i) => <Feature key={item.title} item={item} i={i} />)}</ul>
      <div className="ix-commerce-phone"><ScrollRise3D from={40}><Tilt3D max={14}><div className="ix-float"><DeviceSlider slides={mobileSlides()} device="phone" sizes="300px" interval={3600} /></div></Tilt3D></ScrollRise3D></div>
      <ul className="ix-features">{copy.features.slice(half).map((item, i) => <Feature key={item.title} item={item} i={i} />)}</ul>
    </div>
    <div className="ix-actions"><ServiceLink service="E-commerce" className="ix-btn ix-btn-gold">{copy.primary}<ArrowUpRight size={17} aria-hidden="true" /></ServiceLink><Link className="ix-btn ix-btn-gold-soft" href={siteContent.links.form}>{copy.secondary}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
  </div></section>;
}

/** Software a medida: texto + laptop con plataformas reales; incluye el producto propio. */
export function SoftwareShowcase() {
  const copy = homeContent.software;
  const product = ownProducts[0];
  const slides = desktopSlides().filter(slide => copy.slugs.includes(slide.slug));
  return <section id="automation" className="ix-light ix-split-section" aria-labelledby="software-title"><div className="container ix-split">
    <Reveal className="ix-split-copy">
      <span className="ix-label">{copy.label}</span>
      <h2 id="software-title">{copy.title} <span className="ix-gold">{copy.accent}</span></h2>
      <p className="ix-body"><strong>{copy.bodyStrong}</strong> {copy.body}</p>
      <ul className="ix-checks">{copy.points.map(point => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
      <div className="ix-actions ix-actions-left"><ServiceLink service="Software a medida" className="ix-btn ix-btn-gold">{copy.cta}<ArrowUpRight size={17} aria-hidden="true" /></ServiceLink></div>
      <div id="soluciones" className="ix-product"><span>{product.kind.toUpperCase()}</span><strong>{product.name}</strong><p>{product.title}</p><ServiceLink service={product.service} className="ix-text-link">{product.cta}<ArrowUpRight size={15} aria-hidden="true" /></ServiceLink></div>
    </Reveal>
    <div className="ix-split-visual ix-split-visual-left"><span className="ix-blob" aria-hidden="true" /><ScrollRise3D from={38}><Tilt3D><DeviceSlider slides={slides} device="laptop" sizes="(max-width: 1000px) 90vw, 640px" interval={4800} /></Tilt3D></ScrollRise3D></div>
  </div></section>;
}
