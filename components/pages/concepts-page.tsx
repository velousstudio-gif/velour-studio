import { Header, Footer } from '@/components/site';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { ConceptGallery } from '@/components/concept-gallery';
import { concepts, conceptGroups } from '@/content/concepts';
import { getDict, groupLabel, localizeConcept, type Locale } from '@/content/i18n';

export function ConceptsPageView({ locale }: { locale: Locale }) {
  const t = getDict(locale).ui.concepts;
  return <><Header /><main className="ix-home ix-concepts-page" id="inicio">
    <section className="ix-dark ix-concepts-hero"><div className="container ix-heading-center ix-heading-dark">
      <span className="ix-label">{getDict(locale).home.concepts.label}</span>
      <h1>{concepts.length} {t.pageTitle} <span className="ix-gold">{t.pageAccent}</span></h1>
      <p><strong>{t.pageStrong}</strong> {t.pageText}</p>
    </div></section>
    <section className="ix-light"><div className="container"><ConceptGallery concepts={concepts.map(concept => localizeConcept(locale, concept))} groups={conceptGroups.map(value => ({ value, label: groupLabel(locale, value) }))} /></div></section>
  </main><Footer locale={locale} /><WhatsAppFloat /></>;
}
