# Portfolio

Персональное резюме и портфолио одного человека как веб-приложение. Контексты:
`resume` — сам документ, `projects` — опубликованный открытый код, `contact` — связь с
кандидатом, `certificates` — сертификаты и их просмотр, `coding-stats` — статистика
с алгоритмических платформ (страница `/stats`). Пока термины лежат в одном файле;
при появлении кода фич разъедутся в `CONTEXT-MAP.md` и по-контекстные файлы.

## Resume

**Resume**:
Неизменяемый документ, описывающий одного человека как кандидата. Проверяется целиком при
разборе, дальше только читается — команд, меняющих его, не существует.
_Avoid_: CV, профиль, аккаунт, vitae

**Experience**:
Один период работы в одной компании над одним продуктом.
_Avoid_: Job, Employment, Role, стаж

**Position**:
Должность внутри Experience — «Middle Developer».
_Avoid_: Title, Grade, роль

**Engagement**:
Формат сотрудничества: on-site, remote, hybrid, outstaff.
_Avoid_: Contract, WorkMode, тип занятости

**Achievement**:
Изменение, которое кандидат внёс в рамках одной Experience. Не обязанность, а результат.
_Avoid_: Bullet, Responsibility, Duty, обязанность

**Impact**:
Утверждение о результате Experience. Метка задаёт вопрос, значение отвечает — числом
(«−40% нагрузки на менеджеров») либо словом («на компиляции»).
_Avoid_: Metric, KPI, Stat, Figure, цифра

**Technology**:
Именованный инструмент, язык или сервис. Написание одно на весь документ: «PostgreSQL», не
«Postgres» и не «postgresql».
_Avoid_: Tag, Tool, элемент стека

**TechnologyCluster**:
Несколько Technology, которые кандидат сознательно объединил в одну подпись под Experience,
с акцентом на весь кластер: «Frida · Androguard · YARA».
_Avoid_: Tag, Chip, Pill, тег

**SkillGroup**:
Озаглавленный раздел стека — «Data & transport» — и плоский список Technology внутри.
Акцент `lead | supporting` говорит, что кандидат считает важным; как акцент выглядит —
решает UI.
_Avoid_: Category, Skill, навык

**SkillGroupEntry**:
Элемент SkillGroup: Technology плюс акцент `lead | supporting`.
_Avoid_: Skill, навык

**Availability**:
Готовность кандидата к работе: открыт или нет, база, куда готов переехать.
_Avoid_: Status, OpenToWork, доступность

## Projects

**Project**:
Опубликованная библиотека с открытым кодом — в той части, которую пишет кандидат: название,
подзаголовок, описание, тип, темы.
_Avoid_: Repo, Package, Work, элемент портфолио

**RepositorySnapshot**:
Состояние репозитория на момент сборки: звёзды, основной язык, дата последнего коммита.
Принадлежит GitHub, кандидат его не редактирует и не может исправить.
_Avoid_: Stats, Metadata, GitHubData

**ShowcasedProject**:
Project вместе со своим RepositorySnapshot, если тот есть. Отсутствие снимка — нормальное
состояние, а не ошибка: проект показывается без звёзд.
_Avoid_: ProjectCard, ProjectView

## Contact

**ContactChannel**:
Один типизированный способ связаться с кандидатом: почта, Telegram, телефон, GitHub.
_Avoid_: Link, Social, контакт

## Coding Stats

**CodingPlatform**:
Алгоритмическая платформа, на которой у кандидата есть аккаунт: LeetCode, Codeforces,
Codewars. Закрытый union — новая платформа это новый член union'а и новый адаптер.
_Avoid_: Site, Service, источник

**CodingProfile**:
Снимок профиля кандидата на одной платформе, полученный из внешнего API в рантайме.
Валидируется целиком при разборе; недоступность профиля — нормальное состояние, а не
ошибка. Инвариант LeetCode: totalSolved равен сумме easy+medium+hard.
_Avoid_: Account, User, карточка

**PlatformFacts**:
Платформенная специфика профиля как дискриминированный union (по образцу ContactChannel):
рейтинги платформ несовместимы (Эло Codeforces, kyu Codewars, contest rating LeetCode),
поэтому общего поля «рейтинг» нет.
_Avoid_: Rating, Score, Stats

**CodingStatsSource**:
Порт загрузки одного профиля из внешнего API. Адаптеры — цепочка публичных прокси
для LeetCode (failover), официальные API для Codeforces и Codewars. Полный провал
цепочки — `AllSourcesUnavailable` с перечнем попыток.
_Avoid_: ApiClient, Service

**StatsCache**:
Порт read-through кэша страницы статистики (TTL и stale-while-revalidate — решения
application-слоя, localStorage — infrastructure). Просроченное значение показывается
с пометкой «кэшированная копия», пока идёт фоновое обновление.
_Avoid_: Store, Repository
