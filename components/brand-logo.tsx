import Link from 'next/link';
import { siteContent } from '@/content/site-content';
import styles from './brand-logo.module.css';

export function Logo() {
  return <Link className={styles.logo} href={siteContent.links.home} aria-label="Velour Studio, inicio"><span className={styles.type} aria-hidden="true"><span className={styles.name}>VELOUR</span><span className={styles.studio}>STUDIO</span></span></Link>;
}
