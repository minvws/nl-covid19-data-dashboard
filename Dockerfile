# Stage 0 - Install dependancies
FROM node:14 as react-build-base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn validate-json && yarn generate-typescript
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
