# Install dependencies only when needed
FROM node:alpine

# Map arguments to environment variables
ARG ARG_NEXT_PUBLIC_SANITY_DATASET
ARG ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ARG ARG_NEXT_PUBLIC_COMMIT_ID

ENV NEXT_PUBLIC_SANITY_DATASET=$ARG_NEXT_PUBLIC_SANITY_DATASET
ENV NEXT_PUBLIC_SANITY_PROJECT_ID=$ARG_NEXT_PUBLIC_SANITY_PROJECT_ID
ENV NEXT_PUBLIC_COMMIT_ID=$ARG_NEXT_PUBLIC_COMMIT_ID

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install all the packages including dev packages
COPY . .
RUN yarn install --frozen-lockfile

ENV NODE_ENV production

# Build the application
RUN npx next telemetry disable
RUN yarn workspace @corona-dashboard/common build

RUN yarn workspace @corona-dashboard/cli generate-typescript
RUN yarn workspace @corona-dashboard/cms lokalize:export
RUN yarn workspace @corona-dashboard/app build


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/packages/app/.next

USER nextjs

CMD ["yarn", "start"]