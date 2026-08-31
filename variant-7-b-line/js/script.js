/* ==========================================================================
   VARIANT 07: B-LINE ITALIAN DESIGN - STANDALONE JS ENGINE
   ========================================================================== */

const PRODUCTS_DATA = [
  {
    id: 'bline-boby-trolley',
    name: 'Boby Storage Trolley (Joe Colombo)',
    category: 'storage',
    categoryLabel: 'Iconic Italian Design',
    price: 195000,
    margin: 55000,
    dimensions: '43 × 42 × 74 см',
    stockStatus: 'in_stock',
    stockCount: 18,
    image: '../images/hero_dark.png',
    materials: ['ABS пластик', 'Сталь', 'Колеса 360°'],
    description: 'Легендарный контейнер-тележка Джо Коломбо 1970 года. Икона мирового итальянского дизайна.'
  },
  {
    id: 'bline-multichair',
    name: 'Multichair Transforming Lounge',
    category: 'sofas',
    categoryLabel: 'Трансформируемая мебель',
    price: 380000,
    margin: 95000,
    dimensions: '110 × 58 × 64 см',
    stockStatus: 'in_stock',
    stockCount: 6,
    image: '../images/hero_classic.png',
    materials: ['Вспененный полиуретан', 'Шерстяная обивка', 'Кожаные ремни'],
    description: 'Композиционная система из двух подушек, трансформируемая в кресло, шезлонг или диван.'
  },
  {
    id: 'bline-bula-sofa',
    name: 'Диван Divan Bula Milano 4',
    category: 'sofas',
    categoryLabel: 'Модульные диваны',
    price: 450000,
    margin: 120000,
    dimensions: '310 × 170 × 82 см',
    stockStatus: 'in_stock',
    stockCount: 8,
    image: '../images/hero_dark.png',
    materials: ['Итальянский велюр', 'Массив', 'Memory Foam'],
    description: 'Премиальный 4-местный модульный диван в архитектурном стиле B-Line Italia.'
  },
  {
    id: 'bline-bula-table',
    name: 'Стол B-Line Fin Table',
    category: 'tables',
    categoryLabel: 'Дизайнерские столы',
    price: 260000,
    margin: 70000,
    dimensions: '200 × 100 × 75 см',
    stockStatus: 'in_stock',
    stockCount: 10,
    image: '../images/hero_scandi.png',
    materials: ['Окрашенный алюминий', 'Закаленное стекло'],
    description: 'Минималистичный обеденный стол с плавными аэродинамическими ножнами.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const state = {
    currentCategory: 'all',
    cart: []
  };

  const catalogGrid = document.getElementById('catalog-grid');
  const catTabBtns = document.querySelectorAll('.cat-tab-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  function renderCatalog() {
    if (!catalogGrid) return;
    let filtered = PRODUCTS_DATA.filter(p => state.currentCategory === 'all' || p.category === state.currentCategory);

    catalogGrid.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="card-img-wrap">
          <img src="${p.image}" class="card-img" alt="${p.name}">
          <span class="card-tag-badge">B-LINE DESIGN</span>
        </div>
        <div class="card-body">
          <div class="card-category">${p.categoryLabel}</div>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-specs">${p.dimensions} • ${p.materials[0]}</div>
          <div class="card-price-row">
            <div>
              <div class="price-main">${p.price.toLocaleString('ru-RU')} ₸</div>
              <div class="dealer-margin-tag">B2B Маржа: +${p.margin.toLocaleString('ru-RU')} ₸</div>
            </div>
            <a href="https://wa.me/77475560315?text=Здравствуйте!%20Хочу%20заказать%20${encodeURIComponent(p.name)}" target="_blank" class="btn-bline-primary" style="padding: 10px 18px; font-size: 13px;">Заказать 💬</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  catTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.getAttribute('data-cat') || 'all';
      renderCatalog();
    });
  });

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => cartDrawer.classList.add('active'));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));

  renderCatalog();
});
