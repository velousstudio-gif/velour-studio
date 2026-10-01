'use client';

import { MotionAnchor, useMotionPreferences } from './motion';
import { siteContent } from '@/content/site-content';
import styles from './brand-logo.module.css';

/** Shared editorial wordmark. Inherits the foreground color of header or footer. */
export function Logo({ intro = false }: { intro?: boolean }) {
  const { reduced } = useMotionPreferences();
  return (
    <MotionAnchor className={`${styles.logo} motion-reveal`} href={siteContent.links.home} aria-label="Velour Studio, inicio"
      data-wordmark={intro || undefined} initial={reduced || intro ? false : { opacity: 0 }} whileInView={intro ? undefined : { opacity: 1 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : .5 }}>
      <span className={styles.type} aria-hidden="true">
        <span className={styles.name}>VELOUR</span>
        <span className={styles.studio}>STUDIO</span>
      </span>
    </MotionAnchor>
  );
}
