# Stage 0 - Install dependancies
FROM node:14 as react-build-base
WORKDIR /app
COPY . .
RUN yarn

# Validation stage
RUN yarn workspace @corona-dashboard/cli validate-json
RUN yarn workspace @corona-dashboard/cli generate-typescript
RUN yarn workspace @corona-dashboard/cms images

# Stage 1 - Build NL application
FROM node:14 as react-build-nl
ARG NEXT_PUBLIC_LOCALE=nl
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG SANITY_AUTH_TOKEN

WORKDIR /app
COPY --from=react-build-base /app/node_modules /app/node_modules
COPY --from=react-build-base /app/packages/app/ /app/packages/app/node_modules
COPY . .
RUN yarn workspace @corona-dashboard/common build
RUN yarn workspace @corona-dashboard/app build
RUN yarn workspace @corona-dashboard/app export

# Stage 2 - Build EN application
FROM node:14 as react-build-en
ARG NEXT_PUBLIC_LOCALE=en
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG SANITY_AUTH_TOKEN

WORKDIR /app
COPY --from=react-build-base /app/node_modules /app/node_modules
COPY --from=react-build-base /app/packages/app/ /app/packages/app/node_modules
COPY . .
RUN yarn workspace @corona-dashboard/common build
RUN yarn workspace @corona-dashboard/app build
RUN yarn workspace @corona-dashboard/app export

# Stage 3 - the production environment
FROM bitnami/nginx:latest
COPY --from=react-build-nl /app/packages/app/out /app/nl
COPY --from=react-build-en /app/packages/app/out /app/en
COPY --from=react-build-base /app/packages/app/nginx.conf \
        /app/packages/app/nginx_headers.conf \
        /app/packages/app/nginx_common.conf \
        /app/packages/app/nginx_en.conf \
        /app/packages/app/nginx_nl.conf \
        /opt/bitnami/nginx/conf/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
