# features — вертикальные срезы

Каждая папка здесь — самостоятельная фича со своими слоями:

```
<feature>/
  domain/          # сущности, value objects, порты. Чистый TypeScript
  application/     # use-cases и состояние. Только порты, никакого HTTP/DOM
  infrastructure/  # адаптеры портов: HTTP, storage, мапперы
  presentation/    # компоненты и страницы
  index.ts         # публичный API: то, что видят app-shell и другие фичи
```

Фича — чёрный ящик: снаружи импортируется только `index.ts`. Всё, что нужно
приложению (роуты, провайдеры, корневые компоненты), фича экспортирует сама.

Порядок разработки: `domain` → тесты домена → `application` → тесты use-cases →
`infrastructure` → `presentation` → интеграционные тесты.
