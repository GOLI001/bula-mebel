const FEATURED_PRODUCTS = [
  {
    id: 'orda-260', name: 'Orda', category: 'corner', categoryLabel: 'Угловой диван',
    price: 310000, oldPrice: 345000, dimensions: '260 × 165 × 82 см', sleepingArea: '200 × 145 см', seats: 4,
    availability: 'Под заказ · от 14 дней', badge: 'Хит продаж', rating: 4.9, reviewCount: 18,
    images: ['/media/products/orda-1.webp', '/media/products/orda-2.webp', '/media/products/orda-3.webp'],
    video: '/media/video/orda.mp4', colors: ['Молочный', 'Светло-серый', 'Графит'],
    materials: ['Износостойкий велюр', 'Каркас из бруса и фанеры', 'Высокоэластичный ППУ'],
    features: ['Глубокая комфортная посадка', 'Практичные съёмные подушки', 'Возможность выбора ткани и угла'],
    description: 'Просторная модель для семейной гостиной. Лаконичный силуэт, мягкая посадка и удобная угловая секция делают Orda центром зоны отдыха.'
  },
  {
    id: 'terra-210', name: 'Terra', category: 'straight', categoryLabel: 'Прямой диван',
    price: 245000, oldPrice: 275000, dimensions: '210 × 95 × 84 см', sleepingArea: 'Не предусмотрено', seats: 3,
    availability: 'Под заказ · от 12 дней', badge: 'Компактный', rating: 4.8, reviewCount: 12,
    images: ['/media/products/terra-1.webp', '/media/products/terra-2.webp', '/media/products/terra-3.webp'],
    video: '/media/video/terra.mp4', colors: ['Молочный', 'Бежевый', 'Серый'],
    materials: ['Мебельная рогожка', 'Берёзовая фанера', 'ППУ повышенной плотности'],
    features: ['Подходит для небольшой гостиной', 'Высокие опоры облегчают уборку', 'Более 50 вариантов обивки'],
    description: 'Лёгкий и аккуратный диван для современного интерьера. Terra сохраняет полноценную трёхместную посадку при компактной ширине 210 см.'
  },
  {
    id: 'loft-300', name: 'Loft', category: 'modular', categoryLabel: 'Модульный диван',
    price: 420000, oldPrice: 468000, dimensions: '300 × 175 × 80 см', sleepingArea: '240 × 150 см', seats: 5,
    availability: 'Под заказ · от 18 дней', badge: 'Выбор дизайнеров', rating: 5, reviewCount: 9,
    images: ['/media/products/loft-1.webp', '/media/products/loft-2.webp', '/media/products/loft-3.webp'],
    video: '/media/video/loft.mp4', colors: ['Светло-серый', 'Кремовый', 'Тёмно-серый'],
    materials: ['Плотная мебельная ткань', 'Усиленный деревянный каркас', 'Комбинированный настил'],
    features: ['Модульная конфигурация', 'Широкие подлокотники', 'Большое спальное место'],
    description: 'Масштабная модульная модель с расслабленной посадкой. Конфигурацию Loft можно адаптировать под планировку вашей комнаты.'
  },
  {
    id: 'oscar-300', name: 'Oscar', category: 'designer', categoryLabel: 'Дизайнерский диван',
    price: 465000, oldPrice: 510000, dimensions: '300 × 120 × 76 см', sleepingArea: 'Не предусмотрено', seats: 5,
    availability: 'Под заказ · от 20 дней', badge: 'Новинка', rating: 4.9, reviewCount: 7,
    images: ['/media/products/oscar-1.webp', '/media/products/oscar-2.webp', '/media/products/oscar-3.webp'],
    video: '/media/video/oscar.mp4', colors: ['Молочный букле', 'Карамельный', 'Песочный'],
    materials: ['Мягкий велюр или букле', 'Фанера и хвойный брус', 'Эластичный формованный ППУ'],
    features: ['Выразительная округлая форма', 'Панорамная посадка', 'Декоративные подушки в комплекте'],
    description: 'Акцентная модель с плавной архитектурной формой. Oscar одинаково эффектно смотрится у стены и в центре просторной гостиной.'
  }
];

