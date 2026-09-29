/** ÚNICA FUENTE DE CONTENIDO PÚBLICO. No guardar claves ni secretos aquí.
 * Los placeholders TU_*_AQUI nunca se convierten en enlaces visibles.
 * Ver content/README.md para editar sin cambiar el diseño. */
export type Project = { slug: string; name: string; year: string; category: string; description: string; tech: string[]; kind: string; detail: string; status: 'demo' | 'real'; image: { src: string; alt: string } };

// Completar aquí los datos públicos. Mantener vacíos o placeholders hasta tener datos reales.
// formRecipientEmail puede dejarse vacío y configurarse privadamente con FORM_RECIPIENT_EMAIL.
export const businessConfig = {
  publicEmail: 'velousstudio@gmail.com',
  whatsappNumber: '5493585329272',
  whatsappDisplay: '+54 9 358 532 9272',
  instagramUrl: '',
  linkedinUrl: '',
  domain: '', // URL completa con https://
  legalBusinessName: 'TU_RAZON_SOCIAL_AQUI',
  formRecipientEmail: '',
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
    "hero": { "src": "/images/velour-sculpture.webp", "alt": "Escultura de seda marfil, luz y textura sobre piedra natural" },
    "demoFashion": { "src": "/images/edit-fashion.webp", "alt": "Abrigo de lana marfil sobre una silla de madera, fotografía editorial de moda" }
  },
  "seo": {
    "title": "Velour Studio | Web Design, E-commerce & Digital Solutions",
    "description": "Estudio digital independiente. Diseño web, e-commerce en Shopify, branding, automatización y desarrollo a medida para marcas y negocios.",
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
      "El estudio",
      "studio"
    ],
    [
      "Contacto",
      "contact"
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
    "terms": "/terminos"
  },
  "services": [
    {
      "title": "Diseño y Desarrollo Web",
      "description": "Creamos sitios web modernos, rápidos y pensados para convertir."
    },
    {
      "title": "E-commerce",
      "description": "Diseñamos tiendas online en Shopify y soluciones de venta digital."
    },
    {
      "title": "Branding",
      "description": "Creamos identidades visuales claras, consistentes y modernas."
    },
    {
      "title": "Automatización",
      "description": "Conectamos procesos, formularios, CRM y herramientas para ahorrar tiempo."
    },
    {
      "title": "Desarrollo Personalizado",
      "description": "Creamos plataformas, portales, sistemas internos y soluciones a medida."
    }
  ],
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
        "Dirección de arte",
        "Diseño web"
      ],
      "kind": "fashion",
      "detail": "Un concepto de tienda de moda que explora el equilibrio entre una experiencia editorial y una compra intuitiva. La tipografía, la fotografía y los espacios construyen una identidad serena, con el producto como protagonista.",
      "status": "demo",
      "image": {
        "src": "",
        "alt": ""
      }
    },
    {
      "slug": "recruitment-platform",
      "name": "Recruitment Platform",
      "year": "2026",
      "category": "Web App / CRM",
      "description": "Una nueva perspectiva del talento. Una presencia digital abierta, expresiva y humana.",
      "tech": [
        "Diseño web",
        "Desarrollo",
        "Experiencia de usuario"
      ],
      "kind": "recruitment",
      "detail": "Concepto de plataforma de reclutamiento presentado desde su experiencia pública: una portada con voz propia que conecta a las personas con nuevas posibilidades. La identidad tipográfica y las formas ascendentes expresan movimiento y crecimiento.",
      "status": "demo",
      "image": {
        "src": "",
        "alt": ""
      }
    },
    {
      "slug": "luxury-brand-identity",
      "name": "Atelier Identity",
      "year": "2026",
      "category": "Branding / Web",
      "description": "El valor de lo esencial. Una identidad táctil y atemporal que encuentra belleza en lo cotidiano.",
      "tech": [
        "Identidad visual",
        "Dirección de arte",
        "Diseño web"
      ],
      "kind": "identity",
      "detail": "Exploración de identidad para una marca de objetos de autor. Un monograma, una paleta de tintas profundas y papeles cálidos construyen un sistema visual que puede extenderse desde la papelería hasta la experiencia digital.",
      "status": "demo",
      "image": {
        "src": "",
        "alt": ""
      }
    }
  ] as Project[],
  "faqs": [
    [
      "¿Cuánto cuesta una página web?",
      "Las landing pages comienzan desde USD {landingPrice}, los sitios web desde USD {webPrice} y las tiendas online desde USD {commercePrice}. La propuesta final se define según el alcance y las funcionalidades de tu proyecto."
    ],
    [
      "¿Cuánto tarda un proyecto?",
      "Depende del proyecto y del contenido disponible. Antes de comenzar, definimos juntos el alcance y un cronograma de trabajo con etapas claras."
    ],
    [
      "¿El dominio está incluido?",
      "El registro y la renovación se abonan por separado. La conexión del dominio está incluida. También detallamos los costos de alojamiento y servicios externos en la propuesta."
    ],
    [
      "¿Trabajan con Shopify?",
      "Sí. Diseñamos y configuramos tiendas Shopify, desde la experiencia visual y el catálogo hasta pagos e integraciones. La suscripción a Shopify se abona por separado."
    ],
    [
      "¿Puedo administrar la web después?",
      "Sí. Según la solución elegida, te entregamos acceso y una guía para actualizar contenidos, imágenes o productos. Definimos qué podrás administrar antes de comenzar."
    ],
    [
      "¿Ofrecen soporte luego de la entrega?",
      "Sí. Acordamos las condiciones del acompañamiento y las opciones de mantenimiento para que tu proyecto siga funcionando y pueda evolucionar."
    ]
  ],
  "process": [
    [
      "Descubrir",
      "Entendemos el negocio, objetivos y necesidades."
    ],
    [
      "Diseñar",
      "Definimos estructura, identidad visual y experiencia."
    ],
    [
      "Construir",
      "Desarrollamos y optimizamos la solución."
    ],
    [
      "Lanzar",
      "Probamos, ajustamos y publicamos."
    ]
  ],
  "footerServices": [
    "Web Design",
    "E-commerce",
    "Branding",
    "Automation",
    "Development"
  ],
  "form": {
    "messages": {
  "nameRequired": "Ingresá tu nombre.",
  "messageTooShort": "Escribí al menos 10 caracteres para contarnos tu proyecto.",
  "unavailable": "El envío todavía no está disponible. Tus datos siguen en el formulario.",
  "failure": "No pudimos enviar tu mensaje. Intentá nuevamente.",
  "success": "Recibimos tu consulta. Gracias por contarnos tu idea.",
  "timeout": "El envío tardó más de lo esperado. Tus datos siguen acá; intentá nuevamente."
},
    "projectTypes": [
      "Página web",
      "E-commerce",
      "Shopify",
      "Sistema personalizado",
      "CRM",
      "Branding",
      "Automatización",
      "Otro"
    ],
    "budgets": [
      "Menos de USD 200",
      "USD 200–500",
      "USD 500–1000",
      "USD 1000+",
      "No estoy seguro"
    ]
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
      "privacy": "Privacy",
      "terms": "Terms",
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
      "el_envio_de_consultas_estara_disponible_proximamente": "El envío de consultas estará disponible próximamente.",
      "mientras_tanto": " Mientras tanto, ",
      "escribinos_por_email": "escribinos por email",
      "symbol": ".",
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
      "enviando": "Enviando ",
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
    "Resend: API key, remitente verificado y destinatario pendientes. Sin configuración completa no se envían consultas."
  ]
};
