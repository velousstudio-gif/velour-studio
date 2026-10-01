/** ÚNICA FUENTE DE CONTENIDO PÚBLICO. No guardar claves ni secretos aquí.
 * Los placeholders TU_*_AQUI nunca se convierten en enlaces visibles.
 * Ver content/README.md para editar sin cambiar el diseño. */
export type Project = { slug: string; name: string; year: string; category: string; description: string; tech: string[]; kind: string; detail: string; status: 'demo' | 'real'; image: { src: string; alt: string }; sector: string; problem: string; solution: string; result: { text: string; evidenceUrl: string } | null };

// Completar aquí los datos públicos. Mantener vacíos o placeholders hasta tener datos reales.
// El destinatario privado del formulario se configura únicamente con CONTACT_EMAIL en el servidor.
export const businessConfig = {
  publicEmail: 'velousstudio@gmail.com',
  whatsappNumber: '5493585329272',
  whatsappDisplay: '+54 9 358 532 9272',
  instagramUrl: '',
  linkedinUrl: '',
  domain: '', // URL completa con https://
  legalBusinessName: 'TU_RAZON_SOCIAL_AQUI',
};

export const siteContent = {
  "contact": {
    "email": businessConfig.publicEmail,
    "whatsapp": businessConfig.whatsappNumber,
    "whatsappDisplay": businessConfig.whatsappDisplay,
    "instagram": businessConfig.instagramUrl,
    "linkedin": businessConfig.linkedinUrl,
    "address": "TU_DIRECCION_AQUI",
    "showAddress": false,
    "whatsappMessage": "Hola, vi la web de Velour Studio y me gustaría consultar por un proyecto."
  },
  "publication": {
    "siteUrl": businessConfig.domain,
    "legalOwner": businessConfig.legalBusinessName,
    "legalJurisdiction": "TU_JURISDICCION_AQUI"
  },
  "media": {
    "hero": {
      "src": "/images/velour-sculpture.webp",
      "alt": "Escultura de seda marfil, luz y textura sobre piedra natural"
    },
    "demoFashion": {
      "src": "/images/edit-fashion.webp",
      "alt": "Abrigo de lana marfil sobre una silla de madera, fotografía editorial de moda"
    }
  },
  "seo": {
    "title": "Velour Studio | Web Design, E-commerce & Digital Solutions",
    "description": "Diseñamos páginas web, tiendas online y soluciones digitales para marcas y negocios que quieren crecer.",
    "socialImageAlt": "Velour Studio — Experiencias digitales creadas para destacar"
  },
  "navigation": [
    [
      "Trabajos",
      "works"
    ],
    [
      "Servicios",
      "services"
    ],
    [
      "Proceso",
      "process"
    ],
    [
      "El estudio",
      "studio"
    ]
  ],
  "links": {
    "home": "/#inicio",
    "works": "/#proyectos",
    "services": "/#servicios",
    "studio": "/#nosotros",
    "contact": "/#contacto",
    "manifesto": "/#manifiesto",
    "form": "/#project-form",
    "privacy": "/privacidad",
    "terms": "/terminos",
    "process": "/#proceso",
    "questions": "/#preguntas",
    "webService": "/#web-commerce",
    "automationService": "/#automation",
    "ecommerceService": "/#ecommerce",
    "developmentService": "/#development",
    "branding": "/#branding",
    "trust": "/#confianza"
  },
  "services": {
    "web": {
      "eyebrow": "01 — QUÉ HACEMOS",
      "title": "Diseño y desarrollo web",
      "description": "Tu web no debería ser solamente bonita. Debe explicar qué hacés, generar confianza y hacer que contactar o comprar sea sencillo.",
      "detailLabel": "Ver servicio",
      "details": "Cada proyecto empieza por el contenido y la experiencia. Definimos la estructura, diseñamos una propuesta a medida y desarrollamos una web lista para usar, con atención al rendimiento, la navegación y el detalle.",
      "capabilities": [
        [
          "PÁGINA WEB",
          "Diseño personalizado para tu negocio."
        ],
        [
          "LANDING PAGE",
          "Una página enfocada en una acción concreta."
        ],
        [
          "SHOPIFY",
          "Tiendas online fáciles de gestionar."
        ],
        [
          "RESPONSIVE",
          "Experiencia optimizada en cualquier pantalla."
        ]
      ],
      "visualCaption": "Exploraciones de diseño web · Conceptos de Velour Studio"
    },
    "automation": {
      "eyebrow": "02 — QUÉ HACEMOS",
      "title": "Automatización y desarrollo a medida",
      "description": "Cuando una web no alcanza, conectamos herramientas y construimos soluciones que reducen trabajo manual y organizan mejor tu operación.",
      "detailLabel": "Ver servicio",
      "details": "Partimos de cómo trabajás hoy. Identificamos las tareas repetitivas y definimos qué conviene conectar o construir: formularios, APIs, seguimiento de consultas y herramientas internas.",
      "capabilities": [
        [
          "AUTOMATION",
          "Procesos, formularios y workflows."
        ],
        [
          "CRM",
          "Gestión de clientes y oportunidades."
        ],
        [
          "INTEGRACIONES",
          "Conexiones entre APIs y plataformas."
        ],
        [
          "CUSTOM DEVELOPMENT",
          "Herramientas internas y sistemas personalizados."
        ]
      ],
      "visualCaption": "Una experiencia simple. Un sistema conectado. · Concepto"
    },
    "branding": {
      "label": "TAMBIÉN DAMOS FORMA A TU MARCA",
      "title": "Branding con una mirada propia.",
      "description": "Identidades visuales claras, consistentes y modernas. Desde el concepto hasta cada punto de contacto.",
      "cta": "Hablemos de tu marca"
    }
  },
  "prices": [
    {
      "id": "landing",
      "name": "Landing Page",
      "price": 150
    },
    {
      "id": "web",
      "name": "Web Profesional",
      "price": 250
    },
    {
      "id": "commerce",
      "name": "E-commerce",
      "price": 300
    }
  ],
  "customProject": {
    "name": "Desarrollo personalizado",
    "priceLabel": "Cotización personalizada"
  },
  "projects": [
    {
      "slug": "fashion-store",
      "name": "Maison Commerce",
      "year": "2026",
      "category": "E-commerce / Shopify",
      "description": "Una experiencia de compra donde el producto y la dirección de arte hablan el mismo idioma.",
      "tech": [
        "Shopify",
        "UX/UI",
        "Responsive"
      ],
      "kind": "fashion",
      "detail": "Un concepto de tienda de moda que explora el equilibrio entre una experiencia editorial y una compra intuitiva. La tipografía, la fotografía y los espacios construyen una identidad serena, con el producto como protagonista.",
      "status": "demo",
      "image": {
        "src": "",
        "alt": ""
      },
      "sector": "Moda / retail",
      "problem": "Explorar cómo presentar una colección con carácter editorial sin dificultar la compra.",
      "solution": "Un concepto de tienda Shopify con jerarquía clara, catálogo visual y navegación pensada para móvil.",
      "result": null
    },
    {
      "slug": "recruitment-platform",
      "name": "Recruitment Platform",
      "year": "2026",
      "category": "Web Platform",
      "description": "Una nueva perspectiva del talento. Una presencia digital abierta, expresiva y humana.",
      "tech": [
        "Next.js",
        "Automation",
        "CRM"
      ],
      "kind": "recruitment",
      "detail": "Concepto de plataforma de reclutamiento presentado desde su experiencia pública: una portada con voz propia que conecta a las personas con nuevas posibilidades. La identidad tipográfica y las formas ascendentes expresan movimiento y crecimiento.",
      "status": "demo",
      "image": {
        "src": "",
        "alt": ""
      },
      "sector": "Talento / servicios",
      "problem": "Dar claridad a la conexión entre personas, búsquedas y oportunidades desde una experiencia pública.",
      "solution": "Una propuesta de plataforma web con recorrido de consulta y una base conceptual para automatizar el seguimiento.",
      "result": null
    },
    {
      "slug": "luxury-brand-identity",
      "name": "Atelier Identity",
      "year": "2026",
      "category": "Branding / Web",
      "description": "El valor de lo esencial. Una identidad táctil y atemporal que encuentra belleza en lo cotidiano.",
      "tech": [
        "Branding",
        "Dirección de arte",
        "Web design"
      ],
      "kind": "identity",
      "detail": "Exploración de identidad para una marca de objetos de autor. Un monograma, una paleta de tintas profundas y papeles cálidos construyen un sistema visual que puede extenderse desde la papelería hasta la experiencia digital.",
      "status": "demo",
      "image": {
        "src": "",
        "alt": ""
      },
      "sector": "Diseño / objetos de autor",
      "problem": "Construir una identidad reconocible que conserve su carácter tanto en papel como en pantalla.",
      "solution": "Un sistema conceptual de identidad, tipografía y dirección de arte adaptable a una experiencia web.",
      "result": null
    }
  ] as Project[],
  "faqs": [
    {
      "id": "pricing",
      "question": "¿Cuánto cuesta una página web?",
      "answer": "Cada proyecto depende del alcance y las funcionalidades. Landing Page: desde USD {landingPrice}. Web Profesional: desde USD {webPrice}. E-commerce: desde USD {commercePrice}. Desarrollo personalizado: cotización a medida."
    },
    {
      "id": "timing",
      "question": "¿Cuánto tarda un proyecto?",
      "answer": "Depende del alcance y del contenido disponible. Como referencia: landing pages, {landingTime}; webs profesionales, {webTime}; e-commerce, {commerceTime}. El cronograma se acuerda antes de comenzar."
    },
    {
      "id": "domain",
      "question": "¿El dominio está incluido?",
      "answer": "No. El dominio, hosting, Shopify, aplicaciones y servicios externos se pagan por separado salvo que la propuesta indique lo contrario."
    },
    {
      "id": "shopify",
      "question": "¿Trabajan con Shopify?",
      "answer": "Sí. Diseñamos y configuramos tiendas Shopify, catálogo, inventario, colecciones, carrito y experiencia de compra."
    },
    {
      "id": "management",
      "question": "¿Puedo administrar la web después?",
      "answer": "Sí. Siempre que la tecnología utilizada lo permita, entregamos accesos y dejamos preparada la plataforma para que puedas gestionar el contenido correspondiente."
    },
    {
      "id": "payment",
      "question": "¿Cómo se paga?",
      "answer": "Podemos organizar el pago de dos maneras, según la propuesta acordada."
    },
    {
      "id": "changes",
      "question": "¿Qué pasa si necesito cambios?",
      "answer": "Los cambios contemplados dentro del alcance inicial se trabajan durante las revisiones del proyecto. Las funcionalidades nuevas se cotizan por separado."
    },
    {
      "id": "support",
      "question": "¿Ofrecen soporte?",
      "answer": "Sí. El soporte y mantenimiento posterior puede incluirse según las necesidades del proyecto."
    }
  ],
  "process": [
    {
      "title": "Reunión / brief",
      "timing": "Día 1",
      "description": "Entendemos tu negocio, qué querés construir, tus referencias y el objetivo principal del proyecto.",
      "deliverables": [
        "Alcance inicial",
        "Presupuesto",
        "Próximos pasos"
      ],
      "approval": true
    },
    {
      "title": "Dirección visual",
      "timing": "Primeros días",
      "description": "Definimos estructura, referencias, identidad visual y dirección del proyecto antes de avanzar con el desarrollo.",
      "deliverables": [
        "Dirección visual",
        "Estructura",
        "Primera propuesta"
      ],
      "approval": true
    },
    {
      "title": "Desarrollo",
      "timing": "Según alcance",
      "description": "Construimos la solución aprobada y compartimos avances para que puedas revisar el proyecto durante el proceso.",
      "deliverables": [
        "Versión funcional",
        "Preview / staging"
      ],
      "approval": false
    },
    {
      "title": "Revisión y lanzamiento",
      "timing": "Antes de publicar",
      "description": "Probamos responsive, navegación, enlaces, formularios y rendimiento antes de publicar.",
      "deliverables": [
        "Web publicada",
        "Accesos",
        "Configuración final"
      ],
      "approval": true
    },
    {
      "title": "Soporte",
      "timing": "Después del lanzamiento",
      "description": "Después del lanzamiento podemos acompañarte con ajustes, mantenimiento y nuevas mejoras según el proyecto.",
      "deliverables": [],
      "approval": false
    }
  ],
  "footerServices": [
    {
      "label": "Web Design",
      "link": "webService"
    },
    {
      "label": "E-commerce",
      "link": "ecommerceService"
    },
    {
      "label": "Shopify",
      "link": "ecommerceService"
    },
    {
      "label": "Branding",
      "link": "branding"
    },
    {
      "label": "Automation",
      "link": "automationService"
    },
    {
      "label": "Development",
      "link": "developmentService"
    }
  ],
  "form": {
    "messages": {
      "nameRequired": "Ingresá tu nombre.",
      "messageTooShort": "Escribí un mensaje de al menos 10 caracteres.",
      "failure": "No pudimos enviar tu solicitud. Intentá nuevamente o escribinos por WhatsApp.",
      "success": "Gracias. Recibimos tu solicitud y te contactaremos pronto."
    }
  },
  "copy": {
    "home": {
      "hablemos": "Hablemos ",
      "symbol": "(",
      "symbol_2": ")",
      "direccion_creativa_velour_studio": "DIRECCIÓN CREATIVA / VELOUR STUDIO",
      "la_forma_cambia": "La forma cambia.",
      "la_intencion_permanece": "La intención permanece.",
      "exploracion_visual_001": "EXPLORACIÓN VISUAL — 001",
      "v": "v.",
      "saltar_al_contenido": "Saltar al contenido",
      "estudio_digital_independiente": "ESTUDIO DIGITAL INDEPENDIENTE",
      "web_commerce_branding": "WEB / COMMERCE / BRANDING",
      "experiencias_digitales": "Experiencias digitales",
      "creadas_para_destacar": "creadas para destacar.",
      "symbol_3": "✳",
      "empezar_un_proyecto": "Empezar un proyecto ",
      "ver_trabajos": "Ver trabajos ",
      "disenamos_y_desarrollamos_experiencias_digitales_para_marcas": "Diseñamos y desarrollamos experiencias digitales para marcas que quieren crecer, diferenciarse y convertir.",
      "estrategia_con_intencion_diseno_con_caracter": "ESTRATEGIA CON INTENCIÓN. DISEÑO CON CARÁCTER.",
      "descubri_el_estudio": "Descubrí el estudio ",
      "nuestra_mirada": "NUESTRA MIRADA",
      "diseno_tecnologia": "Diseño, tecnología",
      "y_estrategia": "y estrategia.",
      "trabajando_juntos": "Trabajando juntos.",
      "velour_studio_combina_diseno_visual_desarrollo_y": "Velour Studio combina diseño visual, desarrollo y soluciones digitales para crear experiencias que no solo se ven bien, sino que funcionan.",
      "portfolio_seleccionado": "PORTFOLIO SELECCIONADO",
      "trabajos": "Trabajos",
      "seleccionados": "seleccionados",
      "una_exploracion_de_lo_que_podemos_crear": "Una exploración de lo que podemos crear.",
      "real_projects_intro": "Una selección de proyectos del estudio.",
      "proyectos_conceptuales_mirada_real": "Proyectos conceptuales, mirada real.",
      "proyecto_0": "PROYECTO 0",
      "concepto": " / CONCEPTO",
      "symbol_4": " / ",
      "tu_proyecto_podria_ser_el_proximo": "Tu proyecto podría ser el próximo.",
      "hagamoslo_posible": "Hagámoslo posible ",
      "lo_que_hacemos": "LO QUE HACEMOS",
      "buenas_ideas": "Buenas ideas.",
      "bien_ejecutadas": "Bien ejecutadas.",
      "del_primer_boceto_al_ultimo_detalle": "Del primer boceto al último detalle.",
      "encontramos_la_forma_de_llevar_tu_marca": "Encontramos la forma de llevar tu marca más lejos.",
      "text_0": "0",
      "de_la_idea_a_lo_real": "DE LA IDEA A LO REAL",
      "nuestro": "Nuestro ",
      "proceso": "proceso",
      "conversaciones_claras": "Conversaciones claras.",
      "decisiones_compartidas_cuidado_en_cada_etapa": "Decisiones compartidas. Cuidado en cada etapa.",
      "independiente_por_naturaleza": "INDEPENDIENTE POR NATURALEZA.",
      "diseno_con_una_mirada_propia": "DISEÑO CON UNA MIRADA PROPIA. ↗",
      "el_estudio": "EL ESTUDIO",
      "disenamos_con_intencion": "Diseñamos con intención.",
      "desarrollamos_con_proposito": "Desarrollamos con propósito.",
      "velour_studio_es_un_estudio_digital_independiente": "Velour Studio es un estudio digital independiente enfocado en diseño web, desarrollo, e-commerce, branding y automatización. Trabajamos con marcas y negocios que buscan construir una presencia digital sólida, clara y funcional.",
      "conozcamonos": "Conozcámonos ",
      "un_punto_de_partida": "UN PUNTO DE PARTIDA",
      "cada_proyecto": "Cada proyecto",
      "es_diferente": "es diferente.",
      "el_alcance_define_la_inversion": "El alcance define la inversión.",
      "estas_son_nuestras_bases_para_empezar": "Estas son nuestras bases para empezar.",
      "desde": "Desde",
      "usd": " USD ",
      "los_costos_de_dominio_hosting_shopify_aplicaciones": "Los costos de dominio, hosting, Shopify, aplicaciones o servicios externos se cotizan por separado.",
      "preguntas_frecuentes": "Preguntas frecuentes",
      "antes_de_empezar": "ANTES DE EMPEZAR",
      "tu_proxima_gran_idea": "TU PRÓXIMA GRAN IDEA",
      "empieza_con_una_conversacion": "EMPIEZA CON UNA CONVERSACIÓN.",
      "hagamos_algo": "Hagamos algo",
      "que_valga_la_pena": "que valga la pena",
      "mostrar": "mostrar.",
      "contanos_que_queres_crear_y_te_ayudamos": "Contanos qué querés crear y te ayudamos a encontrar la mejor forma de hacerlo.",
      "iniciar_proyecto": "Iniciar proyecto ",
      "o_conversemos_por_whatsapp": "O conversemos por WhatsApp ",
      "diseno_con_caracter": "Diseño con carácter.",
      "experiencias_con_proposito": "Experiencias con propósito.",
      "volver_arriba": "Volver arriba ",
      "text_2026_velour_studio": "© 2026 Velour Studio",
      "privacy": "Privacidad",
      "terms": "Términos",
      "independent_by_design": "INDEPENDENT BY DESIGN."
    },
    "demoArtwork": {
      "maison": "MAISON",
      "coleccion_filosofia": "COLECCIÓN / FILOSOFÍA",
      "es": "ES — ↗",
      "el_arte_de_vestir_lo_esencial": "EL ARTE DE VESTIR LO ESENCIAL.",
      "menos": "Menos,",
      "pero_mejor": "pero mejor.",
      "prendas_que_permanecen": "Prendas que permanecen.",
      "una_nueva_forma_de_habitar_lo_cotidiano": "Una nueva forma de habitar lo cotidiano.",
      "descubrir_la_coleccion": "DESCUBRIR LA COLECCIÓN ↗",
      "coleccion_01_2026": "COLECCIÓN — 01 / 2026",
      "diseno_atemporal": "DISEÑO ATEMPORAL.",
      "piezas_con_intencion": "PIEZAS CON INTENCIÓN.",
      "maison_direccion_de_arte_comercio_digital": "MAISON — DIRECCIÓN DE ARTE / COMERCIO DIGITAL",
      "recruit": "recruit",
      "symbol": "®",
      "personas_posibilidades": "PERSONAS / POSIBILIDADES",
      "conectemos": "Conectemos ↗",
      "donde_empieza_lo_que_viene": "DONDE EMPIEZA LO QUE VIENE.",
      "el_talento": "El talento",
      "cambia": "cambia ",
      "todo": "todo.",
      "conectamos_tu_proximo_paso": "Conectamos tu próximo paso",
      "con_nuevas_posibilidades": "con nuevas posibilidades.",
      "encontra_tu_lugar": "ENCONTRÁ TU LUGAR ↗",
      "recruitment_una_nueva_perspectiva_del_talento": "RECRUITMENT — UNA NUEVA PERSPECTIVA DEL TALENTO",
      "el_valor_de_lo_esencial": "EL VALOR DE LO ESENCIAL.",
      "a": "a",
      "t": "t",
      "atelier": "atelier",
      "objetos_con_alma": "OBJETOS CON ALMA",
      "identidad_est_2026": "IDENTIDAD / EST. 2026",
      "lo_cotidiano": "Lo cotidiano,",
      "extraordinario": "extraordinario.",
      "a_2": "a.",
      "atelier_sistema_de_identidad_visual": "ATELIER — SISTEMA DE IDENTIDAD VISUAL"
    },
    "form": {
      "los_campos_con_son_obligatorios": "Los campos con * son obligatorios.",
      "nombre": "Nombre ",
      "symbol_2": "*",
      "tu_nombre": "Tu nombre",
      "empresa": "Empresa",
      "nombre_de_tu_negocio": "Nombre de tu negocio",
      "email": "Email ",
      "vos_tuempresa_com": "vos@tuempresa.com",
      "whatsapp": "WhatsApp",
      "text_54_9": "+54 9 ...",
      "tipo_de_proyecto": "Tipo de proyecto ",
      "selecciona_una_opcion": "Seleccioná una opción",
      "presupuesto": "Presupuesto",
      "sin_definir": "Sin definir",
      "mensaje": "Mensaje ",
      "contanos_un_poco_sobre_tu_proyecto": "Contanos un poco sobre tu proyecto...",
      "al_menos_10_caracteres": "Al menos 10 caracteres.",
      "no_completar": "No completar",
      "al_enviar_aceptas_nuestra": "Al enviar, aceptás nuestra ",
      "politica_de_privacidad": "política de privacidad.",
      "enviando": "Enviando...",
      "enviar_proyecto": "Enviar proyecto "
    },
    "privacy": {
      "volver_al_inicio": "← Volver al inicio",
      "politica_de_privacidad": "Política de privacidad",
      "ultima_actualizacion_septiembre_de_2026": "Última actualización: septiembre de 2026.",
      "informacion_que_compartis": "Información que compartís",
      "el_formulario_solicita_nombre_email_tipo_de": "El formulario solicita nombre, email, tipo de proyecto y mensaje. También podés compartir empresa, WhatsApp y presupuesto. Usamos estos datos para responder tu consulta, entender tus necesidades y preparar una propuesta.",
      "tratamiento_de_las_consultas": "Tratamiento de las consultas",
      "cuando_envias_el_formulario_la_consulta_se": "Cuando enviás el formulario, la consulta se transmite al servicio de recepción configurado por Velour Studio. No se confirma el envío si ese servicio no está disponible. No vendas ni compartas información sensible a través del formulario.",
      "privacidad_y_servicios_externos": "Privacidad y servicios externos",
      "este_sitio_no_utiliza_cookies_publicitarias_ni": "Este sitio no utiliza cookies publicitarias ni herramientas de seguimiento comercial. El proveedor de alojamiento puede procesar registros técnicos necesarios para la seguridad y el funcionamiento. Los enlaces a redes sociales y WhatsApp te llevan a servicios con sus propias políticas.",
      "tus_datos_y_tus_consultas": "Tus datos y tus consultas",
      "podes_solicitar_acceso_correccion_o_eliminacion_de": "Podés solicitar acceso, corrección o eliminación de los datos que compartiste indicando tu pedido en el formulario de contacto. Conservamos la información únicamente mientras sea necesaria para atender tu consulta y cumplir las obligaciones aplicables.",
      "ir_a_contacto": "Ir a contacto"
    },
    "terms": {
      "volver_al_inicio": "← Volver al inicio",
      "terminos_de_servicio": "Términos de servicio",
      "ultima_actualizacion_septiembre_de_2026": "Última actualización: septiembre de 2026.",
      "informacion_del_sitio": "Información del sitio",
      "este_sitio_presenta_los_servicios_de_velour": "Este sitio presenta los servicios de Velour Studio. Los proyectos identificados como demostración son conceptos ilustrativos y no constituyen casos de clientes ni promesas de resultados.",
      "precios_y_propuestas": "Precios y propuestas",
      "los_precios_publicados_son_valores_iniciales_en": "Los precios publicados son valores iniciales en dólares estadounidenses. El alcance, cronograma, entregables, pagos y condiciones de cada proyecto se acuerdan por escrito antes de comenzar. Enviar una consulta no implica una contratación.",
      "servicios_de_terceros": "Servicios de terceros",
      "el_registro_y_renovacion_del_dominio_el": "El registro y renovación del dominio, el alojamiento, las suscripciones de Shopify y otros servicios externos se presupuestan por separado, salvo que la propuesta indique expresamente lo contrario.",
      "entrega_y_acompanamiento": "Entrega y acompañamiento",
      "los_plazos_dependen_del_alcance_y_de": "Los plazos dependen del alcance y de la disponibilidad de contenidos, accesos y revisiones. El soporte, mantenimiento, licencias y derechos de uso se detallan en la propuesta de cada proyecto.",
      "contacto": "Contacto",
      "si_necesitas_aclarar_cualquier_condicion_escribinos_antes": "Si necesitás aclarar cualquier condición, escribinos antes de contratar para que podamos definirla en tu propuesta.",
      "ir_a_contacto": "Ir a contacto"
    },
    "projectPage": {
      "volver_a_proyectos": " Volver a proyectos",
      "concepto_de_demostracion": " · CONCEPTO DE DEMOSTRACIÓN",
      "este_proyecto_es_una_muestra_conceptual_del": "Este proyecto es una muestra conceptual del enfoque de Velour Studio. Las marcas y composiciones son ilustrativas; no representan un encargo de cliente ni resultados reales.",
      "quiero_una_solucion_asi": "Quiero una solución así "
    },
    "socialImage": {
      "velour_studio": "VELOUR STUDIO",
      "experiencias_digitales_creadas_para_destacar": "Experiencias digitales creadas para destacar.",
      "estudio_independiente_web_commerce_branding": "ESTUDIO INDEPENDIENTE — WEB / COMMERCE / BRANDING"
    }
  },
  "pendingReview": [
    "Email y WhatsApp confirmados. Dominio, Instagram y LinkedIn pendientes (vacíos y sin enlaces). Dirección opcional, oculta por defecto.",
    "Maison Commerce, Recruitment Platform y Atelier Identity: conceptos demo, con marcas, años, textos e imágenes ilustrativos.",
    "copy.demoArtwork: textos ficticios dentro de los mockups; se omiten al configurar una imagen real en projects[].image.",
    "Precios publicados: USD 150/250/300 definidos por el propietario; confirmar alcance, vigencia e impuestos antes de publicar.",
    "Servicios, FAQ y textos comerciales: validar plazos, alcance, soporte y condiciones prometidas.",
    "copy.privacy y copy.terms: borradores legales; faltan responsable, jurisdicción, proveedores y condiciones definitivas.",
    "Hero y Open Graph: dirección de arte y textos actuales conservados; no se presentan como trabajos de clientes.",
    "Resend: API key, remitente verificado y destinatario pendientes. Sin configuración completa no se envían consultas.",
    "Interfaz de reservas de Atelier: composición ilustrativa, sin funcionalidad de reserva."
  ],
  "timelines": {
    "landing": "aproximadamente 1 semana",
    "web": "aproximadamente 1–3 semanas",
    "commerce": "aproximadamente 2–4 semanas"
  },
  "paymentOptions": [
    {
      "label": "Opción A",
      "description": "50% al inicio y 50% a la entrega."
    },
    {
      "label": "Opción B",
      "description": "Pago en tres etapas según alcance. Definimos los importes en la propuesta."
    }
  ],
  "diagnosticOptions": {
    "projectTypes": [
      "Página web",
      "Landing page",
      "E-commerce",
      "Shopify",
      "Branding",
      "Automatización",
      "CRM / Sistema",
      "Otro"
    ],
    "audiences": [
      "Mi negocio",
      "Una empresa",
      "Un cliente",
      "Proyecto personal",
      "Otro"
    ],
    "situations": [
      "Todavía no tengo nada",
      "Tengo Instagram / redes",
      "Tengo una web",
      "Tengo una web pero quiero reemplazarla",
      "Ya tengo una tienda",
      "Necesito mejorar un sistema existente"
    ],
    "budgets": [
      "Menos de USD 200",
      "USD 200–500",
      "USD 500–1,000",
      "USD 1,000+",
      "No estoy seguro"
    ]
  },
  "agency": {
    "hero": {
      "eyebrow": "ESTUDIO DIGITAL — WEB / COMMERCE / BRANDING",
      "title": "Tu negocio merece una presencia digital a la altura.",
      "accent": "Diseñada para destacar. Construida para funcionar.",
      "description": "Creamos páginas web, tiendas online y soluciones digitales para marcas y negocios que quieren verse profesionales, vender mejor y simplificar su operación.",
      "primary": "Cotizar proyecto",
      "secondary": "Ver trabajos",
      "scroll": "Seguí descubriendo"
    },
    "trust": [
      {
        "title": "Diseño a medida",
        "description": "Sin plantillas genéricas."
      },
      {
        "title": "100% responsive",
        "description": "Optimizado para celular, tablet y escritorio."
      },
      {
        "title": "Atención directa",
        "description": "Contacto durante todo el proyecto."
      },
      {
        "title": "Entrega documentada",
        "description": "Accesos y configuración organizados."
      }
    ],
    "technology": {
      "label": "HERRAMIENTAS QUE USAMOS",
      "names": [
        "Shopify",
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Vercel",
        "GitHub",
        "Figma",
        "Meta",
        "Google",
        "OpenAI",
        "Claude"
      ],
      "pause": "Pausar movimiento",
      "play": "Reanudar movimiento"
    },
    "interface": {
      "label": "EXPERIENCIA CONECTADA",
      "wordmark": "Atelier",
      "title": "Reservá un momento.",
      "description": "Elegí el día. Nosotros nos ocupamos del resto.",
      "date": "Jueves, 15 de octubre",
      "times": [
        "10:00",
        "11:30",
        "16:00"
      ],
      "button": "Confirmar encuentro",
      "note": "Formulario → Agenda → Confirmación",
      "status": "Todo en su lugar."
    },
    "process": {
      "label": "CÓMO TRABAJAMOS",
      "title": "Qué pasa después de que nos escribís",
      "description": "Queremos que siempre sepas qué estamos haciendo, qué sigue y qué necesitamos de vos.",
      "approval": "TU APROBACIÓN",
      "deliverables": "ENTREGABLES",
      "note": "Tiempos orientativos. El alcance y el cronograma se definen en la propuesta."
    },
    "work": {
      "label": "TRABAJOS SELECCIONADOS",
      "title": "Diseño que se ve bien.",
      "accent": "Tecnología que funciona.",
      "demo": "Exploraciones conceptuales. Una muestra de nuestra mirada, no casos de clientes.",
      "real": "Proyectos con una idea clara y una ejecución cuidada.",
      "caseLink": "Explorar proyecto",
      "problem": "El desafío",
      "solution": "La solución",
      "result": "Resultado documentado",
      "sector": "Sector",
      "stack": "Stack / disciplinas"
    },
    "cta": {
      "label": "¿TENÉS UNA IDEA?",
      "title": "Tu próximo proyecto puede empezar con una conversación.",
      "description": "Contanos qué querés construir y te ayudamos a definir el alcance adecuado.",
      "primary": "Contanos tu proyecto",
      "secondary": "WhatsApp",
      "notes": [
        "Sin compromiso",
        "Presupuesto definido antes de comenzar",
        "Atención directa"
      ]
    },
    "faq": {
      "label": "PREGUNTAS FRECUENTES",
      "title": "Todo lo que necesitás saber",
      "description": "Alcance, tiempos y formas de trabajar. Las respuestas para dar el primer paso con claridad.",
      "link": "Dejanos tu pregunta"
    },
    "question": {
      "label": "HABLEMOS DE TU IDEA",
      "title": "¿Todavía tenés dudas?",
      "description": "Escribinos y te ayudamos a entender qué solución puede encajar mejor con tu proyecto.",
      "field": "Pregunta",
      "placeholder": "¿Qué te gustaría saber?",
      "submit": "Enviar pregunta"
    },
    "diagnostic": {
      "label": "DIAGNÓSTICO DE PROYECTO",
      "title": "Contanos qué necesitás construir",
      "description": "Completá estas preguntas y tendremos el contexto necesario para preparar una propuesta.",
      "steps": [
        "Proyecto",
        "Detalles"
      ],
      "stepLabel": "Paso",
      "of": "de",
      "need": "¿Qué necesitás?",
      "audience": "¿Para quién es?",
      "situation": "¿Cuál es tu situación actual?",
      "next": "Continuar",
      "back": "Volver",
      "submit": "Solicitar propuesta",
      "budget": "Presupuesto estimado",
      "note": "Sin compromiso.",
      "direct": "¿Preferís hablarlo directamente?",
      "selectionPlaceholder": "Seleccioná una opción"
    },
    "nav": {
      "contact": "Contacto",
      "open": "Abrir menú",
      "close": "Cerrar menú",
      "label": "Navegación principal"
    },
    "contactLabels": {
      "email": "Email",
      "whatsapp": "WhatsApp",
      "instagram": "Instagram",
      "linkedin": "LinkedIn"
    },
    "formError": "Revisá los campos e incluí un mensaje de al menos 10 caracteres.",
    "companyName": "VELOUR STUDIO",
    "trustLabel": "Nuestra forma de trabajar"
  }
};

