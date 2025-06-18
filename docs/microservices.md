# Микросервисная архитектура

## Общая структура

```
services/
├── api-gateway/          # API Gateway
├── auth-service/         # Сервис аутентификации
├── profile-service/      # Сервис профилей
├── project-service/      # Сервис проектов
├── chat-service/         # Сервис чатов
├── notification-service/ # Сервис уведомлений
└── shared/              # Общие компоненты
```

## Описание сервисов

### API Gateway
- Единая точка входа для всех клиентских запросов
- Маршрутизация запросов к соответствующим сервисам
- Аутентификация и авторизация
- Балансировка нагрузки
- Кэширование

### Auth Service
- Аутентификация пользователей
- Управление сессиями
- JWT токены
- OAuth интеграции

### Profile Service
- Управление профилями пользователей
- Хранение персональных данных
- Управление настройками
- Загрузка и хранение аватаров

### Project Service
- Создание и управление проектами
- Поиск проектов
- Управление откликами
- Статусы проектов

### Chat Service
- Обмен сообщениями
- Управление чатами
- Уведомления о новых сообщениях
- История сообщений

### Notification Service
- Отправка уведомлений
- Управление подписками
- Шаблоны уведомлений
- Очереди сообщений

## Технологии

- Node.js + Express для всех сервисов
- MongoDB для хранения данных
- Redis для кэширования
- RabbitMQ для обмена сообщениями
- Docker для контейнеризации
- Kubernetes для оркестрации

## План миграции

1. Подготовка инфраструктуры
   - Настройка Docker
   - Настройка Kubernetes
   - Настройка CI/CD

2. Создание базовых сервисов
   - API Gateway
   - Auth Service
   - Profile Service

3. Миграция данных
   - Создание схем миграции
   - Перенос данных
   - Валидация данных

4. Обновление клиентского приложения
   - Адаптация API
   - Обновление аутентификации
   - Тестирование

5. Добавление новых сервисов
   - Project Service
   - Chat Service
   - Notification Service

## API Endpoints

### Auth Service
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### Profile Service
```
GET /api/profiles/:id
PUT /api/profiles/:id
POST /api/profiles/:id/avatar
```

### Project Service
```
GET /api/projects
POST /api/projects
GET /api/projects/:id
PUT /api/projects/:id
DELETE /api/projects/:id
```

### Chat Service
```
GET /api/chats
POST /api/chats
GET /api/chats/:id/messages
POST /api/chats/:id/messages
```

### Notification Service
```
GET /api/notifications
POST /api/notifications
PUT /api/notifications/:id
``` 