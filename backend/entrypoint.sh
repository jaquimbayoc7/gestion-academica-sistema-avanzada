#!/bin/sh
# ============================================================
# entrypoint.sh — Backend NestJS
# Ejecuta migraciones Prisma y luego arranca el servidor.
# Usado en producción / primer arranque con Docker Compose.
# ============================================================

set -e

echo "⏳ Esperando a que PostgreSQL esté listo..."
until pg_isready -h db -U "${POSTGRES_USER:-postgres}" 2>/dev/null; do
  echo "  PostgreSQL no listo, reintentando en 2s..."
  sleep 2
done
echo "✅ PostgreSQL listo."

echo "⏳ Generando cliente Prisma..."
npx prisma generate --schema=./prisma/schema.prisma

echo "⏳ Ejecutando migraciones Prisma..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "✅ Migraciones aplicadas. Iniciando servidor..."
exec "$@"
