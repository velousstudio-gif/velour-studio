/**
 * PÁGINA DE ANUNCIOS (/vsl).
 * Para poner el video: subilo a YouTube (puede ser "No listado") o Vimeo y pegá el link en `videoUrl`.
 * También acepta un .mp4 subido a /public (ej. '/vsl/video.mp4'). Vacío = se muestran los trabajos reales en su lugar.
 */
export const vsl = {
  videoUrl: '',
  videoPoster: '/trabajos/sobretablas.webp',
  kicker: 'PARA NEGOCIOS QUE QUIEREN VENDER MÁS ONLINE',
  title: 'Tu negocio merece una web', accent: 'que traiga clientes.',
  subtitle: 'Mirá el video y descubrí cómo diseñamos webs, tiendas online y sistemas que convierten visitas en consultas.',
  subtitleNoVideo: 'Diseñamos webs, tiendas online y sistemas que convierten visitas en consultas. Mirá algunos trabajos y pedí tu presupuesto.',
  noVideoTitle: 'Mirá algunos de nuestros trabajos',
  cta: 'QUIERO MI PRESUPUESTO SIN COMPROMISO',
  benefits: [
    { title: 'Diseño 100% a medida', text: 'Nada de plantillas: tu web se diseña desde cero para tu negocio.' },
    { title: 'Pensada para vender', text: 'Mensajes claros, botones visibles y formularios que llegan a tu equipo.' },
    { title: 'Lista para celulares', text: 'Rápida y cómoda en cualquier pantalla, donde está tu cliente.' },
  ],
  steps: [
    { title: 'Completás el formulario', text: 'Te lleva menos de un minuto.' },
    { title: 'Te contactamos', text: 'Conversamos sobre tu negocio y lo que necesitás.' },
    { title: 'Recibís tu propuesta', text: 'Alcance, plazos y presupuesto claros, sin compromiso.' },
  ],
  form: {
    label: 'PEDÍ TU PRESUPUESTO', title: 'Dejanos tus datos y te contactamos',
    note: 'Sin compromiso. Te respondemos personalmente.',
    defaultMessage: 'Quiero que me contacten por un presupuesto (enviado desde la página /vsl).',
    submit: 'QUIERO QUE ME CONTACTEN',
  },
  faq: [
    { q: '¿Cuánto cuesta?', a: 'Depende del alcance. Después de conocer tu proyecto te enviamos un presupuesto claro antes de empezar.' },
    { q: '¿Cuánto tarda?', a: 'Una web promedio lleva algunas semanas. Te damos un plazo concreto en la propuesta.' },
    { q: '¿Puedo administrarla yo?', a: 'Sí. Te dejamos todo configurado y te mostramos cómo actualizar lo que necesites.' },
  ],
  thanks: {
    title: '¡Listo! Recibimos tus datos', text: 'Te vamos a contactar a la brevedad para conversar sobre tu proyecto.',
    back: 'VOLVER AL SITIO', whatsapp: 'ESCRIBIR POR WHATSAPP',
  },
};

/** Convierte un link de YouTube/Vimeo en su URL embebible; devuelve null si es un archivo de video o está vacío. */
export function embedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return null;
}
