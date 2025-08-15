# Шаг 1: Сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Шаг 2: Запуск приложения
FROM node:18-alpine

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Устанавливаем зависимости для production (если нужно)
RUN npm ci --only=production

# Открываем порт, на котором работает приложение
EXPOSE 5000

# Команда для запуска приложения
CMD ["npm", "run", "start:prod"]

RUN apk add --no-cache nginx

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Стартовый скрипт (запускает и NestJS, и Nginx)
RUN echo -e '#!/bin/sh\n\
  nginx\n\
  npm run start:prod\n\
  wait -n $$(jobs -p)\nexit $?' > /start.sh && chmod +x /start.sh

EXPOSE 80 3000

CMD ["/start.sh"]
