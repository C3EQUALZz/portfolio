# План доменного слоя

Источник контента — `Nocturne/templates/portfolio/Portfolio.dc.html` (шаблон «Engineer
portfolio»). Дизайн-система переносится отдельно; здесь только модель предметной области.

Статус: черновик под грилинг. Решения ниже — рекомендации с обоснованием, не факты.

## Ограниченные контексты

Три фичи вместо шести. Резюме — это не шесть независимых сущностей, а один документ,
который всегда читается целиком; дробить его на `profile` / `experience` / `stack` значит
получить три фичи, которые не могут существовать друг без друга (ложные границы).

| Фича       | Почему отдельный контекст                                                                           | Агрегат       |
| ---------- | --------------------------------------------------------------------------------------------------- | ------------- |
| `resume`   | Один документ, один источник, общие инварианты (сумма опыта выводится из ролей)                     | `Resume`      |
| `projects` | Другой жизненный цикл: позже приедет из GitHub API (звёзды, последний коммит) — свой источник и TTL | `Project`     |
| `contact`  | Единственная фича с поведением, а не показом: форма обратной связи, отправка сообщения              | `ContactBook` |

`navigation` фичей не делаем: разделы навигации выводятся из наличия контента, это работа
app-shell'а, а не бизнес-правило.

## shared/kernel

Примитивы без фреймворка, общий словарь между контекстами.

```ts
// result.ts — ошибки как значения, без исключений
type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };
ok<T>(value: T): Result<T, never>;
err<E>(error: E): Result<never, E>;
map / flatMap / unwrapOr / collect(results): Result<readonly T[], E>   // collect для списков

// brand.ts
declare const brand: unique symbol;
type Brand<T, Name extends string> = T & { readonly [brand]: Name };

// primitives
NonEmptyString.create(raw: string): Result<NonEmptyString, EmptyString>
Slug.create(raw: string): Result<Slug, InvalidSlug>            // ^[a-z0-9]+(-[a-z0-9]+)*$
HttpsUrl.create(raw: string): Result<HttpsUrl, InvalidUrl>     // только https
EmailAddress.create(raw: string): Result<EmailAddress, InvalidEmail>
PhoneNumber.create(raw: string): Result<PhoneNumber, InvalidPhone>   // E.164

// время
YearMonth.create(year: number, month: number): Result<YearMonth, InvalidYearMonth>
YearMonth.compare(a, b): -1 | 0 | 1
Period.create(start: YearMonth, end: YearMonth | 'present'): Result<Period, InvalidPeriod>
Period.durationInMonths(period, asOf: YearMonth): number   // включительный счёт: (end − start) + 1
Period.isOngoing(period): boolean
Period.overlaps(a, b): boolean

// общий словарь технологий
Technology.create(name: string): Result<Technology, InvalidTechnology>   // { name, slug }

// локализация контента
LocalizedText.create(input: { en: string; ru: string }): Result<LocalizedText, InvalidLocalizedText>
// обе локали обязательны; выбор текущей — забота UI, домен про локали-переключатели не знает
```

`Technology` в ядре осознанно: одна и та же «PostgreSQL» упоминается в тегах роли и в чипе
стека, и расхождение написаний — реальный баг. Это shared kernel в смысле DDD, а не
случайная утилита.

**Домен не форматирует строки.** `durationInMonths` возвращает число, `{ years, months }`
собирает UI — «9 месяцев» / «9 months» это локаль, а не предметная область. Исключение —
литеральные impact'ы (`compile-time`, `horizontal`), которые изначально написаны словами.

## features/resume/domain

### Агрегат `Resume`

```ts
Resume.create(input: ResumeInput): Result<Resume, ResumeError>

// инварианты
// - experiences не пусты, id уникальны
// - периоды experiences не пересекаются (параллельных работ не бывает; перерывы — норма)
// - не более одной роли с period.end === 'present'
// - skillGroups не пусты, внутри группы технологии не повторяются
// - languages содержат ровно один 'native'

// выводимые запросы
totalExperience(resume, asOf: YearMonth): { years: number; months: number }
currentRole(resume): Experience | undefined
experiencesByRecency(resume): readonly Experience[]
technologies(resume): readonly Technology[]   // объединение по всем ролям
```

`totalExperience` — единственная нетривиальная логика в модели. Из-за инварианта «периоды
не пересекаются» это **сумма длительностей, а не объединение интервалов**: перерывы между
работами (реальный пробел Dec 2024 — Jun 2025 подтверждён) в стаж не входят сами собой.
Инвариант ловит опечатки в датах на этапе разбора контента.

