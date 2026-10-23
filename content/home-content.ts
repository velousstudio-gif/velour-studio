import { siteContent } from './site-content';

// Locale dictionaries can be added here without changing section components.
// EN remains unavailable until its copy, routes and metadata are translated.
export const localeConfig = { current: 'es', available: ['es'], planned: ['en'] } as const;

const es = {
  quote: 'COTIZAR PROYECTO', more: 'VER MÁS', includes: 'INCLUYE',
  hero: {
    eyebrow: 'DISEÑO WEB, TIENDAS ONLINE Y SOFTWARE',
    title: 'Webs y sistemas que',
    accent: 'hacen crecer tu negocio',
    leadStrong: 'Páginas web, tiendas online y software a medida',
    lead: 'para que tu empresa se vea profesional, consiga más clientes y venda más fácil.',
    primary: 'QUIERO COTIZAR MI PROYECTO', whatsapp: 'HABLAR CON UN EXPERTO', secondary: 'VER TRABAJOS',
    caption: 'Diseño que se ve. Tecnología que funciona.', visualLabel: 'MAISON COMMERCE / EXPLORACIÓN CONCEPTUAL',
    clientsLabel: 'Trabajos realizados',
    decoA: 'DISEÑO', decoB: 'DESARROLLO', decoC: 'ESTRATEGIA', decoD: 'RESULTADOS', side: 'VELOUR STUDIO · DISEÑO WEB & SOFTWARE',
  },
  trust: ['Diseño 100% a medida', 'Adaptada a celulares', 'Presupuesto sin compromiso'],
  webShowcase: {
    label: 'PROYECTOS REALES, PUBLICADOS CON AUTORIZACIÓN',
    title: 'Webs de alto impacto que', accent: 'transmiten confianza y venden',
    subhead: 'Mejor imagen. Más consultas. Más clientes.',
    bodyStrong: 'Diseñamos sitios que explican claramente qué hacés, generan confianza y convierten visitas en consultas.',
    body: 'Cada decisión, del diseño al contenido, está pensada para tu negocio. Contanos tu idea y te proponemos el camino, con alcance y presupuesto claros.',
    cta: 'CHARLEMOS DE TU PROYECTO',
  },
  commerce: {
    label: 'TIENDAS ONLINE Y SISTEMAS',
    title: '¿Querés vender online o automatizar tu negocio?',
    leadStrong: 'Tiendas y sistemas diseñados para que vendas más',
    lead: 'con procesos simples y tecnología que trabaja por vos.',
    features: [
      { title: 'Cobrá online', text: 'Checkout simple con los medios de pago que usan tus clientes.' },
      { title: 'Catálogo y stock', text: 'Cargá productos, variantes y precios sin planillas eternas.' },
      { title: 'Pensada para el celular', text: 'La mayoría compra desde el teléfono: cada pantalla está optimizada.' },
      { title: 'Diseño a medida', text: 'Cada elemento guía al usuario y simplifica la compra.' },
      { title: 'Todo en un panel', text: 'Pedidos, clientes y consultas organizados en un solo lugar.' },
      { title: 'Automatizaciones', text: 'Avisos, seguimientos y tareas repetitivas que se hacen solas.' },
    ],
    primary: 'QUIERO UNA TIENDA ONLINE', secondary: 'QUIERO HABLAR CON UN EXPERTO',
  },
  software: {
    label: 'SOFTWARE A MEDIDA Y AUTOMATIZACIÓN',
    title: 'Convertimos procesos manuales en', accent: 'sistemas que trabajan por vos',
    bodyStrong: 'Plataformas, CRM y portales a medida',
    body: 'para ordenar tu operación: clientes, pedidos, equipos y reportes en un solo lugar, con accesos por rol.',
    points: ['CRM y seguimiento comercial', 'Portales para clientes y equipos', 'Integraciones y automatizaciones con IA'],
    cta: 'QUIERO UN SISTEMA A MEDIDA',
    slugs: ['zamudio-clipping', 'prime-hiring-solutions'],
  },
  serviceList: {
    label: 'SOLUCIONES DIGITALES',
    title: 'Diseño web y software', accent: 'para tu empresa.',
    description: 'Te acompañamos con diseño, desarrollo y tecnología. Elegí el servicio y empezamos por un presupuesto sin compromiso.',
    link: 'CONOCÉ NUESTROS TRABAJOS',
    items: [
      { id: 'web-commerce', service: 'Página web', title: 'Diseño web', text: 'Sitios profesionales, rápidos y a medida.' },
      { id: 'landing-page', service: 'Landing page', title: 'Landing pages', text: 'Una página enfocada en convertir tus campañas.' },
      { id: undefined, service: 'E-commerce', title: 'Tiendas online', text: 'E-commerce y Shopify listos para vender.' },
      { id: 'branding', service: 'Branding', title: 'Branding', text: 'Identidad visual clara y consistente.' },
      { id: undefined, service: 'Automatización / IA', title: 'Automatización e IA', text: 'Flujos y asistentes que ahorran tiempo.' },
      { id: 'development', service: 'Software a medida', title: 'CRM y software a medida', text: 'Sistemas adaptados a cómo trabaja tu equipo.' },
    ],
  } as const,
  contactIntro: {
    label: 'ENVIANOS UN MENSAJE',
    title: 'Contanos tu proyecto y pedí tu presupuesto', accent: 'sin compromiso',
    bodyStrong: 'Te respondemos personalmente.',
    body: 'Entendemos tu negocio y tus objetivos, te proponemos acciones concretas y armamos una propuesta a medida.',
    cta: 'QUIERO MI PRESUPUESTO',
  },
  formSection: { label: 'HABLEMOS DE TU PROYECTO', title: 'Contanos qué necesitás', direct: 'Contacto directo', directText: 'Elegí el canal que te quede más cómodo.' },
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
    label: 'TRABAJOS REALIZADOS', title: 'Proyectos que hablan por sí solos', accent: '', leadStrong: 'Sitios y plataformas reales',
    projects: [
      { slug: 'fashion-store', title: 'Una tienda diseñada para vender sin complicaciones.' },
      { slug: 'recruitment-platform', title: 'Una experiencia digital creada alrededor del negocio.' },
    ],
    view: 'VER PROYECTO', demo: 'CONCEPTO / NO ES UN CASO DE CLIENTE',
    conceptsLabel: 'EXPLORACIONES CONCEPTUALES DEL ESTUDIO',
    clientIntro: 'que diseñamos y desarrollamos para nuestros clientes, publicados con su autorización.',
    outro: '¿Querés que tu proyecto sea el próximo?', cta: 'QUIERO UN PROYECTO ASÍ',
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
