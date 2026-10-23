'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { embedUrl } from '@/content/vsl';
import { useLocale } from './locale';

/** Reproductor del VSL: carga YouTube/Vimeo recién al tocar "play" (página más rápida y sin cookies de terceros antes). */
export function VslVideo({ url, poster, title }: { url: string; poster: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const en = useLocale() === 'en';
  const embed = embedUrl(url);
  if (!embed) return <video className="vsl-frame-media" src={url} poster={poster} controls playsInline preload="metadata" />;
  if (playing) return <iframe className="vsl-frame-media" src={embed} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />;
  return <button type="button" className="vsl-poster" onClick={() => setPlaying(true)} aria-label={`${en ? 'Play video' : 'Reproducir video'}: ${title}`}>
    <Image src={poster} alt="" fill sizes="(max-width: 900px) 100vw, 900px" priority />
    <span className="vsl-play" aria-hidden="true"><Play size={34} fill="currentColor" /></span>
  </button>;
}