/** Copy and presentation data for the experience redesign. Contacts/prices remain above. */
export const experienceContent = {
  hero: {
    eyebrow: 'VELOUR STUDIO — DIGITAL EXPERIENCE',
    note: 'DISEÑO INDEPENDIENTE',
    lines: ['CREAMOS', 'EXPERIENCIAS'],
    accent: 'digitales.',
    title: 'Creamos experiencias digitales.',
    description: 'Diseñamos y desarrollamos páginas web, e-commerce y soluciones digitales que combinan estrategia, tecnología y diseño.',
    primary: 'INICIAR PROYECTO', secondary: 'VER TRABAJOS',
    exploration: 'VELOUR / SELECTED EXPLORATION', concept: 'CONCEPTO DIGITAL',
    disciplines: 'ESTRATEGIA. DISEÑO. TECNOLOGÍA.', scroll: 'SCROLL PARA EXPLORAR',
  },
  technology: { title: 'TRABAJAMOS CON', note: 'LAS HERRAMIENTAS. NUESTRA MIRADA.', brands: [
    ['Shopify', 'shopify'], ['Figma', 'figma'], ['Meta', 'meta'], ['Google', 'google'], ['GitHub', 'github'], ['OpenAI', 'openai'], ['Claude', 'claude'], ['Next.js', 'nextdotjs'], ['Vercel', 'vercel'], ['GSAP', 'gsap'],
  ] },
  services: {
    label: '01 / CAPACIDADES', title: 'LO QUE', accent: 'hacemos.',
    description: 'De una primera idea a una experiencia que funciona. Elegí por dónde empezamos.',
    expand: 'Explorar servicio', cta: 'HABLEMOS DE TU PROYECTO', visual: 'EXPLORACIÓN VISUAL / CONCEPTO',
    items: [
      { id: 'web-commerce', name: 'WEB DESIGN', subtitle: 'Sitios con una mirada propia.', description: siteContent.services.web.description, details: siteContent.services.web.details, deliverables: ['Diseño UI/UX', 'Landing pages', 'Desarrollo responsive', 'Optimización web'], technologies: ['Figma', 'Next.js', 'React'], kind: 'recruitment' },
      { id: 'ecommerce', name: 'E-COMMERCE', subtitle: 'Diseño que acompaña la compra.', description: 'Diseñamos tiendas online en Shopify y soluciones de venta digital.', details: 'Organizamos el catálogo y la experiencia de compra para que cada producto tenga su lugar y la tienda sea fácil de gestionar.', deliverables: ['Tienda Shopify', 'Catálogo y colecciones', 'Carrito y checkout', 'Configuración de la tienda'], technologies: ['Shopify', 'UX/UI', 'Integraciones'], kind: 'fashion' },
      { id: 'branding', name: 'BRANDING', subtitle: 'Una identidad con intención.', description: siteContent.services.branding.description, details: 'Definimos una identidad visual que conecte el concepto de tu marca con sus puntos de contacto digitales.', deliverables: ['Identidad visual', 'Tipografía y paleta', 'Sistema gráfico', 'Aplicaciones digitales'], technologies: ['Figma', 'Dirección de arte'], kind: 'identity' },
      { id: 'automation', name: 'AUTOMATION', subtitle: 'Menos tareas. Más posibilidades.', description: siteContent.services.automation.description, details: siteContent.services.automation.details, deliverables: ['Formularios conectados', 'Flujos de trabajo', 'Integración con CRM', 'APIs'], technologies: ['APIs', 'Node.js', 'Workflows'], kind: 'automation' },
      { id: 'development', name: 'CUSTOM DEVELOPMENT', subtitle: 'Tecnología a la medida de tu idea.', description: 'Creamos plataformas, portales, sistemas internos y soluciones a medida.', details: 'Diseñamos y desarrollamos la herramienta que tu operación necesita, con el alcance y las prioridades definidos antes de construir.', deliverables: ['Plataformas web', 'Portales', 'Sistemas internos', 'Integraciones'], technologies: ['Next.js', 'TypeScript', 'Node.js'], kind: 'development' },
    ],
  },
  projects: { label: '02 / PORTFOLIO', title: 'SELECTED', accent: 'work.', view: 'VER PROYECTO', },
  process: { label: '03 / MÉTODO', title: 'CÓMO', accent: 'trabajamos.', names: ['DESCUBRIR', 'DISEÑAR', 'CONSTRUIR', 'LANZAR', 'MEJORAR'] },
  about: { label: '04 / EL ESTUDIO', caption: 'WE BUILD DIGITAL EXPERIENCES', signature: 'ESTRATEGIA + SENSIBILIDAD + CÓDIGO' },
  giant: ['DESIGN', 'TECHNOLOGY', 'STRATEGY'],
  cta: { label: 'EL PRÓXIMO PASO', question: ['¿TENÉS', 'UNA IDEA?'], answer: ['HAGÁMOSLA', 'real.'], primary: 'CONTANOS TU PROYECTO' },
  faq: { label: '05 / ALGUNAS RESPUESTAS', title: 'Antes de', accent: 'empezar.' },
  diagnostic: { label: '06 / TU PRÓXIMO PROYECTO', title: '¿QUÉ QUERÉS', accent: 'construir?', direct: 'O EMPECEMOS CON UNA CONVERSACIÓN.' },
  footer: { note: 'INDEPENDENT MIND. DIGITAL CRAFT.', contact: 'SIGAMOS LA CONVERSACIÓN', studio: 'STUDIO.' },
};
