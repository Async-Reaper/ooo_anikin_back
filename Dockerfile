FROM node:22.0.0-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
COPY .env .

RUN yarn build

FROM node:22.0.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Устанавливаем Nginx
RUN apk add --no-cache nginx

# Копируем конфиг Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Стартовый скрипт
RUN echo -e '#!/bin/sh\n\
  nginx\n\
  yarn start:prod\n\
  wait -n $$(jobs -p)\nexit $?' > /start.sh && chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]