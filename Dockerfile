# Install dependencies only when needed
FROM node:alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install all the packages including dev packages
COPY package.json yarn.lock .
COPY packages/app/package.json /app/packages/app/package.json
COPY packages/common/package.json /app/packages/common/package.json

RUN yarn install --frozen-lockfile

# Build the application
COPY . .
RUN npx next telemetry disable
RUN yarn workspace @corona-dashboard/common build
RUN yarn workspace @corona-dashboard/app build

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app/packages/app/.next
USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]