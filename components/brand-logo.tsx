import { siteContent } from '@/content/site-content';
import styles from './brand-logo.module.css';

/** Shared editorial wordmark. Inherits the foreground color of header or footer. */
export function Logo() {
  return (
    <a className={styles.logo} href={siteContent.links.home} aria-label="Velour Studio, inicio">
      <span className={styles.type} aria-hidden="true">
        <span className={styles.name}>VELOUR</span>
        <span className={styles.studio}>STUDIO</span>
      </span>
    </a>
  );
}
