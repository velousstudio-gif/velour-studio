/**
 * GALERÍA DE CONCEPTOS — diseños de muestra del estudio con marcas FICTICIAS.
 * No son clientes ni trabajos entregados: se muestran siempre con la etiqueta "Concepto de diseño".
 * Cualquier parecido de nombre con una marca real es casual; si aparece uno, cambiarlo.
 */
import type { ServiceType } from './portfolio';

export type ConceptLayout = 'split' | 'center' | 'shop' | 'dash' | 'editorial';
export type ConceptMotif = 'circle' | 'arch' | 'blob' | 'stripes' | 'grid';
export type Concept = {
  slug: string; name: string; sector: string; group: string; headline: string; kicker: string;
  layout: ConceptLayout; motif: ConceptMotif; serif: boolean; palette: readonly [string, string, string, string]; service: ServiceType;
};

/** [fondo, texto, acento, suave] */
const P = {
  noir: ['#0E0E0E', '#F4EFE6', '#C9A45C', '#2A2622'],
  cream: ['#F5EFE4', '#1E1A16', '#B3542E', '#E6D9C3'],
  forest: ['#16302A', '#F1EBDD', '#D8B26A', '#24453C'],
  ocean: ['#EAF2F7', '#0F2A3D', '#1E7FB8', '#CFE2EE'],
  blush: ['#F7E9E6', '#3B1F24', '#C2566B', '#EFD3CE'],
  sand: ['#EFE6D6', '#2B2620', '#8A6B3F', '#DCCFB8'],
  midnight: ['#101828', '#EEF2FF', '#7C8CFF', '#1D2740'],
  lime: ['#F3F6E8', '#1C2312', '#7FA02B', '#E0E8C4'],
  terracotta: ['#F2E3D5', '#2E1B12', '#C0622F', '#E7CBB3'],
  plum: ['#1F1424', '#F6EDF7', '#C78BD6', '#33233A'],
  steel: ['#ECEEF1', '#14181F', '#3B5BDB', '#D5DAE3'],
  sun: ['#FFF6E2', '#2A2008', '#E2A21B', '#F6E3B2'],
} as const;

