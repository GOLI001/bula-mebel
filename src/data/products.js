const imageUrl = (folder, index) => `/media/catalog/${folder}/${String(index).padStart(2, '0')}.webp`;
const makeImages = (folder, count) => Array.from({ length: count }, (_, index) => imageUrl(folder, index + 1));

const makeColorVariants = (folder, definitions) => definitions.map(([colorName, colorHex, indexes], variantIndex) => ({
  id: `${folder}-${variantIndex + 1}`,
  color_name: colorName,
  color_hex: colorHex,
  price_override: null,
  images: indexes.map((index) => ({
    id: `${folder}-${variantIndex + 1}-${index}`,
    url: imageUrl(folder, index),
    alt_text: `${colorName}, фото ${index}`,
  })),
}));

const withMedia = (folder, imageCount, colorDefinitions) => ({
  images: makeImages(folder, imageCount),
  variants: makeColorVariants(folder, colorDefinitions),
  colors: colorDefinitions.map(([name]) => name),
});

const commonSofa = {
  category: 'sofas', categoryLabel: 'Диван', sleepingArea: 'Уточните у менеджера', seats: 3,
  availability: 'Изготовление под заказ', oldPrice: null, video: null,
  materials: ['Мебельная ткань на выбор', 'Прочный мебельный каркас', 'Комфортный эластичный наполнитель'],
  features: ['Изготовление в Астане', 'Выбор ткани и цвета', 'Несколько вариантов размера'],
};

const sofa = ({ folder, imageCount, sizeVariants = [], colorVariants, description, ...product }) => ({
  ...commonSofa,
  ...product,
  ...withMedia(folder, imageCount, colorVariants),
  price: sizeVariants.length ? Math.min(...sizeVariants.map((variant) => variant.price)) : null,
  dimensions: sizeVariants.length ? sizeVariants.map((variant) => variant.size).join(' / ') : 'Уточняется',
  sizeVariants,
  description: description || `Модель ${product.name} из каталога Divan Bula. На фотографиях показаны реальные варианты исполнения, переданные производителем. Размер, цвет и ткань согласовываются при заказе.`,
});

