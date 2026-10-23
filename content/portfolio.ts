/**
 * PORTAFOLIO, PRODUCTOS PROPIOS Y CAPACIDADES (Fase 3).
 *
 * Taxonomía (04_PORTAFOLIO_Y_CASOS):
 *  - clientWorks: trabajos de clientes. Solo se publican con `authorized: true` (autoría, alcance y permiso confirmados).
 *    Mientras estén pendientes NO aparecen en producción; en `npm run dev` se ven como vista previa interna.
 *  - ownProducts: productos propios de Velour, con su estado exacto.
 *  - capabilities: capacidades técnicas y servicios. No son casos de éxito.
 *  - Las exploraciones conceptuales siguen en site-content.ts (projects[] con status 'demo').
 *
 * Las fichas describen SOLO lo observable públicamente en cada sitio. `velourScope` debe estar confirmado por la dirección
 * antes de publicar. No agregar métricas ni resultados.
 */

export type ServiceType = (typeof SERVICE_TYPES)[number];

/** Tipos de proyecto del formulario y del filtro "Servicio" del CRM. El servidor valida contra esta lista. */
export const SERVICE_TYPES = [
  'Página web', 'Landing page', 'E-commerce', 'Shopify', 'Branding',
  'Automatización / IA', 'Integraciones', 'CRM / Sistema', 'Software a medida', 'Velour Contabilidad',
] as const;

export type ClientWork = {
  slug: string;
  name: string;
  url: string;
  sector: string;
  location: string;
  category: 'Web' | 'Plataforma' | 'Software';
  /** Qué se ve hoy en el sitio público (hechos, no promesas). */
  summary: string;
  publicFeatures: string[];
  /** Tecnología detectable desde el navegador. La lista definitiva la confirma la dirección. */
  observedTech: string[];
  /** Qué hizo Velour exactamente. Vacío = sin confirmar → no se puede publicar. */
  velourScope: string;
  authorized: boolean;
  /** Notas internas para la decisión de publicación. Nunca se muestran en producción. */
  reviewNotes: string;
  checkedAt: string;
  mockup: 'gastronomy' | 'recruitment' | 'ads' | 'operations';
  /** Captura real del sitio publicado (solo trabajos autorizados), en /public. */
  screenshot?: string;
  /** Captura real en versión celular. */
  screenshotMobile?: string;
  service: ServiceType;
};

/**
 * Trabajos de clientes AUTORIZADOS (este repositorio es público: acá solo va lo que el cliente aprobó publicar).
 * Los pendientes de autorización se guardan en content/clientes-pendientes.local.json (ignorado por Git) y solo se
 * ven como vista previa en `npm run dev` (ver lib/portfolio-preview.ts).
 */
export const clientWorks: ClientWork[] = [
  {
    slug: "sobretablas",
    screenshot: "/trabajos/sobretablas.webp",
    screenshotMobile: "/trabajos/sobretablas-movil.webp",
    name: "Sobretablas",
    url: "https://sobretablasve.com/",
    sector: "Gastronomía y catering",
    location: "Maracaibo, Venezuela",
    category: "Web",
    summary: "Sitio de un restaurante gourmet con tablas creativas y catering: presenta la propuesta, las cartas digitales, una galería de creaciones y un formulario de reserva que arma la solicitud y la envía por WhatsApp.",
    publicFeatures: [
      "Cartas digitales por categoría (tablas, restaurante, vida saludable) y cartas marcadas como «próximamente»",
      "Galería de creaciones con vista ampliada",
      "Formulario de reserva (tipo de solicitud, fecha, hora y personas) que se envía por WhatsApp",
      "Horarios, ubicación con enlace a mapa e Instagram"
    ],
    observedTech: [
      "Aplicación web compilada con Vite",
      "Diseño responsive"
    ],
    velourScope: "Diseño y desarrollo completo del sitio: diseño de la interfaz, programación y puesta en línea.",
    authorized: true,
    reviewNotes: "Autorizado por el cliente; alcance confirmado por la dirección el 23/10/2026.",
    checkedAt: "2026-10-23",
    mockup: "gastronomy",
    service: "Página web"
  },
  {
    slug: "prime-hiring-solutions",
    screenshot: "/trabajos/prime-hiring-solutions.webp",
    screenshotMobile: "/trabajos/prime-hiring-solutions-movil.webp",
    name: "Prime Hiring Solutions",
    url: "https://primehiringsolution.com/",
    sector: "Búsqueda y selección de personal",
    location: "Mercado hispanohablante",
    category: "Plataforma",
    summary: "Plataforma de búsqueda y selección: un sitio comercial con acceso a portal que organiza a los postulantes por perfil de puesto para reabrir una búsqueda sin empezar de cero.",
    publicFeatures: [
      "Base de postulantes por perfil de puesto, con historial",
      "Estados del proceso: aprobado, reserva, rechazado, contratado, retirado, no disponible",
      "Formulario de postulación dedicado por puesto",
      "Portal para empresas con acceso y registro"
    ],
    observedTech: [
      "Next.js",
      "Portal con autenticación"
    ],
    velourScope: "Diseño y desarrollo completo del sitio: diseño de la interfaz, programación y puesta en línea.",
    authorized: true,
    reviewNotes: "Autorizado por el cliente; alcance confirmado por la dirección el 23/10/2026.",
    checkedAt: "2026-10-23",
    mockup: "recruitment",
    service: "Software a medida"
  },
  {
    slug: "digitsolution",
    screenshot: "/trabajos/digitsolution.webp",
    screenshotMobile: "/trabajos/digitsolution-movil.webp",
    name: "Digitsolution",
    url: "https://www.digitsolution.io/",
    sector: "Infraestructura para anunciantes digitales",
    location: "Internacional",
    category: "Web",
    summary: "Sitio comercial en inglés (con opción en francés) que presenta paquetes por niveles, una comparativa, el proceso en tres pasos y preguntas frecuentes, con contacto por Telegram y WhatsApp.",
    publicFeatures: [
      "Paquetes por niveles con tabla comparativa",
      "Sección de proceso en tres pasos y preguntas frecuentes",
      "Selector de idioma inglés / francés",
      "Contacto directo por Telegram y WhatsApp; enlace a tienda externa"
    ],
    observedTech: [
      "Recursos servidos desde Cloudflare R2",
      "Diseño responsive"
    ],
    velourScope: "Diseño y desarrollo completo del sitio: diseño de la interfaz, programación y puesta en línea.",
    authorized: true,
    reviewNotes: "Autorizado por el cliente; alcance confirmado por la dirección el 23/10/2026.",
    checkedAt: "2026-10-23",
    mockup: "ads",
    service: "Landing page"
  },
  {
    slug: "zamudio-clipping",
    screenshot: "/trabajos/zamudio-clipping.webp",
    screenshotMobile: "/trabajos/zamudio-clipping-movil.webp",
    name: "Zamudio Clipping",
    url: "https://zamudioclipping.com/",
    sector: "Contenido de video corto",
    location: "Internacional",
    category: "Plataforma",
    summary: "Plataforma para operar campañas de clips de video corto: presenta el flujo de campañas, la red de clippers y una capa operativa con accesos por rol.",
    publicFeatures: [
      "Accesos por rol: administración, operaciones y clipper",
      "Validación de entregas (asignación, cuenta, URL duplicada, reglas de campaña)",
      "Historial de métricas y registro de auditoría",
      "Solicitud de ingreso para clippers e inicio de sesión"
    ],
    observedTech: [
      "Aplicación web compilada con Vite",
      "Autenticación de usuarios"
    ],
    velourScope: "Diseño y desarrollo completo del sitio: diseño de la interfaz, programación y puesta en línea.",
    authorized: true,
    reviewNotes: "Autorizado por el cliente; alcance confirmado por la dirección el 23/10/2026.",
    checkedAt: "2026-10-23",
    mockup: "operations",
    service: "Software a medida"
  }
];

