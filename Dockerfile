# Stage 1
FROM node:12 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build
# Stage 2 - the production environment

# aangeleverd: FROM: nginx:alpine (draait op port :80, te weinig rechten)
#FROM nginx:alpine
FROM bitnami/nginx:latest

# aangeleverd:
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# geeft fouten
# 2020/06/01 09:39:58 [emerg] 1#0: "server" directive is not allowed here in /opt/bitnami/nginx/conf/nginx.conf:2
#  #nginx: [emerg] "server" directive is not allowed here in /opt/bitnami/nginx/conf/nginx.conf:2
#COPY nginx.conf /opt/bitnami/nginx/conf/nginx.conf

# aangeleverd:
#COPY --from=react-build /app/out /usr/share/nginx/html
COPY --from=react-build /app/out /app
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

#FROM node:13-alpine
#WORKDIR /app
#COPY --from=react-build /app/out ./build
#RUN yarn global add serve
#CMD ["serve", "-s", "-p", "8080", "build"]
