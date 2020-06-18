# Stage 1
FROM node:12 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM bitnami/nginx:latest

COPY --from=react-build /app/out /app
COPY nginx.conf /opt/bitnami/nginx/conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]