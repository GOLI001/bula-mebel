# Дизайн-система сайта b-line.it

> Извлечено детерминированно из кода сайта сервисом vibe.flekk.ru. Значения — точные, без домыслов. Разделы, которые не удалось прочитать, опущены.

## 1. Общая атмосфера

Система построена на тёмной основе, с единственным акцентным цветом `#0073CE`, фирменные скругления 4, 14, 32, 64px, глубина задаётся тенями, заголовки набраны гарнитурой UniversLTStd.

## 2. Цветовая палитра и роли

### Роли

- **Фон** `#000000`
- **Основной текст** `#000000`
- **Акцент** `#0073CE`
- **Ссылки / кнопки** `#000000`

### Вся палитра

- `#FFFFFF`
- `#006094`
- `#1A1A1A`

### Готовые токены сайта (CSS-переменные)

```css
:root {
  --color-orange: #e73b1d;
  --iub-granular-border: rgba(0, 0, 0, 0.08);
  --wp-admin-theme-color: #007cba;
  --wp-block-synced-color: #7a00df;
  --wp--preset--color--black: #000000;
  --wp--preset--color--white: #ffffff;
  --wp--preset--color--pale-pink: #f78da7;
  --wp--preset--color--vivid-red: #cf2e2e;
  --wp-admin-theme-color-darker-10: #006ba1;
  --wp-admin-theme-color-darker-20: #005a87;
  --wp--preset--color--vivid-purple: #9b51e0;
  --wp--preset--color--pale-cyan-blue: #8ed1fc;
  --wp--preset--color--vivid-cyan-blue: #0693e3;
  --wp--preset--color--cyan-bluish-gray: #abb8c3;
  --wp--preset--color--light-green-cyan: #7bdcb5;
  --wp--preset--color--vivid-green-cyan: #00d084;
  --wp--preset--color--luminous-vivid-amber: #fcb900;
  --wp--preset--color--luminous-vivid-orange: #ff6900;
}
```

## 3. Типографика

- **Заголовки:** UniversLTStd (самохостинг), веса 400
- **Текст:** helvetica-bold (самохостинг), веса 400

Фоллбек-стек: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

## 4. Размерная шкала

| Уровень | Размер |
|---|---|
| Текст | 58px |
| Заголовок H2 | 14px |
| Кнопки | 14px |

Интерлиньяж текста 1.4 · интерлиньяж заголовков 1.3.

## 5. Ритм и сетка

- **Базовый шаг сетки:** 4px (все отступы кратны ему)
- **Раскладка:** Flexbox
- **Скругления:** 4px, 14px, 32px, 64px
- **Обводки:** 1px/5px solid, цвета `#FFFFFF`, `#000000`, `#006094`

## 6. Компоненты

Стили сняты с реальных элементов страницы — значения точные.

### Кнопка

```css
background: #1A1A1A;
color: #FFFFFF;
border-radius: 64px;
padding: 8px 32px;
font-size: 14px;
font-weight: 700;
```

### Поле ввода

```css
color: #000000;
border: 1px solid;
border-radius: 0px;
padding: 0px;
font-size: 14px;
font-weight: 400;
```

### Карточка

```css
color: #000000;
border-radius: 0px;
padding: 0px 4px;
font-size: 14px;
font-weight: 400;
```

Состояния взяты из объявленных на сайте `:hover` / `:focus` правил — самые частотные значения.

### Наведение (hover)

```css
color: #000000;
opacity: 1;
transform: scale(1.1);
background: none;
box-shadow: none;
border-color: #000000;
text-decoration: none;
background-color: #FFFFFF;
```

### Фокус (focus)

```css
color: transparent;
opacity: 1;
outline: none;
text-decoration: none;
background-color: #DDDDDD;
```

## 7. Тени и глубина

Уровней высоты: 1.

```css
box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 48px 0px;
```

## 8. Движение

```css
transition: 0.4s ease;
transition: 1s ease;
transition: 1.5s ease;
```

На сайте есть собственные `@keyframes`-анимации, а не только переходы.

## 9. Под капотом

- **Собран на:** WordPress
- **Анимация / слайдеры:** Slick, jQuery

## 10. Адаптивность

Из `@media`-правил сайта: что переопределяется на каждой точке (в скобках — сколько правил).

| Точка | Условие | Что меняется |
|---|---|---|
| 992px | от 992px | отступы (10), ширина (3), высота (1), интервалы (1) |
| 991px | до 991px | отступы (2), ширина (2), показ/скрытие блоков (2) |
| 960px | до 960px | отступы (288), ширина (100), кегль (90), высота (72) |
| 799px | до 799px | показ/скрытие блоков (1), позиционирование (1), ширина (1), высота (1) |
| 782px | от 782px | отступы (4), показ/скрытие блоков (2), высота (2), позиционирование (2) |
| 700px | от 700px | показ/скрытие блоков (1), позиционирование (1), ширина (1), высота (1) |
| 640px | от 640px | отступы (7), позиционирование (2), ширина (1), направление раскладки (1) |
| 639px | до 639px | порядок блоков (2), отступы (2), направление раскладки (1), показ/скрытие блоков (1) |

Подход desktop-first: базовые стили — десктопные, правила сужают вниз (`max-width`).

## 11. Можно / Нельзя

### Можно

- Использовать `#0073CE` как единственный акцент для всех интерактивных элементов
- Применять фирменные скругления: 4px, 14px, 32px, 64px
- Держать все отступы кратными базовому шагу 4px

### Нельзя

- Смешивать несколько акцентных цветов в одной композиции

## 12. Шпаргалка для ИИ-агента

Быстрый справочник цветов:

- **Фон:** `#000000`
- **Текст:** `#000000`
- **Акцент / hover / active:** `#0073CE`
- **Ссылки / кнопки:** `#000000`

При генерации UI применяй значения из этого файла как есть — они сняты с реального сайта.

---

> DESIGN.md для `b-line.it` сгенерирован на [vibe.flekk.ru](https://vibe.flekk.ru/?utm_source=designmd&utm_medium=referral&utm_campaign=export) — детектор дизайна по ссылке. Точные значения из кода сайта, без нейросетей.
