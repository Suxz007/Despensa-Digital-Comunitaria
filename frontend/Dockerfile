# Etapa 1: Compilación con Node.js
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias e instalarlas
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar la carpeta dist
COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiar la configuración de Nginx y los archivos compilados en la etapa anterior
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8090

CMD ["nginx", "-g", "daemon off;"]
