# Install dependencies only when needed
FROM node:lts-alpine AS deps

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED=1

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY ./.yarn/releases ./.yarn/releases
COPY ./.yarn/plugins ./.yarn/plugins
COPY packages/app/package.json ./packages/app/
COPY packages/cli/package.json ./packages/cli/
COPY packages/cms/package.json ./packages/cms/
COPY packages/common/package.json ./packages/common/
COPY packages/icons/package.json ./packages/icons/
RUN apk add --no-cache --virtual \
      build-dependencies \
      python3 \
      g++ \
      build-base \
      cairo-dev \
      jpeg-dev \
      pango-dev \
      musl-dev \
      giflib-dev \
      pixman-dev \
      pangomm-dev \
      libjpeg-turbo-dev \
      freetype-dev \
    && yarn install \
    && apk del build-dependencies \
    && apk add --no-cache \
      cairo \
      jpeg \
      pango \
      musl \
      giflib \
      pixman \
      pangomm \
      libjpeg-turbo \
      freetype

# Layer cache for rebuilds without sourcecode changes.
# This relies on the JSONS being downloaded by the builder.
FROM deps as builder
COPY . .
RUN yarn workspace @corona-dashboard/common build \
&& yarn workspace @corona-dashboard/cli generate-data-types \
&& yarn workspace @corona-dashboard/icons build \
&& yarn test:ci

# Map arguments to environment variables
ARG ARG_NEXT_PUBLIC_SANITY_DATASET
ARG ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ARG ARG_NEXT_PUBLIC_COMMIT_ID
ARG ARG_NEXT_PUBLIC_PHASE="production"
ARG ARG_NEXT_PUBLIC_HOT_RELOAD_LOKALIZE=0
ARG ARG_ACTIVE_DATA_URL
ARG ARG_ARCHIVED_DATA_URL
ARG ARG_NEXT_HOST_URL_STG

ENV NEXT_PUBLIC_SANITY_DATASET=$ARG_NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_COMMIT_ID=$ARG_NEXT_PUBLIC_COMMIT_ID
ENV NEXT_PUBLIC_PHASE=$ARG_NEXT_PUBLIC_PHASE
ENV NEXT_PUBLIC_HOT_RELOAD_LOKALIZE=ARG_NEXT_PUBLIC_HOT_RELOAD_LOKALIZE
ENV ACTIVE_DATA_URL=$ARG_ACTIVE_DATA_URL
ENV ARCHIVED_DATA_URL=$ARG_ARCHIVED_DATA_URL
ENV NEXT_HOST_URL_STG=$ARG_NEXT_HOST_URL_STG

# Layer that always gets executed
FROM builder

RUN yarn download \
&& yarn workspace @corona-dashboard/cli validate-json-all \
&& yarn workspace @corona-dashboard/cli validate-last-values --fail-early \
&& yarn workspace @corona-dashboard/cms lokalize:import --dataset=$NEXT_PUBLIC_SANITY_DATASET \
&& yarn workspace @corona-dashboard/app build \
&& mkdir -p /app/packages/app/public/images/choropleth \
&& addgroup -g 1001 -S nodejs \
&& adduser -S nextjs -u 1001 \
&& chown -R nextjs:nodejs /app/packages/app/.next \
&& chown -R nextjs:nodejs /app/packages/app/public/images/choropleth

USER nextjs

CMD ["yarn", "start"]
