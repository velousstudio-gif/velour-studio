# Respaldo y restauración del CRM (sin costo)

El plan Free de Supabase **no** ofrece respaldos descargables propios. Este es el sistema oficial de Velour.
Los respaldos contienen datos personales: guardalos fuera del repositorio, en un lugar privado (nunca en GitHub público).

## Método principal — Respaldo completo desde el CRM (semanal, 1 clic)
1. Entrar a `/crm` como administrador → **Leads** → **Respaldo completo**.
2. Se descarga `velour-crm-respaldo-AAAA-MM-DD.json` con: perfiles del equipo, leads, notas, tareas, historial, eventos y auditoría.
   No incluye contraseñas ni tokens. Cada descarga queda registrada en la auditoría.
3. Guardarlo en una carpeta privada (p. ej. tu Drive personal). Conservar al menos las 4 últimas semanas.

Solo un administrador puede descargarlo (lo verifica la base de datos, no solo la página).

## Restaurar
Seguro de repetir: inserta solo lo que falta; nunca pisa ni borra filas.

1. Proyecto destino (el mismo, si se perdieron datos; o uno nuevo y vacío, si se perdió el proyecto):
   en uno nuevo, ejecutar en el SQL Editor, en orden, `supabase/migrations/20261022000000_crm_init.sql` y `20261023000000_crm_backup.sql`.
2. Crear el archivo `.env.restore` en la carpeta del proyecto (está excluido de Git por `.env*`):
   ```
   RESTORE_SUPABASE_URL=https://<proyecto-destino>.supabase.co
   RESTORE_SUPABASE_SECRET_KEY=<clave secreta del proyecto destino>
   ```
3. Simulación (no escribe nada): `npm run restore:backup -- ruta/al/respaldo.json`
4. Restauración: `npm run restore:backup -- ruta/al/respaldo.json --confirmar`
   - Crea en Auth los usuarios del equipo que falten (sin contraseña: cada uno usa «Olvidé mi contraseña»).
   - Restaura las tablas en orden y **sin generar historial duplicado**.
5. Si fue un proyecto nuevo: actualizar las variables `SUPABASE_*` en Vercel, reconfigurar Auth (registro público desactivado,
   contraseña mínima 12, URLs y SMTP) y redeployar. Verificar con `npm run check:supabase`.
6. Borrar `.env.restore` al terminar.

## Prueba de restauración (registro)
| Fecha | Dónde | Resultado |
|---|---|---|
| 23-10-2026 | Automática (`npm run test:crm`, prueba «respaldo completo…»): respaldo real generado por un admin → base nueva y vacía con las mismas migraciones → restauración | Todas las tablas idénticas al respaldo; repetirla no duplica filas; el historial no se duplica y vuelve a funcionar después; colaborador, usuario sin perfil y anónimo no pueden respaldar ni restaurar. |
| Pendiente | Simulacro real en un segundo proyecto Supabase Free (opcional, requiere tu autorización para crearlo) | — |

La prueba automática corre en cada `npm run test:crm`, así que cualquier cambio futuro de la base que rompa la restauración se detecta antes de desplegar.

## Método alternativo — Volcado completo de Postgres (`pg_dump`)
Copia exacta de toda la base, útil antes de cambios grandes. Requiere PostgreSQL client 17 en la PC.
1. Supabase → **Connect** → *Session pooler* → copiar la cadena `postgresql://...` (reemplazar `[YOUR-PASSWORD]`).
2. `SUPABASE_DB_URL="la-cadena" ./scripts/backup-local.sh` → genera `respaldo-velour-AAAAMMDD-HHMM.dump`.
3. Restaurar en un proyecto vacío: `pg_restore --clean --if-exists --no-owner -d "CADENA_DESTINO" archivo.dump`.

La automatización con GitHub Actions (`supabase/backup-supabase.yml.txt`) queda **preparada pero desactivada**: solo se usa si el
repositorio es privado y lo autorizás (secreto `SUPABASE_DB_URL` y variable `BACKUP_ENABLED=true`). No se usa como forma de
evitar la pausa del plan Free.