export const ownProducts = [
  {
    id: 'velour-contabilidad',
    name: 'Velour Contabilidad',
    kind: 'Producto propio',
    title: 'Ventas y contabilidad, con o sin conexión.',
    description: 'Software de gestión de ventas y contabilidad desarrollado por Velour Studio, pensado para trabajar tanto sin conexión como en línea.',
    highlights: ['Gestión de ventas', 'Registro contable', 'Modalidad offline', 'Modalidad online'],
    /** Estado sin confirmar por la dirección: no se anuncia como disponible ni con funciones extra. */
    availability: 'Consultá disponibilidad y modalidades para tu negocio.',
    cta: 'CONSULTAR POR VELOUR CONTABILIDAD',
    service: 'Velour Contabilidad' as ServiceType,
  },
];

export const capabilities: { id: string; title: string; description: string; examples: string[]; service: ServiceType; icon: 'ai' | 'airtable' | 'logistics' | 'backend' | 'frontend' | 'enterprise' }[] = [
  { id: 'ia', title: 'Automatizaciones con IA', icon: 'ai', service: 'Automatización / IA',
    description: 'Flujos que combinan inteligencia artificial con tus herramientas para ordenar información y reducir tareas repetitivas.',
    examples: ['Clasificación y resumen de consultas', 'Asistentes conectados a tus datos', 'Flujos con revisión humana'] },
  { id: 'airtable', title: 'Integraciones con Airtable', icon: 'airtable', service: 'Integraciones',
    description: 'Conectamos Airtable con formularios, webs y otras plataformas para que la información no se copie a mano.',
    examples: ['Bases y vistas a medida', 'Sincronización con formularios y webs', 'Automatizaciones entre apps'] },
  { id: 'logistica', title: 'Sistemas de logística', icon: 'logistics', service: 'Software a medida',
    description: 'Herramientas para seguir pedidos, entregas y estados de una operación con información clara para cada rol.',
    examples: ['Estados y seguimiento', 'Paneles por rol', 'Registro de movimientos'] },
  { id: 'backend', title: 'Desarrollo backend', icon: 'backend', service: 'Software a medida',
    description: 'APIs, bases de datos, autenticación y permisos construidos con foco en seguridad y mantenimiento.',
    examples: ['APIs y bases de datos', 'Autenticación y roles', 'Integraciones con servicios externos'] },
  { id: 'frontend', title: 'Desarrollo frontend', icon: 'frontend', service: 'Página web',
    description: 'Interfaces rápidas, accesibles y responsive, cuidando el detalle visual y la experiencia en cada pantalla.',
    examples: ['Sitios y aplicaciones web', 'Paneles y dashboards', 'Animaciones sobrias'] },
  { id: 'empresarial', title: 'Software empresarial a medida', icon: 'enterprise', service: 'Software a medida',
    description: 'Sistemas internos ajustados a cómo trabaja tu equipo: CRM, gestión de procesos y paneles de control.',
    examples: ['CRM y gestión comercial', 'Flujos de aprobación', 'Reportes y exportaciones'] },
];

export const isPreviewOnly = (work: ClientWork) => !work.authorized;

/** Enlace al diagnóstico con el tipo de proyecto preseleccionado (funciona también sin JavaScript). */
export const serviceHref = (service: ServiceType) => `/?servicio=${encodeURIComponent(service)}#project-form`;
