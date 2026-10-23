/**
 * IDIOMAS (es / en). Español es el idioma base; inglés vive en /en.
 * - Los textos en inglés se definen como "reemplazos" sobre los objetos en español: lo que falte cae al español.
 * - Los valores que se envían al CRM (tipo de proyecto, etc.) SIEMPRE quedan en español; en inglés solo cambian las etiquetas.
 */
import { homeContent } from './home-content';
import { siteContent } from './site-content';
import { vsl } from './vsl';
import { ownProducts, type ClientWork } from './portfolio';
import type { Concept } from './concepts';
import { faqs } from '@/lib/content';

export type Locale = 'es' | 'en';
export const locales: Locale[] = ['es', 'en'];

type DeepPartial<T> = T extends readonly unknown[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
function merge<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (patch === undefined) return base;
  if (Array.isArray(base) || typeof base !== 'object' || base === null) return patch as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) out[key] = merge((base as Record<string, unknown>)[key], value as never);
  return out as T;
}

/** Agrega /en a una ruta interna ('/#x' → '/en#x', '/vsl' → '/en/vsl'). Deja intactos enlaces externos y la política. */
export function localePath(locale: Locale, path: string): string {
  if (locale === 'es' || !path.startsWith('/') || path.startsWith('/en') || path.startsWith('/privacidad') || path.startsWith('/terminos') || path.startsWith('/login') || path.startsWith('/crm')) return path;
  if (path === '/') return '/en';
  if (path.startsWith('/#') || path.startsWith('/?')) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

const homeEn = merge<typeof homeContent>(homeContent, {
  quote: 'GET A QUOTE', more: 'SEE MORE', includes: 'INCLUDES',
  hero: {
    eyebrow: 'WEB DESIGN, ONLINE STORES & SOFTWARE', title: 'Websites and systems that', accent: 'grow your business',
    leadStrong: 'Websites, online stores and custom software', lead: 'so your company looks professional, gets more clients and sells more easily.',
    primary: 'GET MY PROJECT QUOTE', whatsapp: 'TALK TO AN EXPERT', secondary: 'SEE OUR WORK', clientsLabel: 'Recent work',
    decoA: 'DESIGN', decoB: 'DEVELOPMENT', decoC: 'STRATEGY', decoD: 'RESULTS', side: 'VELOUR STUDIO · WEB DESIGN & SOFTWARE',
  },
  trust: ['100% custom design', 'Mobile-ready', 'No-commitment quote'],
  webShowcase: {
    label: 'REAL PROJECTS, PUBLISHED WITH PERMISSION', title: 'High-impact websites that', accent: 'build trust and sell',
    subhead: 'Better image. More inquiries. More clients.',
    bodyStrong: 'We design sites that clearly explain what you do, build trust and turn visits into inquiries.',
    body: 'Every decision, from design to content, is made for your business. Tell us your idea and we will propose the way forward, with clear scope and pricing.',
    cta: "LET'S TALK ABOUT YOUR PROJECT",
  },
  commerce: {
    label: 'ONLINE STORES & SYSTEMS', title: 'Want to sell online or automate your business?',
    leadStrong: 'Stores and systems designed to help you sell more', lead: 'with simple processes and technology that works for you.',
    features: [
      { title: 'Get paid online', text: 'A simple checkout with the payment methods your customers use.' },
      { title: 'Catalog & stock', text: 'Upload products, variants and prices without endless spreadsheets.' },
      { title: 'Built for mobile', text: 'Most people buy from their phone: every screen is optimized.' },
      { title: 'Custom design', text: 'Every element guides the user and simplifies the purchase.' },
      { title: 'All in one dashboard', text: 'Orders, customers and inquiries organized in one place.' },
      { title: 'Automations', text: 'Notifications, follow-ups and repetitive tasks that run on their own.' },
    ],
    primary: 'I WANT AN ONLINE STORE', secondary: 'TALK TO AN EXPERT',
  },
  software: {
    label: 'CUSTOM SOFTWARE & AUTOMATION', title: 'We turn manual processes into', accent: 'systems that work for you',
    bodyStrong: 'Custom platforms, CRMs and portals', body: 'to organize your operation: clients, orders, teams and reports in one place, with role-based access.',
    points: ['CRM & sales follow-up', 'Portals for clients and teams', 'AI integrations and automations'], cta: 'I WANT A CUSTOM SYSTEM',
  },
  serviceList: {
    label: 'DIGITAL SOLUTIONS', title: 'Web design and software', accent: 'for your business.',
    description: 'We support you with design, development and technology. Pick a service and we start with a no-commitment quote.',
    link: 'SEE OUR WORK',
    items: [
      { id: 'web-commerce', service: 'Página web', title: 'Web design', text: 'Professional, fast, custom websites.' },
      { id: 'landing-page', service: 'Landing page', title: 'Landing pages', text: 'A single page focused on converting your campaigns.' },
      { id: undefined, service: 'E-commerce', title: 'Online stores', text: 'E-commerce and Shopify ready to sell.' },
      { id: 'branding', service: 'Branding', title: 'Branding', text: 'A clear, consistent visual identity.' },
      { id: undefined, service: 'Automatización / IA', title: 'Automation & AI', text: 'Workflows and assistants that save time.' },
      { id: 'development', service: 'Software a medida', title: 'CRM & custom software', text: 'Systems shaped around how your team works.' },
    ],
  },
  concepts: {
    label: 'DESIGN CONCEPTS', title: '50 design ideas', accent: 'for your industry',
    leadStrong: 'Sample designs with fictional brands,', lead: 'created by the studio to show styles by industry. They are not clients: they are starting points for your project.',
    ariaLabel: 'Design concepts with fictional brands', cta: 'SEE ALL 50 CONCEPTS',
  },
  contactIntro: {
    label: 'SEND US A MESSAGE', title: 'Tell us about your project and get a quote', accent: 'with no commitment',
    bodyStrong: 'We reply personally.', body: 'We get to know your business and goals, suggest concrete actions and prepare a tailored proposal.', cta: 'GET MY QUOTE',
  },
  formSection: { label: "LET'S TALK ABOUT YOUR PROJECT", title: 'Tell us what you need', after: 'What happens next', afterSteps: ['We receive your inquiry instantly.', 'We contact you to understand your business.', 'We send you a proposal with scope and pricing.'] },
  technology: { title: 'WE WORK WITH' },
  process: { label: 'HOW WE WORK', title: 'What happens after', accent: 'you reach out.', description: "You'll always know what we're doing, what comes next and when we need your approval." },
  portfolio: {
    label: 'OUR WORK', title: 'Projects that speak for themselves', leadStrong: 'Real websites and platforms',
    view: 'VIEW PROJECT', clientIntro: 'we designed and built for our clients, published with their permission.',
    outro: 'Want your project to be next?', cta: 'I WANT A PROJECT LIKE THIS',
  },
  cta: { label: 'KNOW WHAT YOU NEED?', title: 'Your project can', accent: 'start with a conversation.', description: 'Tell us what you want to build and we help you define scope, budget and next steps.', primary: 'QUOTE MY PROJECT', secondary: 'WHATSAPP', notes: ['NO COMMITMENT', 'QUOTE AGREED BEFORE WE START', 'DIRECT SUPPORT'] },
  faq: { label: 'FAQ', title: 'Everything you', accent: 'need to know.', description: 'Answers to the most common questions before starting a project.' },
  question: { label: 'STILL HAVE QUESTIONS?', title: 'Ask us', accent: 'anything.', typeLabel: 'I want to leave a', description: 'Send us your question, comment or suggestion. We like to start by listening.' },
  diagnostic: { title: 'Tell us what', accent: 'you need to build.', description: 'Answer these questions and we will have enough context to prepare a proposal.' },
  footer: {
    description: 'Digital studio specialized in web design, e-commerce, branding and digital solutions.',
    services: [['Web Design', 'webService'], ['Landing Pages', 'landingService'], ['Shopify', 'ecommerceService'], ['E-commerce', 'ecommerceService'], ['Branding', 'branding'], ['Automation', 'automationService'], ['Development', 'developmentService']],
    company: [['Work', 'works'], ['Process', 'process'], ['Contact', 'contact'], ['FAQ', 'faq']],
    servicesLabel: 'SERVICES', companyLabel: 'COMPANY', contactLabel: 'CONTACT', quote: 'Get a quote', copyright: '© 2026 Velour Studio.',
  },
} as unknown as DeepPartial<typeof homeContent>);

const uiEs = {
  agency: siteContent.agency,
  messages: siteContent.form.messages,
  form: siteContent.copy.form,
  /** Etiquetas visibles, en el mismo orden que los valores de siteContent.diagnosticOptions. */
  options: siteContent.diagnosticOptions as { projectTypes: string[]; audiences: string[]; situations: string[]; budgets: string[] },
  questionTypes: siteContent.questionTypes as string[],
  faqs,
  process: siteContent.process,
  payment: siteContent.paymentOptions,
  nav: siteContent.navigation.map(([label]) => label) as string[],
  header: { contact: 'Contacto', appearance: 'Apariencia', language: 'Idioma', skip: 'Saltar al contenido' },
  vsl,
  product: ownProducts[0],
  concepts: { pageTitle: 'ideas para', pageAccent: 'tu rubro', pageStrong: 'Diseños de muestra creados por el estudio con marcas ficticias.', pageText: 'No son clientes ni trabajos entregados: sirven para que veas estilos y elijas un punto de partida para tu web.', all: 'Todos', count: 'conceptos', badge: 'CONCEPTO', want: 'QUIERO ALGO ASÍ', filter: 'Filtrar por rubro' },
  work: { back: 'VOLVER A PROYECTOS', includes: 'Qué incluye el sitio', scope: 'Alcance de Velour', want: 'QUIERO UN PROYECTO ASÍ', visit: 'VER SITIO PUBLICADO', shot: 'CAPTURA DEL SITIO PUBLICADO' },
  slider: { choose: 'Elegir trabajo', view: 'Ver', site: 'Sitio de' },
};
type Ui = typeof uiEs;

const uiEn = merge<Ui>(uiEs, {
  agency: {
    process: { approval: 'YOUR APPROVAL', deliverables: 'DELIVERABLES' },
    faq: { link: 'Ask us a question' },
    question: { field: 'Question', placeholder: 'What would you like to know?', submit: 'SEND QUESTION', title: 'Still have questions?' },
    diagnostic: { label: 'PROJECT BRIEF', steps: ['Project', 'Details'], stepLabel: 'Step', of: 'of', need: 'What do you need?', audience: 'Who is it for?', situation: 'Where are you today?', next: 'CONTINUE', back: 'Back', submit: 'REQUEST PROPOSAL', budget: 'Estimated budget', note: 'No commitment.', direct: 'Prefer to talk directly?', selectionPlaceholder: 'Choose an option' },
    nav: { contact: 'Contact', open: 'Open menu', close: 'Close menu', label: 'Main navigation' },
  },
  messages: { nameRequired: 'Please enter your name.', messageTooShort: 'Please write a message of at least 10 characters.', failure: "We couldn't send your request. Check your connection and try again in a few seconds.", success: "Thank you. We received your request and we'll be in touch soon." },
  form: {
    los_campos_con_son_obligatorios: 'Fields marked * are required.', nombre: 'Name ', tu_nombre: 'Your name', empresa: 'Company', nombre_de_tu_negocio: 'Your business name',
    email: 'Email ', vos_tuempresa_com: 'you@company.com', whatsapp: 'WhatsApp / phone', text_54_9: '+1 ...', sin_definir: 'Not defined', mensaje: 'Message ',
    contanos_un_poco_sobre_tu_proyecto: 'Tell us a bit about your project...', al_menos_10_caracteres: 'At least 10 characters.', no_completar: 'Do not fill',
    al_enviar_aceptas_nuestra: 'By sending, you accept our ', politica_de_privacidad: 'privacy policy (in Spanish).', enviando: 'Sending...',
  },
  options: {
    projectTypes: ['Website', 'Landing page', 'E-commerce', 'Shopify', 'Branding', 'Automation / AI', 'Integrations', 'CRM / System', 'Custom software', 'Velour Contabilidad'],
    audiences: ['My business', 'Company', 'A client', 'Personal project'],
    situations: ["I don't have a website", 'I have Instagram', 'I have a website', 'I want to replace my website', 'I already have a store', 'I need to improve a system'],
    budgets: ['Under USD 200', 'USD 200–500', 'USD 500–1,000', 'USD 1,000+', "I'm not sure"],
  },
  questionTypes: ['Question', 'Comment', 'Suggestion'],
  faqs: faqs.map(faq => ({ ...faq, ...({
    pricing: { question: 'How much does a website cost?', answer: 'Each project depends on its scope and features. We send a clear quote before starting, with no commitment.' },
    timing: { question: 'How long does a project take?', answer: 'It depends on the scope and the content available. The schedule is agreed before we start.' },
    domain: { question: 'Is the domain included?', answer: 'No. Domain, hosting, Shopify, apps and external services are paid separately unless the proposal says otherwise.' },
    shopify: { question: 'Do you work with Shopify?', answer: 'Yes. We design and set up Shopify stores: catalog, inventory, collections, cart and shopping experience.' },
    management: { question: 'Can I manage the website afterwards?', answer: 'Yes. Whenever the technology allows it, we hand over access and leave the platform ready for you to manage the content.' },
    payment: { question: 'How do I pay?', answer: 'Payment is split in two parts, with scope and budget agreed before we start.' },
    changes: { question: 'What if I need changes?', answer: 'Changes within the initial scope are handled during project reviews. New features are quoted separately.' },
    support: { question: 'Do you offer support?', answer: 'Yes. Ongoing support and maintenance can be included depending on your needs.' },
  } as Record<string, { question: string; answer: string }>)[faq.id] })),
  process: [
    { ...siteContent.process[0], title: 'Meeting', timing: 'Day 1', description: 'We understand your business, what you want to build, your references and the main goal of the project.', deliverables: ['Scope', 'Quote', 'Next steps'] },
    { ...siteContent.process[1], title: 'Visual direction', timing: 'First days', description: 'We define structure, references, visual identity and direction before moving into development.', deliverables: ['Structure', 'Initial design', 'Visual reference'] },
    { ...siteContent.process[2], title: 'Development', timing: 'Depending on scope', description: 'We build the approved solution and share progress so you can review the project along the way.', deliverables: ['Working preview', 'Staging'] },
    { ...siteContent.process[3], title: 'Delivery', timing: 'Before launch', description: 'We test responsiveness, navigation, links, forms and performance before publishing.', deliverables: ['Published project', 'Access', 'Documentation'] },
    { ...siteContent.process[4], title: 'Support', timing: 'After launch', description: 'After launch we can keep supporting you with tweaks, maintenance and new improvements.', deliverables: [] },
  ],
  payment: [{ ...siteContent.paymentOptions[0], label: 'Two-part payment', description: '50% upfront and 50% on delivery.' }, { ...siteContent.paymentOptions[1], label: 'Alternative option', description: 'Three-stage payment depending on scope.' }],
  nav: ['Web design', 'Online stores', 'Custom software', 'Work', 'Process'],
  header: { contact: 'Contact', appearance: 'Appearance', language: 'Language', skip: 'Skip to content' },
  vsl: {
    kicker: 'FOR BUSINESSES THAT WANT TO SELL MORE ONLINE', title: 'Your business deserves a website', accent: 'that brings in clients.',
    subtitle: 'Watch the video and see how we design websites, online stores and systems that turn visits into inquiries.',
    subtitleNoVideo: 'We design websites, online stores and systems that turn visits into inquiries. Take a look at some of our work and request your quote.',
    noVideoTitle: 'Some of our work', cta: 'GET MY NO-COMMITMENT QUOTE',
    benefits: [
      { title: '100% custom design', text: 'No templates: your website is designed from scratch for your business.' },
      { title: 'Built to sell', text: 'Clear messages, visible buttons and forms that reach your team.' },
      { title: 'Mobile-ready', text: 'Fast and easy on any screen, wherever your customer is.' },
    ],
    steps: [{ title: 'Fill out the form', text: 'It takes less than a minute.' }, { title: 'We contact you', text: 'We talk about your business and what you need.' }, { title: 'Get your proposal', text: 'Clear scope, timeline and pricing, no commitment.' }],
    form: { label: 'GET YOUR QUOTE', title: "Leave your details and we'll contact you", note: 'No commitment. We reply personally.', defaultMessage: 'Please contact me about a quote (sent from the /en/vsl page).', submit: 'CONTACT ME' },
    faq: [
      { q: 'How much does it cost?', a: 'It depends on the scope. Once we understand your project, we send a clear quote before starting.' },
      { q: 'How long does it take?', a: 'An average website takes a few weeks. We give you a specific timeline in the proposal.' },
      { q: 'Can I manage it myself?', a: 'Yes. We set everything up and show you how to update what you need.' },
    ],
    thanks: { title: "Done! We've got your details", text: "We'll contact you shortly to talk about your project.", back: 'BACK TO THE SITE', whatsapp: 'WHATSAPP' },
  },
  product: { kind: 'Own product', title: 'Sales and accounting, online or offline.', description: 'Sales and accounting software built by Velour Studio, designed to work both offline and online.', cta: 'ASK ABOUT VELOUR CONTABILIDAD' },
  concepts: { pageTitle: 'ideas for', pageAccent: 'your industry', pageStrong: 'Sample designs created by the studio with fictional brands.', pageText: 'They are not clients or delivered projects: they help you explore styles and pick a starting point for your website.', all: 'All', count: 'concepts', badge: 'CONCEPT', want: 'I WANT SOMETHING LIKE THIS', filter: 'Filter by industry' },
  work: { back: 'BACK TO PROJECTS', includes: "What's on the site", scope: "Velour's scope", want: 'I WANT A PROJECT LIKE THIS', visit: 'VISIT THE LIVE SITE', shot: 'SCREENSHOT OF THE LIVE SITE' },
  slider: { choose: 'Choose project', view: 'View', site: 'Website of' },
} as unknown as DeepPartial<Ui>);

export function getDict(locale: Locale) {
  return locale === 'en' ? { home: homeEn, ui: uiEn } : { home: homeContent, ui: uiEs };
}

/** Grupos de rubros (conceptos) en inglés. */
const groupsEn: Record<string, string> = {
  'Gastronomía': 'Food & drink', 'Inmobiliaria': 'Real estate', 'Moda': 'Fashion', 'Salud': 'Health', 'Fitness': 'Fitness', 'Servicios profesionales': 'Professional services',
  'Turismo': 'Travel', 'Construcción': 'Construction', 'Automotor': 'Automotive', 'Tecnología': 'Technology', 'Hogar': 'Home', 'Eventos': 'Events', 'Creativos': 'Creative',
  'Educación': 'Education', 'Servicios': 'Services', 'Logística': 'Logistics', 'Comunidad': 'Community', 'Agro': 'Agriculture', 'Energía': 'Energy', 'Estética': 'Beauty',
  'Cultura': 'Culture', 'Infancia': 'Kids', 'Mascotas': 'Pets',
};
export const groupLabel = (locale: Locale, group: string) => locale === 'en' ? groupsEn[group] ?? group : group;

/** Rubro, titular y bajada de cada concepto en inglés (los nombres de marca ficticios no cambian). */
const conceptsEn: Record<string, [string, string, string]> = {
  'brasa-norte': ['Grill & restaurant', 'Slow fire, real flavor.', 'Book online'], 'casa-lumen': ['Real estate', 'Your next home starts here.', 'Featured listings'],
  'atelier-sora': ["Women's fashion", 'Clothes that last.', 'New collection'], 'clinica-alba': ['Medical center', 'We care for what matters most.', 'Online appointments'],
  'pulso-gym': ['Gym', 'Train with purpose.', 'Plans & schedule'], 'grano-fino': ['Specialty coffee', 'Roasted every week.', 'Online shop'],
  'lex-y-partners': ['Law firm', 'Clarity in every decision.', 'Consultations'], 'numa-contable': ['Accounting firm', 'Your numbers, in order.', 'Client portal'],
  'via-austral': ['Travel agency', 'Trips to remember.', '2027 destinations'], 'hotel-cardon': ['Boutique hotel', 'Silence, landscape and calm.', 'Book your stay'],
  'obra-prima': ['Construction company', 'We build with precision.', 'Projects'], 'motorhaus': ['Car dealership', 'Your next car, no hassle.', 'Available stock'],
  'nodo-cloud': ['SaaS software', 'Your operation, in one dashboard.', 'Try it free'], 'fondo-claro': ['Fintech', 'Simple finance for small businesses.', 'Open an account'],
  'miga-madre': ['Artisan bakery', 'Sourdough, every day.', 'Orders'], 'bodega-altura': ['Winery', 'Vineyards at 1,800 meters.', 'Wine club'],
  'oro-lento': ['Jewelry', 'Pieces for a lifetime.', 'Collection'], 'habitat-studio': ['Home decor', 'Spaces with character.', 'Catalog'],
  'trazo-arquitectos': ['Architecture', 'Architecture made to live in.', 'Projects'], 'patitas-vet': ['Veterinary clinic', 'Your pet, in good hands.', 'Appointments'],
  'sonrisa-360': ['Dentistry', 'Smile with confidence.', 'Book a visit'], 'mente-serena': ['Psychology', 'A space to be heard.', 'Online sessions'],
  'gran-velada': ['Event planning', 'Moments you won’t forget.', 'Get a quote'], 'luz-norte-foto': ['Photography', 'Stories in every image.', 'Portfolio'],
  'eco-sonoro': ['Music school', 'Learn at your own pace.', 'Enroll'], 'colmena-cowork': ['Coworking', 'Work in good company.', 'Book a desk'],
  'ruta-cargo': ['Logistics', 'On-time deliveries, always.', 'Tracking'], 'escudo-seguros': ['Insurance broker', 'Protect what you built.', 'Online quote'],
  'manos-unidas': ['Non-profit', 'Together we go further.', 'Donate'], 'campo-vivo': ['Agriculture', 'Technology for the field.', 'Monitoring'],
  'sol-pampa': ['Solar energy', 'Clean energy for your home.', 'Estimate your savings'], 'navaja-club': ['Barbershop', 'Classic cut, your style.', 'Book'],
  'agua-spa': ['Spa', 'Disconnect to reconnect.', 'Rituals'], 'prana-yoga': ['Yoga studio', 'Breathe. Move. Feel.', 'Classes'],
  'petalo-skin': ['Natural cosmetics', 'Simple routines, happy skin.', 'Shop'], 'hoja-suelta': ['Bookstore', 'Stories that find you.', 'New releases'],
  'trompo': ['Toy store', 'Play is serious business.', 'Catalog'], 'cola-feliz': ['Pet shop', 'Everything for your companion.', 'Shop online'],
  'flor-de-tierra': ['Florist', 'Fresh flowers, delivered.', 'Build your bouquet'], 'lupulo-sur': ['Brewery', 'Beer with identity.', 'Bar & shop'],
  'mirada-optica': ['Optician', 'See the world in style.', 'Eyewear'], 'farma-vida': ['Pharmacy', 'Your pharmacy, closer.', 'Online orders'],
  'core-studio': ['Pilates', 'Strength from the core.', 'Plans'], 'talento-uno': ['HR consultancy', 'The right people.', 'Searches'],
  'senal-creativa': ['Marketing agency', 'Ideas that move brands.', 'Cases'], 'pipeline': ['Sales CRM', 'Close more, with less effort.', 'Demo'],
  'al-toque': ['Delivery app', 'Your order, in minutes.', 'Get the app'], 'centro-vital': ['Physiotherapy clinic', 'Move again without pain.', 'Appointments'],
  'marea': ['Swimwear brand', 'Summer all year long.', 'Shop'], 'raiz-organica': ['Natural grocery', 'Real food, from the source.', 'Order online'],
};
export function localizeConcept(locale: Locale, concept: Concept): Concept {
  const t = locale === 'en' ? conceptsEn[concept.slug] : undefined;
  return t ? { ...concept, sector: t[0], headline: t[1], kicker: t[2] } : concept;
}

/** Fichas de trabajos reales en inglés. */
const worksEn: Record<string, Partial<ClientWork>> = {
  sobretablas: { sector: 'Food & catering', location: 'Maracaibo, Venezuela', summary: 'Website for a gourmet restaurant with creative boards and catering: it presents the concept, digital menus, a gallery of creations and a booking form that builds the request and sends it via WhatsApp.', publicFeatures: ['Digital menus by category (boards, restaurant, healthy) plus menus marked "coming soon"', 'Gallery of creations with enlarged view', 'Booking form (request type, date, time and guests) sent via WhatsApp', 'Opening hours, location with map link and Instagram'], observedTech: ['Web app built with Vite', 'Responsive design'] },
  'prime-hiring-solutions': { sector: 'Recruitment & staffing', location: 'Spanish-speaking market', category: 'Plataforma', summary: 'Recruitment platform: a commercial website with portal access that organizes candidates by job profile, so a search can be reopened without starting from scratch.', publicFeatures: ['Candidate pool by job profile, with history', 'Process stages: approved, on hold, rejected, hired, withdrawn, unavailable', 'Dedicated application form per position', 'Company portal with login and sign-up'], observedTech: ['Next.js', 'Authenticated portal'] },
  digitsolution: { sector: 'Infrastructure for digital advertisers', location: 'International', summary: 'Commercial website in English (with a French option) presenting tiered packages, a comparison, a three-step process and FAQs, with contact via Telegram and WhatsApp.' },
  'zamudio-clipping': { sector: 'Short-form video content', location: 'Spanish-speaking market', summary: 'Platform to run short-form clip campaigns: it presents the campaign flow, the network of clippers and an operations layer with role-based access.' },
};
export function localizeWork(locale: Locale, work: ClientWork): ClientWork {
  if (locale !== 'en') return work;
  const t = worksEn[work.slug];
  return { ...work, ...t, velourScope: 'Full design and development of the site: interface design, programming and launch.' };
}
export const categoryLabel = (locale: Locale, category: string) => locale === 'en' ? ({ Web: 'Web', Plataforma: 'Platform', Software: 'Software' } as Record<string, string>)[category] ?? category : category;
