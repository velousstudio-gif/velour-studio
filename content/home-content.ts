import { siteContent } from './site-content';

// Locale dictionaries can be added here without changing section components.
// EN remains unavailable until its copy, routes and metadata are translated.
export const localeConfig = { current: 'es', available: ['es'], planned: ['en'] } as const;

const es = {
  quote: 'COTIZAR PROYECTO', more: 'VER MÁS', includes: 'INCLUYE',
  hero: {
    eyebrow: 'ESTUDIO DE DISEÑO Y DESARROLLO WEB',
    title: 'Webs y sistemas que',
    accent: 'convierten visitas en clientes.',
    description: 'Diseñamos páginas web, tiendas online y software a medida para negocios que quieren verse profesionales, generar confianza y vender más fácil.',
    primary: 'QUIERO COTIZAR MI PROYECTO', secondary: 'VER TRABAJOS', caption: 'Diseño que se ve. Tecnología que funciona.',
    visualLabel: 'MAISON COMMERCE / EXPLORACIÓN CONCEPTUAL', clientsLabel: 'Trabajos recientes',
  },
  trust: ['Diseño 100% a medida', 'Adaptada a celulares', 'Presupuesto sin compromiso'],
  serviceGrid: {
    label: 'QUÉ HACEMOS', title: 'Todo lo que tu negocio necesita', accent: 'para vender online.',
    description: 'Elegí por dónde empezar. Cada proyecto se define con alcance y presupuesto claros antes de comenzar.',
    primary: 'PEDIR PRESUPUESTO SIN COMPROMISO', secondary: 'VER TRABAJOS',
    items: [
      { id: 'web-commerce', icon: 'web', service: 'Página web', title: 'Páginas web', description: 'Sitios a medida que explican qué hacés, generan confianza y facilitan el contacto.', points: ['Diseño desde cero', 'Rápida y adaptada a celulares', 'Formularios y WhatsApp conectados'] },
      { id: 'landing-page', icon: 'landing', service: 'Landing page', title: 'Landing pages', description: 'Una página enfocada en una sola acción, ideal para campañas y lanzamientos.', points: ['Mensaje claro y directo', 'Pensada para anuncios', 'Medición de consultas'] },
      { id: 'ecommerce', icon: 'shop', service: 'E-commerce', title: 'Tiendas online', description: 'E-commerce y Shopify listos para vender, con un catálogo fácil de administrar.', points: ['Catálogo y stock', 'Pagos y envíos', 'Compra simple en el celular'] },
      { id: 'branding', icon: 'brand', service: 'Branding', title: 'Branding', description: 'Una identidad visual clara y consistente, desde el logo hasta cada punto de contacto.', points: ['Logo e identidad', 'Paleta y tipografías', 'Aplicaciones digitales'] },
      { id: 'automation', icon: 'automation', service: 'Automatización / IA', title: 'Automatización e IA', description: 'Conectamos tus herramientas y automatizamos tareas repetitivas para ganar tiempo.', points: ['Flujos entre apps', 'Asistentes con IA', 'Menos carga manual'] },
      { id: 'development', icon: 'software', service: 'Software a medida', title: 'CRM y software a medida', description: 'Sistemas internos adaptados a cómo trabaja tu equipo: clientes, pedidos y reportes.', points: ['CRM y seguimiento comercial', 'Paneles por rol', 'Integraciones con tus sistemas'] },
    ],
  } as const,
  technology: {
    title: 'TRABAJAMOS CON',
    brands: [
      { name: 'Shopify', icon: 'shopify' }, { name: 'HTML', symbol: 'HTML' },
      { name: 'CSS', symbol: 'CSS' }, { name: 'JavaScript', symbol: 'JS' },
      { name: 'TypeScript', symbol: 'TS' }, { name: 'Next.js', icon: 'nextdotjs' },
      { name: 'GSAP', icon: 'gsap' }, { name: 'Meta', icon: 'meta' },
      { name: 'Figma', icon: 'figma' }, { name: 'Google', icon: 'google' },
      { name: 'GitHub', icon: 'github' }, { name: 'OpenAI', icon: 'openai' },
      { name: 'Claude', icon: 'claude' }, { name: 'Vercel', icon: 'vercel' },
    ],
  },
  services: [
    {
      id: 'web-commerce', number: '01', label: '¿QUÉ HACEMOS?', title: 'Diseño y desarrollo web',
      description: 'Creamos sitios web desde cero, diseñados para comunicar mejor tu negocio, generar confianza y facilitar que tus clientes contacten o compren.',
      details: 'Definimos la estructura, diseñamos cada pantalla y construimos una web a medida. Organizamos contenido, navegación y funcionalidades para que cada decisión tenga un propósito.',
      capabilities: [
        { id: 'pagina-web', title: 'PÁGINA WEB', description: 'Diseño personalizado desde cero.' },
        { id: 'landing-page', title: 'LANDING PAGE', description: 'Una página enfocada en una acción.' },
        { id: 'ecommerce', title: 'SHOPIFY', description: 'Tienda online preparada para vender.' },
        { id: 'responsive', title: '100% RESPONSIVE', description: 'Optimizada para cualquier pantalla.' },
      ],
      visual: 'web', caption: 'PRESENCIA DIGITAL / EXPLORACIONES DE DISEÑO',
    },
    {
      id: 'automation', number: '02', label: '¿QUÉ HACEMOS?', title: 'Automatización y desarrollo a medida',
      description: 'Creamos herramientas y automatizaciones que ayudan a organizar procesos, reducir tareas manuales y conectar plataformas.',
      details: 'Partimos de cómo trabajás hoy. Definimos qué conviene conectar o desarrollar y construimos una solución que se adapte a tu operación, con prioridades y alcance claros.',
      capabilities: [
        { id: 'crm', title: 'CRM', description: 'Gestión de clientes y oportunidades.' },
        { id: 'workflows', title: 'AUTOMATION', description: 'Procesos y workflows.' },
        { id: 'integraciones', title: 'INTEGRACIONES', description: 'APIs y herramientas conectadas.' },
        { id: 'development', title: 'CUSTOM DEVELOPMENT', description: 'Sistemas adaptados al negocio.' },
      ],
      visual: 'automation', caption: 'UNA IDEA CONECTADA / INTERFAZ CONCEPTUAL',
    },
  ],
  branding: { label: 'BRANDING', title: 'Una identidad que también habla por vos.', description: siteContent.services.branding.description },
  process: {
    label: 'CÓMO TRABAJAMOS', title: 'Qué pasa después', accent: 'de que nos escribís.',
    description: 'Queremos que siempre sepas qué estamos haciendo, qué sigue y cuándo necesitamos tu aprobación.',
    visualTitle: 'De la intención', visualAccent: 'a lo tangible.',
    visualNote: 'Una idea clara. Cada decisión, en su lugar.',
    caption: 'ESTRATEGIA / DISEÑO / DESARROLLO',
  },
  portfolio: {
    label: 'PORTFOLIO', title: 'Proyectos que', accent: 'hablan por nosotros.',
    projects: [
      { slug: 'fashion-store', title: 'Una tienda diseñada para vender sin complicaciones.' },
      { slug: 'recruitment-platform', title: 'Una experiencia digital creada alrededor del negocio.' },
    ],
    view: 'VER PROYECTO', demo: 'CONCEPTO / NO ES UN CASO DE CLIENTE',
    conceptsLabel: 'EXPLORACIONES CONCEPTUALES DEL ESTUDIO',
    clientIntro: 'Sitios y plataformas que diseñamos y desarrollamos para nuestros clientes, publicados con su autorización.',
    outro: '¿Querés que tu proyecto sea el próximo?', cta: 'CONTANOS TU PROYECTO',
  },
  cta: {
    label: '¿YA SABÉS QUÉ NECESITÁS?', title: 'Tu proyecto puede', accent: 'empezar con una conversación.',
    description: 'Contanos qué querés construir y te ayudamos a definir alcance, presupuesto y próximos pasos.',
    primary: 'COTIZAR MI PROYECTO', secondary: 'ESCRIBIR POR WHATSAPP',
    notes: ['SIN COMPROMISO', 'PRESUPUESTO DEFINIDO ANTES DE COMENZAR', 'ATENCIÓN DIRECTA'],
  },
  faq: { label: 'PREGUNTAS FRECUENTES', title: 'Todo lo que', accent: 'necesitás saber.', description: 'Respondemos las dudas más comunes antes de empezar un proyecto.' },
  question: { label: '¿TODAVÍA TENÉS DUDAS?', title: 'Preguntanos', accent: 'lo que quieras.', typeLabel: 'Quiero dejar', description: 'Contanos tu pregunta, comentario o sugerencia. Nos gusta empezar por escuchar.' },
  diagnostic: { title: 'Contanos qué', accent: 'necesitás construir.', description: 'Completá estas preguntas y tendremos contexto suficiente para preparar una propuesta.' },
  footer: {
    description: 'Estudio digital especializado en diseño web, e-commerce, branding y soluciones digitales.',
    services: [
      ['Web Design', 'webService'], ['Landing Pages', 'landingService'], ['Shopify', 'ecommerceService'],
      ['E-commerce', 'ecommerceService'], ['Branding', 'branding'], ['Automation', 'automationService'], ['Development', 'developmentService'],
    ] as const satisfies readonly (readonly [string, keyof typeof siteContent.links])[],
    company: [['Trabajos', 'works'], ['Proceso', 'process'], ['Contacto', 'contact'], ['FAQ', 'faq']] as const satisfies readonly (readonly [string, keyof typeof siteContent.links])[],
    servicesLabel: 'SERVICIOS', companyLabel: 'EMPRESA', contactLabel: 'CONTACTO',
    quote: 'Cotizar proyecto', copyright: '© 2026 Velour Studio.', languagePending: 'Versión en inglés en preparación',
  },
};

export const homeLocales = { es };
export const homeContent = homeLocales[localeConfig.current];
