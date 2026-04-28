# ============================================================
# Dockerfile — Backend NestJS (desarrollo con hot-reload)
# ============================================================
# El código fuente se monta como volumen desde docker-compose;
# este Dockerfile solo instala las dependencias npm.
# Para producción usa: docker build --target prod
# ============================================================

FROM node:22-alpine3.21 AS base

RUN apk upgrade --no-cache && apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copiar el entrypoint para migraciones automáticas
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001

# Desarrollo: el código se monta como volumen; las migraciones
# se ejecutan automáticamente via entrypoint antes de arrancar.
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
