#!/usr/bin/env bash
# Respaldo manual completo. Uso:  SUPABASE_DB_URL='postgresql://...' ./scripts/backup-local.sh
set -euo pipefail
: "${SUPABASE_DB_URL:?Falta SUPABASE_DB_URL (Supabase > Connect > Session pooler)}"
out="respaldo-velour-$(date +%Y%m%d-%H%M).dump"
pg_dump "$SUPABASE_DB_URL" --schema=public --schema=auth --no-owner --no-privileges -Fc -f "$out"
echo "Listo: $out  (guardalo FUERA del repositorio: contiene datos personales)"
