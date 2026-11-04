FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY src /usr/share/nginx/html/src
COPY styles /usr/share/nginx/html/styles
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
