# ============================================================
# Dockerfile — Frontend Next.js (desarrollo con hot-reload)
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

EXPOSE 3000

CMD ["npm", "run", "dev"]
