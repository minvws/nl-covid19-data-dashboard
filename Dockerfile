# Install dependencies only when needed
FROM node:alpine AS deps

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED=1

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/app/package.json ./packages/app/
COPY packages/cli/package.json ./packages/cli/
COPY packages/cms/package.json ./packages/cms/
COPY packages/common/package.json ./packages/common/
COPY packages/icons/package.json ./packages/icons/
RUN apk add --no-cache --virtual build-dependencies \
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
    && yarn install --frozen-lockfile --production=false \
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
&& yarn workspace @corona-dashboard/cli generate-typescript \
&& yarn workspace @corona-dashboard/icons build

# Map arguments to environment variables
ARG ARG_NEXT_PUBLIC_SANITY_DATASET
ARG ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ARG ARG_NEXT_PUBLIC_COMMIT_ID
ARG ARG_NEXT_PUBLIC_PHASE="production"
ARG ARG_API_URL

ENV NEXT_PUBLIC_SANITY_DATASET=$ARG_NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_COMMIT_ID=$ARG_NEXT_PUBLIC_COMMIT_ID
ENV NEXT_PUBLIC_PHASE=$ARG_NEXT_PUBLIC_PHASE
ENV API_URL=$ARG_API_URL

# Layer that always gets executed
FROM builder

# Yarn download uses the API_URL env variable to download the zip with JSONs from the provided URL.
RUN yarn download \
&& yarn workspace @corona-dashboard/cli validate-json-all \
&& yarn workspace @corona-dashboard/cli validate-last-values --fail-early \
&& yarn workspace @corona-dashboard/cli validate-features --fail-early \
&& yarn workspace @corona-dashboard/cms lokalize:export --dataset=$NEXT_PUBLIC_SANITY_DATASET \
&& yarn workspace @corona-dashboard/app build \
&& addgroup -g 1001 -S nodejs \
&& adduser -S nextjs -u 1001 \
&& chown -R nextjs:nodejs /app/packages/app/.next

USER nextjs

CMD ["yarn", "start"]