const raw: [string, string, string, string, string, ConceptLayout, ConceptMotif, boolean, keyof typeof P, ServiceType][] = [
  // nombre, rubro, grupo, titular, bajada, layout, motivo, serif, paleta, servicio
  ['Brasa Norte', 'Parrilla y restaurante', 'Gastronomía', 'Fuego lento, sabor de verdad.', 'Reservas online', 'split', 'circle', true, 'noir', 'Página web'],
  ['Casa Lumen', 'Inmobiliaria', 'Inmobiliaria', 'Tu próximo hogar empieza acá.', 'Propiedades destacadas', 'center', 'arch', true, 'sand', 'Página web'],
  ['Atelier Sora', 'Moda femenina', 'Moda', 'Prendas que permanecen.', 'Nueva colección', 'shop', 'arch', true, 'blush', 'E-commerce'],
  ['Clínica Alba', 'Centro médico', 'Salud', 'Cuidamos lo que más importa.', 'Turnos en línea', 'split', 'blob', false, 'ocean', 'Página web'],
  ['Pulso Gym', 'Gimnasio', 'Fitness', 'Entrená con propósito.', 'Planes y horarios', 'center', 'stripes', false, 'midnight', 'Landing page'],
  ['Grano Fino', 'Café de especialidad', 'Gastronomía', 'Tostado cada semana.', 'Tienda online', 'shop', 'circle', true, 'terracotta', 'Shopify'],
  ['Lex & Partners', 'Estudio jurídico', 'Servicios profesionales', 'Claridad en cada decisión.', 'Consultas', 'editorial', 'grid', true, 'steel', 'Página web'],
  ['Numa Contable', 'Estudio contable', 'Servicios profesionales', 'Tus números, en orden.', 'Panel de clientes', 'dash', 'grid', false, 'lime', 'Software a medida'],
  ['Vía Austral', 'Agencia de viajes', 'Turismo', 'Viajes que se recuerdan.', 'Destinos 2027', 'center', 'arch', true, 'ocean', 'Página web'],
  ['Hotel Cardón', 'Hotel boutique', 'Turismo', 'Silencio, paisaje y calma.', 'Reservá tu estadía', 'split', 'arch', true, 'forest', 'Página web'],
  ['Obra Prima', 'Constructora', 'Construcción', 'Construimos con precisión.', 'Proyectos', 'editorial', 'stripes', false, 'sand', 'Página web'],
  ['Motorhaus', 'Concesionaria', 'Automotor', 'Tu próximo auto, sin vueltas.', 'Stock disponible', 'shop', 'stripes', false, 'noir', 'E-commerce'],
  ['Nodo Cloud', 'Software SaaS', 'Tecnología', 'Tu operación, en un solo panel.', 'Probalo gratis', 'dash', 'grid', false, 'midnight', 'Software a medida'],
  ['Fondo Claro', 'Fintech', 'Tecnología', 'Finanzas simples para pymes.', 'Abrí tu cuenta', 'center', 'blob', false, 'steel', 'Landing page'],
  ['Miga Madre', 'Panadería artesanal', 'Gastronomía', 'Masa madre, todos los días.', 'Pedidos', 'split', 'circle', true, 'cream', 'Página web'],
  ['Bodega Altura', 'Vinos de autor', 'Gastronomía', 'Viñedos a 1.800 metros.', 'Club de vinos', 'shop', 'arch', true, 'plum', 'E-commerce'],
  ['Oro Lento', 'Joyería', 'Moda', 'Piezas para toda la vida.', 'Colección', 'editorial', 'circle', true, 'noir', 'Shopify'],
  ['Hábitat Studio', 'Decoración', 'Hogar', 'Espacios con carácter.', 'Catálogo', 'shop', 'arch', true, 'sand', 'E-commerce'],
  ['Trazo Arquitectos', 'Arquitectura', 'Construcción', 'Arquitectura que se habita.', 'Obras', 'editorial', 'grid', false, 'steel', 'Página web'],
  ['Patitas Vet', 'Veterinaria', 'Salud', 'Tu mascota, en buenas manos.', 'Turnos', 'split', 'blob', false, 'sun', 'Página web'],
  ['Sonrisa 360', 'Odontología', 'Salud', 'Sonreí con confianza.', 'Pedí tu turno', 'center', 'circle', false, 'ocean', 'Landing page'],
  ['Mente Serena', 'Psicología', 'Salud', 'Un espacio para escucharte.', 'Sesiones online', 'split', 'blob', true, 'lime', 'Página web'],
  ['Gran Velada', 'Organización de eventos', 'Eventos', 'Momentos que no se olvidan.', 'Cotizá tu evento', 'center', 'arch', true, 'plum', 'Landing page'],
  ['Luz Norte Foto', 'Fotografía', 'Creativos', 'Historias en cada imagen.', 'Portfolio', 'editorial', 'stripes', true, 'noir', 'Página web'],
  ['Eco Sonoro', 'Escuela de música', 'Educación', 'Aprendé a tu ritmo.', 'Inscripciones', 'split', 'circle', false, 'sun', 'Página web'],
  ['Colmena Cowork', 'Coworking', 'Servicios', 'Trabajá en buena compañía.', 'Reservá un puesto', 'center', 'grid', false, 'lime', 'Página web'],
  ['Ruta Cargo', 'Logística', 'Logística', 'Envíos a tiempo, siempre.', 'Seguimiento', 'dash', 'stripes', false, 'steel', 'CRM / Sistema'],
  ['Escudo Seguros', 'Broker de seguros', 'Servicios profesionales', 'Protegé lo que construiste.', 'Cotizá online', 'split', 'grid', false, 'midnight', 'Landing page'],
  ['Manos Unidas', 'ONG', 'Comunidad', 'Juntos llegamos más lejos.', 'Doná', 'center', 'blob', true, 'terracotta', 'Página web'],
  ['Campo Vivo', 'Agro', 'Agro', 'Tecnología para el campo.', 'Monitoreo', 'dash', 'grid', false, 'forest', 'Software a medida'],
  ['Sol Pampa', 'Energía solar', 'Energía', 'Energía limpia para tu casa.', 'Calculá tu ahorro', 'center', 'circle', false, 'sun', 'Landing page'],
  ['Navaja Club', 'Barbería', 'Estética', 'Corte clásico, estilo propio.', 'Reservá', 'split', 'stripes', true, 'noir', 'Página web'],
  ['Agua Spa', 'Spa', 'Estética', 'Desconectá para reconectar.', 'Rituales', 'center', 'blob', true, 'forest', 'Página web'],
  ['Prana Yoga', 'Estudio de yoga', 'Fitness', 'Respirá. Mové. Sentí.', 'Clases', 'editorial', 'circle', true, 'cream', 'Página web'],
  ['Pétalo Skin', 'Cosmética natural', 'Estética', 'Rutinas simples, piel feliz.', 'Tienda', 'shop', 'blob', true, 'blush', 'Shopify'],
  ['Hoja Suelta', 'Librería', 'Cultura', 'Historias que te encuentran.', 'Novedades', 'shop', 'stripes', true, 'cream', 'E-commerce'],
  ['Trompo', 'Juguetería', 'Infancia', 'Jugar es cosa seria.', 'Catálogo', 'shop', 'circle', false, 'sun', 'E-commerce'],
  ['Cola Feliz', 'Pet shop', 'Mascotas', 'Todo para tu compañero.', 'Comprá online', 'shop', 'blob', false, 'lime', 'Shopify'],
  ['Flor de Tierra', 'Florería', 'Hogar', 'Flores frescas, a domicilio.', 'Armá tu ramo', 'split', 'arch', true, 'blush', 'E-commerce'],
  ['Lúpulo Sur', 'Cervecería', 'Gastronomía', 'Cerveza con identidad.', 'Bar y tienda', 'center', 'stripes', false, 'terracotta', 'Página web'],
  ['Mirada Óptica', 'Óptica', 'Salud', 'Vé el mundo con estilo.', 'Anteojos', 'shop', 'circle', false, 'steel', 'E-commerce'],
  ['Farma Vida', 'Farmacia', 'Salud', 'Tu farmacia, más cerca.', 'Pedidos online', 'dash', 'grid', false, 'ocean', 'CRM / Sistema'],
  ['Core Studio', 'Pilates', 'Fitness', 'Fuerza desde el centro.', 'Planes', 'split', 'arch', false, 'cream', 'Landing page'],
  ['Talento Uno', 'Consultora de RRHH', 'Servicios profesionales', 'Las personas correctas.', 'Búsquedas', 'dash', 'grid', false, 'midnight', 'CRM / Sistema'],
  ['Señal Creativa', 'Agencia de marketing', 'Creativos', 'Ideas que mueven marcas.', 'Casos', 'editorial', 'blob', false, 'plum', 'Branding'],
  ['Pipeline', 'CRM para ventas', 'Tecnología', 'Cerrá más, con menos esfuerzo.', 'Demo', 'dash', 'stripes', false, 'midnight', 'Software a medida'],
  ['Al Toque', 'App de delivery', 'Tecnología', 'Tu pedido, en minutos.', 'Descargá la app', 'center', 'circle', false, 'sun', 'Software a medida'],
  ['Centro Vital', 'Clínica de kinesiología', 'Salud', 'Volvé a moverte sin dolor.', 'Turnos', 'split', 'blob', false, 'lime', 'Página web'],
  ['Marea', 'Marca de trajes de baño', 'Moda', 'Verano todo el año.', 'Shop', 'shop', 'stripes', true, 'ocean', 'Shopify'],
  ['Raíz Orgánica', 'Almacén natural', 'Gastronomía', 'Comida real, de origen.', 'Pedí online', 'shop', 'arch', true, 'forest', 'E-commerce'],
];

const slugify = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'y').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const concepts: Concept[] = raw.map(([name, sector, group, headline, kicker, layout, motif, serif, palette, service]) => ({
  slug: slugify(name), name, sector, group, headline, kicker, layout, motif, serif, palette: P[palette], service,
}));

export const conceptGroups = [...new Set(concepts.map(concept => concept.group))];
