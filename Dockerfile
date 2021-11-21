FROM node:14-alpine as build

ARG API_BASE_URL

ENV REACT_APP_API_BASE_URL=$API_BASE_URL

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk update && apk add python2 make g++ && rm -rf /var/cache/apk/
RUN apk add --no-cache git
RUN yarn install --production=false
COPY . ./
RUN yarn build

# Production Environment

FROM nginx:1.15.2-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN echo $'server { \n\
    listen 80; \n\
    location / { \n\
    root /usr/share/nginx/html; \n\
    index index.html index.htm; \n\
    try_files $uri $uri/ /index.html;\n\
    }\n\
    location /healthz {\n\
    add_header Content-Type text/plain;\n\
    return 200 "Dashboard react app health check";\n\
    }\n\
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

WORKDIR /usr/share/nginx/html

CMD ["nginx","-g","daemon off;"]