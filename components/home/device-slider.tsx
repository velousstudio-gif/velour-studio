'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export type Slide = { slug: string; name: string; src: string };

/**
 * Dispositivo (tablet, celular o laptop) que rota capturas reales de trabajos.
 * Se pausa al pasar el mouse y no rota con "movimiento reducido".
 */
export function DeviceSlider({ slides, device, sizes, interval = 4200, priority = false }: { slides: Slide[]; device: 'tablet' | 'phone' | 'laptop'; sizes: string; interval?: number; priority?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex(current => (current + 1) % slides.length), interval);
    return () => window.clearInterval(id);
  }, [paused, slides.length, interval]);
  if (slides.length === 0) return null;
  return <div className="ix-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className={`ix-device ix-device-${device}`}>
      {device === 'phone' && <span className="ix-notch" aria-hidden="true" />}
      <div className="ix-device-screen">{slides.map((slide, i) => <Image key={slide.slug} src={slide.src} alt={i === index ? `Sitio de ${slide.name}` : ''} aria-hidden={i !== index} fill sizes={sizes} priority={priority && i === 0} data-active={i === index} />)}</div>
      {device === 'laptop' && <span className="ix-laptop-base" aria-hidden="true" />}
    </div>
    {slides.length > 1 && <div className="ix-dots" role="group" aria-label="Elegir trabajo">{slides.map((slide, i) => <button key={slide.slug} type="button" aria-label={`Ver ${slide.name}`} aria-pressed={i === index} onClick={() => { setIndex(i); setPaused(true); }} />)}</div>}
  </div>;
}
