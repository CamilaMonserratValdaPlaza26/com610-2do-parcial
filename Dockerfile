# Etapa 1: instala solo las dependencias de produccion
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Etapa 2: imagen final, solo con lo necesario para ejecutar la API
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# SHA del commit con el que se construyo la imagen (se muestra en /health)
ARG GIT_SHA=local
ENV GIT_SHA=$GIT_SHA

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY src ./src

# La configuracion de RDS NO va en la imagen: llega por variables de entorno
# al ejecutar el contenedor (docker run --env-file ...)
USER node
EXPOSE 3000
CMD ["node", "server.js"]
