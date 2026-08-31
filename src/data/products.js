export const PRODUCTS_DATA = [
  {
    id: 'bula-classic-gold',
    name: 'Диван Bula Premium Classic',
    category: 'sofas',
    categoryLabel: 'Прямые диваны',
    price: 310000,
    margin: 78000,
    dimensions: '230 × 95 × 88 см',
    stockStatus: 'in_stock',
    stockCount: 7,
    image: '/images/hero_classic.png',
    materials: ['Ткань премиум', 'Массив сосны', 'Pocket Spring'],
    description: 'Флагманский 3-местный диван с элегантной стежкой в фирменном стиле Divan Bula.'
  },
  {
    id: 'bula-dark-onyx',
    name: 'Диван Bula Onyx Reserve',
    category: 'sofas',
    categoryLabel: 'Угловые диваны',
    price: 420000,
    margin: 110000,
    dimensions: '300 × 180 × 85 см',
    stockStatus: 'in_stock',
    stockCount: 5,
    image: '/images/hero_dark.png',
    materials: ['Шелковый велюр', 'Графитовый каркас'],
    description: 'Роскошный угловой диван с глубокой посадкой.'
  },
  {
    id: 'bula-table-oak',
    name: 'Стол Bula Natural Oak',
    category: 'tables',
    categoryLabel: 'Обеденные столы',
    price: 185000,
    margin: 50000,
    dimensions: '180 × 90 × 76 см',
    stockStatus: 'in_stock',
    stockCount: 12,
    image: '/images/hero_scandi.png',
    materials: ['Массив дуба', 'Масляное покрытие'],
    description: 'Обеденный стол из натурального дуба.'
  },
  {
    id: 'bula-chair-boucle',
    name: 'Стул Bula Soft Warm',
    category: 'chairs',
    categoryLabel: 'Дизайнерские стулья',
    price: 38000,
    margin: 10000,
    dimensions: '52 × 54 × 82 см',
    stockStatus: 'in_stock',
    stockCount: 24,
    image: '/images/hero_classic.png',
    materials: ['Букле', 'Металлический каркас'],
    description: 'Уютный стул с обивкой из мягкого букле.'
  }
];

export function formatMoney(num) {
  if (typeof num !== 'number') return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
