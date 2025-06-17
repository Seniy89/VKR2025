# Digital Design Platform

Платформа для взаимодействия заказчиков и исполнителей в сфере digital-дизайна.

## Функциональность

- Регистрация и авторизация пользователей (заказчики и исполнители)
- Создание и управление проектами
- Портфолио исполнителей
- Система отзывов и рейтингов
- Чат между заказчиком и исполнителем
- Система оплаты

## Технологии

### Frontend
- React
- TypeScript
- Material-UI
- Redux
- React Router

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

## Установка

1. Клонируйте репозиторий
```bash
git clone [url-репозитория]
```

2. Установите зависимости
```bash
npm install
```

3. Создайте файл .env в корневой директории и добавьте следующие переменные:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Запустите приложение
```bash
# Для разработки (запуск и frontend, и backend)
npm run dev

# Только backend
npm run server

# Только frontend
npm run client
```

## Структура проекта

```
├── frontend/          # React frontend
├── backend/           # Express backend
│   ├── config/       # Конфигурация
│   ├── controllers/  # Контроллеры
│   ├── middleware/   # Middleware
│   ├── models/       # Mongoose модели
│   └── routes/       # API маршруты
└── package.json
``` 