# ============================================================
# Dockerfile — Backend NestJS (desarrollo con hot-reload)
# ============================================================
# El código fuente se monta como volumen desde docker-compose;
# este Dockerfile solo instala las dependencias npm.
# ============================================================

FROM node:22-alpine3.21

RUN apk upgrade --no-cache

WORKDIR /app

# Instalar dependencias (el volumen del compose monta el source)
COPY package*.json ./
RUN npm ci

EXPOSE 3001

# Las migraciones se ejecutan manualmente desde el host:
#   cd backend && npx prisma migrate dev
# El contenedor solo arranca el servidor en modo watch.
CMD ["npm", "run", "start:dev"]
