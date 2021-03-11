# Run build.sh before building this.
FROM bitnami/nginx:latest
COPY exports/nl/out /app/nl
COPY exports/en/out /app/en

COPY packages/app/nginx.conf \
        packages/app/nginx_headers.conf \
        packages/app/nginx_common.conf \
        packages/app/nginx_en.conf \
        packages/app/nginx_nl.conf \
        /opt/bitnami/nginx/conf/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]