Побочный эффект: в шаблоне hero написано «Three and a half years», а по датам выходит
3 года 8 месяцев (28 + 7 + 9 месяцев, без пересечений). Смысл вывода в том, чтобы цифра
переставала врать при следующем обновлении резюме.

Кольцо иконок в hero кормится из `lead`-технологий SkillGroups — оно перестаёт быть
отдельным захардкоженным списком, а акценты получают второе применение.

### Сущность `Experience`

```ts
Experience.create(input): Result<Experience, ExperienceError>
// id: Slug, period: Period, position, company: Company, product: NonEmptyString,
// engagement: Engagement, impacts, achievements, technologies

type Engagement = 'on-site' | 'remote' | 'hybrid' | 'outstaff';

// инварианты: минимум одно achievement, метки impact'ов уникальны, technologies не пусты
duration(experience, asOf): number   // месяцы
isOngoing(experience): boolean
```

Ограничения на количество impact'ов нет: «четыре в ряд» — это сетка вёрстки, а не правило
предметной области. Переполнение решает UI.

### `Impact` — типизированный union вместо data-атрибутов

В шаблоне impact закодирован тройкой `data-count` / `data-prefix` / `data-suffix`, а
литеральные значения (`seconds`, `horizontal`) — просто текстом в том же слоте. В модели это
два разных случая:

```ts
type Impact = { readonly label: NonEmptyString; readonly value: ImpactValue };

type ImpactValue =
  | { readonly kind: 'numeric'; readonly amount: number; readonly unit: ImpactUnit; readonly direction: ImpactDirection }
  | { readonly kind: 'literal'; readonly text: NonEmptyString };

type ImpactUnit = 'percent' | 'times' | 'milliseconds' | 'none';
type ImpactDirection = 'increase' | 'decrease' | 'absolute';

isAnimatable(value: ImpactValue): boolean   // true только для numeric
```

`−40%` становится `{ amount: 40, unit: 'percent', direction: 'decrease' }`. Знак и суффикс
рисует UI, счётчик анимируется только там, где `isAnimatable`.

### Остальные value objects

```ts
Person            { name, headline, roleHeadlines: readonly NonEmptyString[], summary }
Availability      { status: 'open' | 'closed', base: City, relocatesTo: readonly City[], employment }
Company           { name, site?: HttpsUrl }
Achievement       { lead: NonEmptyString, detail: NonEmptyString }   // жирный зачин + текст
SkillGroupEntry   { technology: Technology, emphasis: 'lead' | 'supporting' }
SkillGroup        { title: NonEmptyString, entries: readonly SkillGroupEntry[] }   // непустая
Highlight         { topic: HighlightTopic, text: NonEmptyString }
Education         { institution, program, city, graduationYear }
LanguageSkill     { language, level: 'native' | 'a1'..'c2' }
Credential        { title, issuer?, year? }
```

`emphasis: 'lead' | 'supporting'` вместо «accent / neutral»: домен говорит, что важно, UI
решает, какого это цвета. Аналогично `HighlightTopic` — union (`architecture`,
`open-source`, `collaboration`), а Phosphor-иконку подбирает UI-слой.

### Порт

```ts
interface ResumeRepository {
  load(): Promise<Result<Resume, ResumeUnavailable>>;
}
```

`Promise`, не `Observable`: домен не знает про RxJS (это правило проверяется линтером).
Angular-адаптер обернёт в `resource()` в application-слое.

## features/projects/domain

```ts
Project.create(input): Result<Project, ProjectError>
// id: Slug, name, tagline, description, repository: HttpsUrl,
// language: Technology, kind: 'library' | 'application' | 'tool', topics: readonly Topic[]

// инварианты: topics 1..4, id согласован с name

interface ProjectRepository {
  list(): Promise<Result<readonly Project[], ProjectsUnavailable>>;
}
```

Четыре dishka-интеграции из шаблона ложатся сюда один-в-один. Метаданные GitHub (звёзды,
дата коммита) в модель пока не входят — добавятся как отдельное VO, когда появится адаптер.

## features/contact/domain

