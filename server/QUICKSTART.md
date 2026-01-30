# Быстрый старт

## Предварительные требования

1. Node.js (версия 18 или выше)
2. PostgreSQL (версия 12 или выше)
3. npm или yarn

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне папки `server`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=slotly

JWT_SECRET=your-secret-key-change-in-production-min-32-chars
JWT_ACCESS_TOKEN_EXPIRES_IN=30m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development

# CORS настроен на разрешение всех источников в main.ts
# CORS_ORIGIN=http://localhost:5173
```

3. Создайте базу данных:
```sql
CREATE DATABASE slotly;
```

## Запуск

```bash
npm run start:dev
```

Сервер запустится на `http://localhost:3000`

## API Документация

После запуска откройте в браузере:
```
http://localhost:3000/api/docs
```

## Тестирование API

### 1. Регистрация пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Вход в систему
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Ответ содержит `access_token` и `refresh_token`.

### 3. Получить профиль (требует авторизации)
```bash
curl -X GET http://localhost:3000/api/owner/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Получить публичный профиль
```bash
curl -X GET http://localhost:3000/api/public/owner/PUBLIC_ID
```

### 5. Получить доступные слоты
```bash
curl -X GET "http://localhost:3000/api/public/schedule/PUBLIC_ID/slots?start_date=2026-02-01&end_date=2026-02-28"
```

### 6. Создать бронирование (публичный)
```bash
curl -X POST http://localhost:3000/api/bookings?ownerId=PUBLIC_ID \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "clientContact": "john@example.com",
    "date": "2026-02-15",
    "time": "10:00"
  }'
```

## Структура базы данных

После первого запуска TypeORM автоматически создаст следующие таблицы:
- `users` - пользователи системы
- `owner_profiles` - профили владельцев
- `schedules` - расписания работы
- `bookings` - бронирования
- `refresh_tokens` - токены обновления

## Примечания

- В development режиме TypeORM автоматически синхронизирует схему БД (`synchronize: true`)
- В production режиме используйте миграции (`npm run migration:generate` и `npm run migration:run`)
- Убедитесь, что JWT_SECRET достаточно длинный и безопасный в production
