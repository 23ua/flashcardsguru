FROM node:8.16-alpine

WORKDIR /usr/src/app

COPY frontend .

RUN npm --no-optional install && npm run build


FROM umputun/nginx-le

COPY --from=0 /usr/src/app/static /usr/share/files/static
COPY docker/frontend/nginx-service.conf /etc/nginx/conf.d/service.conf
