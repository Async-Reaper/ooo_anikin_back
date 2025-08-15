FROM node:22.0.0-alpine AS build

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY ./ /app/
COPY .env/ /app/

RUN yarn build
RUN yarn start:prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443 10000
ENTRYPOINT ["nginx", "-g", "daemon off;"]
