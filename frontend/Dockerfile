FROM nginx:alpine

# Copiar la configuración de Nginx (puerto 8090 y proxy a 9099)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el código fuente del frontend
COPY index.html /usr/share/nginx/html/
COPY src /usr/share/nginx/html/src
COPY styles /usr/share/nginx/html/styles
COPY assets /usr/share/nginx/html/assets

EXPOSE 8090

CMD ["nginx", "-g", "daemon off;"]
