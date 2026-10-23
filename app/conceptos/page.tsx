import type { Metadata } from 'next';
import { Header, Footer } from '@/components/site';
import { WhatsAppFloat } from '@/components/whatsapp-float';
import { ConceptGallery } from '@/components/concept-gallery';
import { concepts, conceptGroups } from '@/content/concepts';

export const metadata: Metadata = {
  title: 'Conceptos de diseño',
  description: `${concepts.length} conceptos de diseño web por rubro creados por Velour Studio con marcas ficticias, para inspirar tu proyecto.`,
  alternates: { canonical: '/conceptos' },
};

export default function ConceptsPage() {
  return <><Header /><main className="ix-home ix-concepts-page" id="inicio">
    <section className="ix-dark ix-concepts-hero"><div className="container ix-heading-center ix-heading-dark">
      <span className="ix-label">CONCEPTOS DE DISEÑO</span>
      <h1>{concepts.length} ideas para <span className="ix-gold">tu rubro</span></h1>
      <p><strong>Diseños de muestra creados por el estudio con marcas ficticias.</strong> No son clientes ni trabajos entregados: sirven para que veas estilos y elijas un punto de partida para tu web.</p>
    </div></section>
    <section className="ix-light"><div className="container"><ConceptGallery concepts={concepts} groups={conceptGroups} /></div></section>
  </main><Footer /><WhatsAppFloat /></>;
}
