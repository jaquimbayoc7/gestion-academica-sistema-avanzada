#!/bin/sh
# ============================================================
# entrypoint.sh — Backend NestJS
# Ejecuta migraciones Prisma y luego arranca el servidor.
# Usado en producción / primer arranque con Docker Compose.
# ============================================================

set -e

echo "⏳ Ejecutando migraciones Prisma..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "✅ Migraciones aplicadas. Iniciando servidor..."
exec "$@"
