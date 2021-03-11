# Run build.sh before building this.
FROM bitnami/nginx:latest
COPY exports/nl /app/nl
COPY exports/en /app/en
COPY packages/app/nginx*conf opt/bitnami/nginx/conf/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]