```ts
type ContactChannel =
  | { readonly kind: 'email'; readonly address: EmailAddress }
  | { readonly kind: 'telegram'; readonly handle: TelegramHandle }
  | { readonly kind: 'phone'; readonly number: PhoneNumber }
  | { readonly kind: 'github'; readonly login: GitHubLogin };

toHref(channel: ContactChannel): HttpsUrl | MailtoUrl | TelUrl

ContactBook.create(input): Result<ContactBook, ContactError>
// инвариант: ровно один канал помечен preferred (в шаблоне это Telegram)
```

`toHref` держим в домене: это тотальная функция от канала с единственным правильным ответом
(`mailto:`, `tel:`, `https://t.me/…`), а не оформление. Ошибка здесь ломает связь с
работодателем — такое место хочется иметь под тестом.

Форма обратной связи — второй этап, потребует вернуть `@angular/forms` и порт
`OutreachSender`.

## Где живёт контент

`features/resume/infrastructure/content/resume.content.ts` — типизированный DTO-литерал,
рядом маппер `toResume(dto): Result<Resume, ResumeError>`. Спека
`resume.content.spec.ts` утверждает, что контент разбирается без ошибок.

Почему не JSON по HTTP сразу: TS-модуль проверяется компилятором, не требует сети и не
ломает пререндер. Порт остаётся тем же, поэтому переезд на JSON или GitHub API — замена
одного адаптера, а не переписывание.

Почему вообще `Result`, если контент свой и статический: как только он уедет во внешний
источник, валидация на границе окажется единственной защитой. Заодно «контент разбирается»
превращается в обычный юнит-тест, а домен становится тестируемым без Angular.

## Порядок работ

| Этап | Что                                                           | Проверка                     |
| ---- | ------------------------------------------------------------- | ---------------------------- |
| S0   | Грилинг этого плана, фиксация фактов резюме                   | —                            |
| S1   | `shared/kernel`: Result, Brand, примитивы, YearMonth/Period   | `test:domain`, 100% покрытие |
| S2   | `features/resume/domain`: VO → сущности → агрегат, инварианты | `test:domain` + Stryker      |
| S3   | `features/projects/domain`, `features/contact/domain`         | `test:domain`                |
| S4   | Порты + in-memory реализации для тестов                       | `arch`, `deadcode`           |
| S5   | Контент + мапперы в `infrastructure`                          | спека «контент разбирается»  |

После S5 — application-слой (use-cases на сигналах), затем UI и перенос дизайна.

Порядок внутри каждого этапа: сначала спека на инвариант, потом реализация. Домен весь
покрывается в node-окружении (`npm run test:domain`, пороги 95%), браузер не нужен.

## Открытые вопросы к грилингу

1. ~~**Считать месяцы включительно?**~~ → **решено:** включительно, `(end − start) + 1`.
   Правило фиксируется тестом на датах реального резюме; итоговый стаж 44 месяца.
2. ~~**Что делать с расхождением «3.5 года» и выводимых 3 г. 8 мес.?**~~ → **решено:**
   показывать выводимое. Авторской цифры стажа в контенте нет; hero берёт
   `totalExperience`, форма представления («3 года 8 месяцев») — забота UI.
3. ~~**Пробел Dec 2024 — Jun 2025**~~ → **решено:** перерыв реальный, даты верные, пропуски
   в стаже моделью поддерживаются.
4. ~~**Пересечения периодов**~~ → **решено:** параллельных работ не будет; инвариант
   «периоды не пересекаются», `totalExperience` — сумма длительностей.
5. ~~**Три фичи или больше.**~~ → **решено:** остаются `resume`, `projects`, `contact`.
   Планы на статьи и доклады — это будущие отдельные контексты со своими страницами,
   которые добавятся рядом, а не внутрь `resume`; заранее дробить нечего. Сертификаты
   за курсы — часть документа о кандидате, живут в `resume` как `Credential` (как
   `Education`); отдельный раздел на сайте — это UI-блок над тем же агрегатом.
6. ~~**Локализация.**~~ → **решено:** две локали (en, ru). Тексты обвязки UI — Transloco
   (runtime-словари, сигналы; plural-формы длительностей через messageformat). Контент
   резюме — `LocalizedText { en, ru }` в `shared/kernel`: обе версии лежат рядом в одном
   контент-файле, домен про переключение языка не знает, выбор локали — в UI-слое.
7. ~~**Кольцо технологий в hero**~~ → **решено:** кольцо берёт `lead`-технологии из
   SkillGroups — авторская выборка уже есть в модели, отдельного списка не заводим. UI
   режет до лимита (~18); спека контента проверяет, что `lead`-технологий не больше
   лимита кольца.
