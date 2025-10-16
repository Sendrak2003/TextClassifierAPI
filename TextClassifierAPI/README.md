# Text Classifier API with Zod Validation

Профессиональный REST API для классификации и структурирования текстовых запросов с использованием OpenAI GPT и валидацией через Zod.

## Описание задачи

Необходимо реализовать конвертацию свободного текста в структурированный JSON формат.

**Endpoint `/classify`:**
- **Вход**: Свободный текст (например: "Закажи пиццу из Domino's на завтра в 18:00, ZIP 90210")
- **Выход**: JSON с полями `zip`, `brand`, `category`, `time_pref`

## Возможности

- **Интеллектуальная классификация** текста с помощью OpenAI GPT-4o-mini
- **Строгая валидация** ответов через Zod схемы
- **REST API** с полной документацией Swagger
- **Автоматическая обработка ошибок** и логирование
- **Поддержка русского языка** и различных форматов запросов

## Требования

- Node.js 18+
- OpenAI API ключ
- npm или yarn

## Установка

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd TextClassifierAPI
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте переменные окружения:**
```bash
# Создайте файл .env
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
echo "PORT=3000" >> .env
```

4. **Запустите сервер:**
```bash
npm start
```

## Использование

### API Endpoint

**POST** `/classify`

**Запрос:**
```json
{
  "text": "Закажи пиццу из Domino's на завтра в 18:00, ZIP 90210"
}
```

**Ответ:**
```json
{
  "zip": "90210",
  "brand": "Domino's",
  "category": "пицца",
  "time_pref": "завтра в 18:00"
}
```

### Примеры запросов

```bash
# cURL
curl -X POST http://localhost:3000/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "Нужны кроссовки Nike для бега, доставка в 12345"}'

# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/classify" \
  -Method POST \
  -ContentType "application/json" \
  -Body '{"text": "Купить iPhone 15 Pro Max, код 54321"}'
```

## Документация API

Интерактивная документация доступна по адресу:
**http://localhost:3000/docs**

Swagger UI предоставляет:
- Полное описание API
- Интерактивное тестирование
- Примеры запросов и ответов
- Схемы валидации

## Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │───▶│  Express API    │───▶│  OpenAI GPT     │
│   Request       │    │  Server         │    │  Classification │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Zod Validation │
                       │  Schema Check   │
                       └─────────────────┘
```

### Компоненты системы:

1. **Express Server** - REST API сервер
2. **OpenAI Integration** - GPT-4o-mini для классификации
3. **Zod Validation** - Строгая валидация ответов
4. **Swagger Documentation** - Автоматическая документация

## Технические детали

### Zod Схема валидации:
```typescript
const responseSchema = z.object({
  zip: z.string().nullable(),
  brand: z.string().nullable(), 
  category: z.string().nullable(),
  time_pref: z.string().nullable()
});
```

### OpenAI Конфигурация:
- **Модель**: GPT-4o-mini
- **Температура**: 0.2 (стабильные результаты)
- **Формат**: JSON Object
- **Валидация**: Zod схемы

## Коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успешная классификация |
| 400 | Отсутствует текст в запросе |
| 500 | Ошибка OpenAI API или валидации |

## Безопасность

- Валидация входных данных
- Обработка ошибок API
- Логирование запросов
- Защита от некорректных данных

## Тестирование

```bash
# Запуск тестов (если настроены)
npm test

# Проверка API
curl -X POST http://localhost:3000/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "test"}'
```

## Зависимости

```json
{
  "express": "^4.19.2",           // Web framework
  "openai": "^4.73.1",            // OpenAI API client
  "zod": "^3.23.2",               // Schema validation
  "swagger-jsdoc": "^6.2.8",      // Swagger documentation
  "swagger-ui-express": "^5.0.1", // Swagger UI
  "dotenv": "^16.4.5",            // Environment variables
  "body-parser": "^1.20.3"        // Request parsing
}
```

## Разработка

### Структура проекта:
```
TextClassifierAPI/
├── server.js          # Основной файл сервера
├── package.json       # Зависимости и скрипты
├── README.md         # Документация
├── .env              # Переменные окружения (не в git)
├── .gitignore        # Git исключения
└── node_modules/     # Зависимости
```

### Скрипты:
```bash
npm start          # Запуск сервера
npm install        # Установка зависимостей
```

## Логирование

Сервер логирует:
- Запуск на порту
- Ошибки API
- Некорректные запросы
- Проблемы валидации

## Обновления

### v1.0.0
- Базовая функциональность классификации
- Zod валидация
- Swagger документация
- Обработка ошибок

## Поддержка

При возникновении проблем:
1. Проверьте API ключ OpenAI
2. Убедитесь в наличии интернет-соединения
3. Проверьте логи сервера
4. Убедитесь в корректности JSON запроса

## Лицензия

MIT License - см. файл LICENSE для деталей.

---

**Разработано для эффективной классификации текста**