export const PRODUCTS_DATA = [
  sofa({
    id: 'oscar', name: 'Oscar', folder: 'oscar', imageCount: 10, badge: '3 цвета на фото',
    sizeVariants: [{ size: '2,5 м', price: 280000 }, { size: '3 м', price: 330000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [1, 2, 3, 6, 7, 10]],
      ['Светло-серый', '#C6C5C0', [5, 9]],
      ['Синий', '#315A72', [4, 8]],
    ],
  }),
  sofa({
    id: 'terra', name: 'Terra', folder: 'terra', imageCount: 6, badge: '5 цветов на фото',
    sizeVariants: [{ size: '2,10 м', price: 240000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [1, 6]], ['Светло-серый', '#C6C5C0', [3]],
      ['Зелёный', '#5F785B', [4]], ['Оливковый / хаки', '#697257', [5]],
      ['Терракотовый', '#A9583E', [2]],
    ],
  }),
  sofa({
    id: 'orda', name: 'Orda', folder: 'orda', imageCount: 9, badge: '4 цвета на фото',
    sizeVariants: [{ size: '2,60 м', price: 280000 }, { size: '3 м', price: 330000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [2, 3, 4, 5, 7, 9]], ['Бежевый', '#C8B39B', [6]],
      ['Серый', '#7E8082', [8]], ['Светло-зелёный', '#AEBE98', [1]],
    ],
  }),
  sofa({
    id: 'loft', name: 'Loft', folder: 'loft', imageCount: 26, badge: '6 цветов на фото',
    sizeVariants: [{ size: '2 м', price: 220000 }, { size: '2,5 м', price: 260000 }, { size: '3 м', price: 330000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [1, 2, 6, 7, 8, 15, 21, 24, 25]],
      ['Бежевый', '#C8B39B', [3, 17, 18]], ['Светло-серый', '#C6C5C0', [4, 5, 13, 16, 20, 23, 26]],
      ['Серый', '#7E8082', [9, 10, 11, 12]], ['Терракотовый', '#A9583E', [14, 22]],
      ['Коричневый', '#8B6547', [19]],
    ],
  }),
  sofa({
    id: 'milan', name: 'Milan', folder: 'milan', imageCount: 21, badge: '7 цветов на фото',
    sizeVariants: [{ size: '2 м', price: 210000 }, { size: '2,5 м', price: 250000 }, { size: '3 м', price: 280000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [2, 3, 4, 18, 19, 20]], ['Бежевый', '#C8B39B', [8, 10, 12, 13, 16]],
      ['Светло-серый', '#C6C5C0', [1, 5, 6, 15, 17]], ['Тёмно-серый', '#44484B', [7, 9]],
      ['Серо-бежевый', '#A99C8B', [21]], ['Зелёный', '#5F785B', [11]], ['Тёмно-зелёный', '#22483B', [14]],
    ],
  }),
  sofa({
    id: 'ankara', name: 'Ankara', folder: 'ankara', imageCount: 17, badge: '3 цвета на фото',
    sizeVariants: [{ size: '2 м', price: 260000 }, { size: '2,5 м', price: 300000 }, { size: '3 м', price: 350000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [1, 2, 3, 4, 7, 9, 10, 11, 12, 13, 15]],
      ['Бежевый', '#C8B39B', [6, 8]], ['Светло-серый', '#C6C5C0', [5, 14, 16, 17]],
    ],
  }),
  sofa({
    id: 'istanbul', name: 'Istanbul', folder: 'istanbul', imageCount: 4, badge: '4 цвета на фото',
    sizeVariants: [{ size: '2,20 м', price: 260000 }, { size: '2,5 м', price: 300000 }, { size: '3 м', price: 350000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [1]], ['Бежевый', '#C8B39B', [3]],
      ['Серо-бежевый', '#A99C8B', [4]], ['Зелёный', '#5F785B', [2]],
    ],
  }),
  sofa({
    id: 'skandi', name: 'Skandi', folder: 'skandi', imageCount: 14, badge: '7 цветов на фото',
    sizeVariants: [{ size: '2 м', price: 200000 }, { size: '2,5 м', price: 240000 }, { size: '3 м', price: 280000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [6, 7, 8, 9, 11]], ['Бежевый', '#C8B39B', [1]],
      ['Светло-серый', '#C6C5C0', [5, 13]], ['Синий', '#315A72', [3]],
      ['Терракотовый', '#A9583E', [2]], ['Бордовый', '#7A3138', [4]],
      ['Горчичный', '#C49A3B', [10, 12, 14]],
    ],
  }),
  sofa({
    id: 'prestige', name: 'Prestige', folder: 'prestige', imageCount: 12, badge: '8 цветов на фото',
    sizeVariants: [{ size: '2 м', price: 220000 }, { size: '2,5 м', price: 250000 }, { size: '3 м', price: 280000 }],
    colorVariants: [
      ['Молочный / кремовый', '#EDE7DA', [10, 12]], ['Бежевый', '#C8B39B', [7]],
      ['Светло-серый', '#C6C5C0', [8]], ['Тёмно-серый', '#44484B', [2, 5, 6]],
      ['Тёмно-зелёный', '#22483B', [11]], ['Оливковый / хаки', '#697257', [3, 4]],
      ['Синий', '#315A72', [1]], ['Терракотовый', '#A9583E', [9]],
    ],
  }),
  {
    id: 'beds', name: 'Кровать с подъёмным механизмом', category: 'beds', categoryLabel: 'Кровать',
    price: 175000, oldPrice: null, dimensions: '90×200 — 200×200 см', sleepingArea: 'По выбранному размеру', seats: 0,
    availability: 'Изготовление под заказ', badge: '6 размеров', video: null,
    ...withMedia('beds', 19, [
      ['Молочный / кремовый', '#EDE7DA', [7, 9, 11, 12, 14, 15, 16, 19]], ['Бежевый', '#C8B39B', [10]],
      ['Светло-серый', '#C6C5C0', [2, 4, 5, 6]], ['Серый', '#7E8082', [13, 18]],
      ['Тёмно-серый', '#44484B', [1]], ['Синий', '#315A72', [3]], ['Терракотовый', '#A9583E', [17]],
    ]),
    sizeVariants: [
      { size: '90×200 см', price: 175000 }, { size: '120×200 см', price: 190000 },
      { size: '140×200 см', price: 210000 }, { size: '160×200 см', price: 230000 },
      { size: '180×200 см', price: 260000 }, { size: '200×200 см', price: 280000 },
    ],
    materials: ['Мебельная ткань на выбор', 'Прочное основание', 'Подъёмный механизм'],
    features: ['Вместительный короб для хранения', 'Шесть размеров спального места', 'Выбор цвета и ткани'],
    description: 'Мягкая кровать с подъёмным механизмом и коробом для хранения. В каталоге представлены реальные фотографии изготовленных кроватей.',
  },
  {
    id: 'mattresses', name: 'Матрас', category: 'mattresses', categoryLabel: 'Матрас',
    price: 55000, oldPrice: null, dimensions: '90×200 — 200×200 см', sleepingArea: 'По выбранному размеру', seats: 0,
    availability: 'Размер уточняется при заказе', badge: '6 размеров', video: null,
    ...withMedia('mattresses', 1, [['Стандартное исполнение', '#D9D9D9', [1]]]),
    sizeVariants: [
      { size: '90×200 см', price: 55000 }, { size: '120×200 см', price: 75000 },
      { size: '140×200 см', price: 85000 }, { size: '160×200 см', price: 90000 },
      { size: '180×200 см', price: 110000 }, { size: '200×200 см', price: 125000 },
    ],
    materials: ['Независимый пружинный блок', 'Комфортные настилочные слои', 'Износостойкий чехол'],
    features: ['Шесть стандартных размеров', 'Подходит к кроватям каталога', 'Состав показан на схеме'],
    description: 'Матрас в стандартных размерах. На схеме показано внутреннее наполнение; точную жёсткость и наличие уточнит менеджер.',
  },
  sofa({
    id: 'voice-model', name: 'Название уточняется', folder: 'voice-model', imageCount: 4, badge: '4 реальных фото',
    colorVariants: [['Молочный / кремовый', '#EDE7DA', [1, 2, 3, 4]]], seats: 0,
    description: 'Название и стоимость этой модели были переданы голосовым сообщением и не отображаются на скриншотах. Фотографии сохранены без вымышленного названия.',
  }),
];

export const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'Все товары' }, { id: 'sofas', label: 'Диваны' },
  { id: 'beds', label: 'Кровати' }, { id: 'mattresses', label: 'Матрасы' },
];

export const FABRIC_COLLECTIONS = [
  { id: 'like', name: 'Like', type: 'Букле', image: '/media/textiles/like.webp' },
  { id: 'soft-chenille', name: 'Soft Chenille', type: 'Шенилл', image: '/media/textiles/soft-chenille.webp' },
  { id: 'preston', name: 'Preston', type: 'Рогожка', image: '/media/textiles/preston.webp' },
  { id: 'california', name: 'California', type: 'Велюр', image: '/media/textiles/california.webp' },
];

export const formatMoney = (value) => new Intl.NumberFormat('ru-RU').format(Number(value) || 0);
export const getProduct = (productId) => PRODUCTS_DATA.find((product) => product.id === productId);
