FROM bitnami/nginx:latest
COPY nginx.conf nginx_headers.conf nginx_common.conf nginx_en.conf nginx_nl.conf /opt/bitnami/nginx/conf/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