const PHOTO_PRODUCTS = [
  ['aru', 'Ару', 'corner', 'Угловой диван', 'aru.webp', 'Для небольшой гостиной', 4],
  ['monaco', 'Монако', 'corner', 'Угловой диван', 'monaco.webp', 'Глубокая посадка', 4],
  ['palma', 'Пальма', 'corner', 'Угловой диван', 'palma.webp', 'Плавные формы', 4],
  ['milan', 'Милан', 'straight', 'Прямой диван', 'milan.webp', 'Лаконичный дизайн', 3],
  ['duo', 'Дуо', 'straight', 'Компактный диван', 'duo.webp', 'Для двоих', 2],
  ['luna', 'Луна', 'straight', 'Прямой диван', 'luna.webp', 'Мягкая посадка', 3],
  ['retro', 'Ретро', 'straight', 'Прямой диван', 'retro.webp', 'Яркий акцент', 3],
  ['grand', 'Гранд', 'corner', 'Угловой диван', 'grand.webp', 'Просторная модель', 5],
  ['line', 'Лайн', 'straight', 'Прямой диван', 'line.webp', 'Современная классика', 3],
  ['comfort', 'Комфорт', 'straight', 'Диван-кровать', 'comfort.webp', 'Практичный выбор', 3],
  ['miami', 'Майами', 'modular', 'Модульный диван', 'miami.webp', 'Выразительный цвет', 5],
  ['nordic', 'Нордик', 'corner', 'Угловой диван', 'nordic.webp', 'Минимализм', 4],
  ['sunny', 'Санни', 'straight', 'Прямой диван', 'sunny.webp', 'Новая модель', 3],
  ['urban', 'Урбан', 'corner', 'Угловой диван', 'urban.webp', 'Для всей семьи', 4],
  ['blue', 'Блю', 'corner', 'Угловой диван', 'blue.webp', 'Глубокий цвет', 4],
  ['cloud', 'Клауд', 'designer', 'Дизайнерский диван', 'cloud.webp', 'Воздушная форма', 4],
  ['family', 'Фэмили', 'corner', 'Угловой диван', 'family.webp', 'С пуфом', 5],
  ['vision', 'Вижн', 'corner', 'Угловой диван', 'vision.webp', 'Много места', 5],
  ['air', 'Эйр', 'corner', 'Угловой диван', 'air.webp', 'Светлый интерьер', 4],
  ['studio', 'Студио', 'straight', 'Комплект мягкой мебели', 'studio.webp', 'Диван и кресло', 5]
].map(([id, name, category, categoryLabel, image, badge, seats]) => ({
  id, name, category, categoryLabel, badge, seats,
  price: null, oldPrice: null,
  dimensions: 'Изготавливается под ваш размер',
  sleepingArea: 'Уточните у менеджера',
  availability: 'Под заказ · срок уточняется',
  images: [`/media/products/collection/${image}`],
  video: null,
  colors: ['Молочный', 'Бежевый', 'Серый'],
  materials: ['Ткань на выбор из каталога', 'Деревянный мебельный каркас', 'Комфортный эластичный наполнитель'],
  features: ['Изготовление в Астане', 'Выбор ткани и цвета', 'Адаптация размера под интерьер'],
  description: `${categoryLabel} ${name} из реализованной коллекции Divan Bula. Точную конфигурацию, размер, ткань и стоимость согласуем индивидуально.`
}));

export const PRODUCTS_DATA = [...FEATURED_PRODUCTS, ...PHOTO_PRODUCTS];

export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'Все модели' }, { id: 'straight', label: 'Прямые' },
  { id: 'corner', label: 'Угловые' }, { id: 'modular', label: 'Модульные' },
  { id: 'designer', label: 'Дизайнерские' }
];

export const FABRIC_COLLECTIONS = [
  { id: 'like', name: 'Like', type: 'Букле', image: '/media/textiles/like.webp' },
  { id: 'soft-chenille', name: 'Soft Chenille', type: 'Шенилл', image: '/media/textiles/soft-chenille.webp' },
  { id: 'preston', name: 'Preston', type: 'Рогожка', image: '/media/textiles/preston.webp' },
  { id: 'california', name: 'California', type: 'Велюр', image: '/media/textiles/california.webp' }
];

export const formatMoney = (value) => new Intl.NumberFormat('ru-RU').format(Number(value) || 0);
export const getProduct = (productId) => PRODUCTS_DATA.find((product) => product.id === productId);
