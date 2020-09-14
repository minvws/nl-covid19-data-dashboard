# Stage 0 - Install dependancies
FROM node:12 as react-build-base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

# Validation stage
RUN yarn validate-json && generate-typescript

# Stage 1 - Build NL application
FROM node:12 as react-build-nl

ARG NEXT_PUBLIC_LOCALE=nl

WORKDIR /app
COPY --from=react-build-base /app/node_modules /app/node_modules
COPY . .
RUN yarn build

# Stage 2 - Build EN application
FROM node:12 as react-build-en

ARG NEXT_PUBLIC_LOCALE=en

WORKDIR /app
COPY --from=react-build-base /app/node_modules /app/node_modules
COPY . .
RUN yarn build


# Stage 3 - the production environment
FROM bitnami/nginx:latest

COPY --from=react-build-nl /app/out /app/nl
COPY --from=react-build-en /app/out /app/en

COPY nginx.conf nginx_headers.conf nginx_common.conf nginx_en.conf nginx_nl.conf /opt/bitnami/nginx/conf/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]