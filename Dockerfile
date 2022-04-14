FROM node:latest as websbbuild

ARG NODE_ENV=staging
ARG NODE_SERVER_PORT=80
ARG REACT_APP_API_BASE_URL=https://staging.api.p9.karkee.biz/
ARG PUBLIC_URL=https://staging.dashbard.karkee.biz
ENV NODE_ENV=${NODE_ENV}
ENV NODE_SERVER_PORT=${NODE_SERVER_PORT}
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV PUBLIC_URL=${PUBLIC_URL}

RUN apt-get update && apt-get install vim curl tree gcc g++ make python -y

COPY . /app/.

RUN yarn
RUN yarn build

RUN rm -fR /var/cache/apk/*

FROM nginx

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=websbbuild /app/build /usr/share/nginx/html

RUN mkdir /usr/share/nginx/html/healthz
RUN echo "OK" > /usr/share/nginx/html/healthz/index.html

EXPOSE ${NODE_SERVER_PORT}

WORKDIR /var/www/html

CMD ["nginx","-g","daemon off;"]