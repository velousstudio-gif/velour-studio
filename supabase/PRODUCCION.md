# Puesta en producción del CRM — pasos y límites

## Límites del plan gratuito (verificado en la documentación oficial de Supabase)
- 500 MB de base, 50.000 usuarios activos/mes, 2 proyectos activos. Para un CRM comercial de esta escala sobra por años.
- **Pausa por inactividad:** si el proyecto casi no recibe actividad en 7 días se pausa; Supabase avisa por email ~1 semana antes. Con un pausado: los formularios no pueden guardar (cortan a los 8 s), el login del CRM no funciona. **No se pierden datos.**
- Qué hace la web si está pausado: el formulario sigue enviando el email al equipo con la leyenda "NO quedó registrada en el CRM"; si tampoco hay email, el visitante ve el error (nunca un éxito falso).
- Reactivar: Supabase → proyecto → **Resume project** (≈ 1–2 min). Se puede restaurar hasta 1 año (la página oficial dice 90 días en un título; asumí **90 días** por prudencia).
- Prevención: la actividad real del sitio (visitas, formularios, uso del CRM) cuenta como actividad. No se usan tareas artificiales para evitar la pausa; si ocurre, Supabase avisa por email y se reactiva con *Resume project*.
- Sin respaldos automáticos descargables en el plan gratuito → respaldo completo semanal desde el CRM (ver `BACKUP.md`). Plan Pro (USD 25/mes, opcional) elimina la pausa y agrega respaldos diarios.
- Emails de recuperación de clave: el SMTP incorporado de Supabase es solo de prueba y muy limitado. Para producción configurá SMTP propio (Resend) en Auth → SMTP (sin costo extra si ya usás Resend).

## Variables de entorno y despliegue
Ver `DEPLOY.md` (tabla completa de variables, verificación posterior y rollback).

## Verificación
`npm run check:supabase` (solo lectura) confirma: proyecto activo, anónimos sin acceso, migración aplicada, administrador presente.
