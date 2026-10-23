/**
 * POLÍTICA DE PRIVACIDAD v2 — APROBADA por la dirección el 23/10/2026 (plazo 24 meses; responsable: Velour Studio).
 *
 * `approved: false` → /privacidad sigue mostrando el texto vigente. Para publicar:
 *   1) Campos completados (responsable: Velour Studio; plazo: 24 meses). Revisar con asesoría legal cuando haya razón social.
 *   2) Cambiar `approved` a true y subir CONSENT_VERSION en lib/leads/store.ts a 'privacidad-2026-11' (o la fecha real),
 *      para que cada lead registre qué versión del aviso aceptó.
 * Coherente con lo implementado: formularios → Supabase (CRM), aviso por email (Resend), atribución sin datos
 * personales en sessionStorage, conteos anónimos agregados, preferencia de tema en localStorage, cookies HttpOnly
 * solo en el panel privado. Marco: Ley 25.326 (Argentina). No es asesoramiento legal.
 */
export const privacyPolicy = {
  approved: true,
  version: 'privacidad-2026-11',
  updated: '23 de octubre de 2026',
  sections: [
    { title: 'Quién es responsable', body: [
      'Velour Studio es responsable de los datos que nos enviás a través de este sitio. Para cualquier consulta sobre privacidad escribinos a velousstudio@gmail.com.',
    ] },
    { title: 'Qué datos recopilamos', body: [
      'Cuando completás un formulario: nombre, email y mensaje; y, si los indicás, empresa, WhatsApp, tipo de proyecto, para quién es, situación actual y presupuesto orientativo.',
      'Para saber cómo nos encontraste guardamos, junto con tu consulta, la página por la que llegaste, el dominio de origen (sin la dirección completa) y las etiquetas de campaña (utm) si el enlace las tenía. Descartamos cualquier etiqueta que parezca un dato personal.',
      'Medimos el uso del sitio con contadores anónimos y agregados por día (por ejemplo, cuántos formularios se iniciaron o cuántas veces se tocó un botón de contacto). Esos contadores no guardan IP, cookies ni ningún dato que te identifique.',
      'No pedimos datos sensibles. Por favor, no los incluyas en tu mensaje.',
    ] },
    { title: 'Para qué los usamos', body: [
      'Usamos tus datos únicamente para responder tu consulta, entender lo que necesitás, preparar una propuesta y hacer el seguimiento comercial de esa solicitud. Al enviar el formulario prestás tu consentimiento para este uso.',
      'No enviamos correos comerciales automáticos, no vendemos ni cedemos tus datos y no los usamos para publicidad.',
    ] },
    { title: 'Dónde se guardan y quién accede', body: [
      'Las consultas se guardan en una base de datos con acceso restringido al equipo autorizado de Velour Studio, con usuarios individuales y permisos por rol. Cada cambio queda registrado.',
      'Para operar usamos estos proveedores, que tratan los datos por cuenta nuestra: Vercel (alojamiento del sitio), Supabase (base de datos y acceso al panel interno) y Resend (envío del aviso interno de cada consulta y de los correos de acceso del equipo). Sus servidores pueden estar ubicados fuera de Argentina, incluidos los Estados Unidos.',
      'Los botones de WhatsApp, email y redes te llevan a servicios externos con sus propias políticas. Tocar el botón de WhatsApp no nos envía tus datos.',
    ] },
    { title: 'Almacenamiento en tu navegador', body: [
      'No usamos cookies publicitarias ni de seguimiento. El sitio guarda en tu navegador, sin enviarnos nada por sí solo: tu preferencia de tema claro u oscuro (almacenamiento local) y, mientras dura la visita, la página de llegada y las etiquetas de campaña (almacenamiento de sesión), que solo se adjuntan a tu consulta si enviás un formulario.',
      'El panel privado del equipo usa cookies técnicas de sesión, necesarias para iniciar sesión de forma segura. No se usan en las páginas públicas.',
    ] },
    { title: 'Cuánto tiempo los conservamos', body: [
      'Conservamos cada consulta durante 24 meses desde el último contacto y luego la eliminamos o la anonimizamos, salvo que exista una relación comercial que requiera conservarla por más tiempo.',
    ] },
    { title: 'Tus derechos', body: [
      'Podés pedir acceso, rectificación, actualización o supresión de tus datos escribiendo a velousstudio@gmail.com. Te respondemos dentro de los plazos legales.',
      'El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326.',
      'La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
    ] },
    { title: 'Cambios en esta política', body: [
      'Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha. Cada consulta registra la versión del aviso vigente al momento de enviarla.',
    ] },
  ],
};
