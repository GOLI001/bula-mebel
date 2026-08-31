/* ==========================================================================
   DIVAN BULA — CROSS-BROWSER COMPATIBLE JS ENGINE (CHROME, SAFARI, FIREFOX, EDGE)
   ========================================================================== */

const PRODUCTS_DATA = [
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
    image: 'images/hero_classic.png',
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
    image: 'images/hero_dark.png',
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
    image: 'images/hero_scandi.png',
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
    image: 'images/hero_classic.png',
    materials: ['Букле', 'Металлический каркас'],
    description: 'Уютный стул с обивкой из мягкого букле.'
  }
];

// Safari & Firefox Safe LocalStorage Helpers
function safeGetStorage(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Graceful fallback if cookies/storage blocked by Safari Private mode
  }
}

// Cross-browser Currency Formatter
function formatMoney(num) {
  if (typeof num !== 'number') return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function initApp() {
  const state = {
    currentCategory: 'all',
    cart: safeGetStorage('divan_bula_cart') || []
  };

  const catalogGrid = document.getElementById('catalog-grid');
  const catTabBtns = document.querySelectorAll('.cat-tab-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartCountElem = document.getElementById('cart-count');
  const cartHeaderCountElem = document.getElementById('cart-header-count');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartFooterContainer = document.getElementById('cart-footer');
  const toastContainer = document.getElementById('toast-container');

  // Mobile Menu Elements
  const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

  // Mobile Menu Functions
  function openMobileMenu() {
    if (mobileMenuDrawer && mobileMenuOverlay && hamburgerBtn) {
      mobileMenuDrawer.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      hamburgerBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  }

  function closeMobileMenu() {
    if (mobileMenuDrawer && mobileMenuOverlay && hamburgerBtn) {
      mobileMenuDrawer.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }
  
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Toast notification
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<span>🛒</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.webkitTransform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      toast.style.webkitTransition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2800);
  }

  // Add item to cart
  function addToCart(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      state.cart.push({ ...product, qty: 1 });
    }

    safeSetStorage('divan_bula_cart', state.cart);
    renderCart();

    if (cartCountElem) {
      cartCountElem.classList.add('bounce');
      setTimeout(() => cartCountElem.classList.remove('bounce'), 300);
    }

    showToast(`Товар "${product.name}" добавлен в корзину!`);
  }

  // Update item quantity in cart
  function updateQty(productId, change) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }

    safeSetStorage('divan_bula_cart', state.cart);
    renderCart();
  }

  // Remove item from cart
  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    safeSetStorage('divan_bula_cart', state.cart);
    renderCart();
  }

  // Clear all items
  function clearCart() {
    state.cart = [];
    safeSetStorage('divan_bula_cart', state.cart);
    renderCart();
  }

  // Open / Close Cart Drawer
  function openCart() {
    closeMobileMenu();
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }

  // Render Catalog Grid
  function renderCatalog() {
    if (!catalogGrid) return;
    let filtered = PRODUCTS_DATA.filter(p => state.currentCategory === 'all' || p.category === state.currentCategory);

    catalogGrid.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="card-img-wrap">
          <img src="${p.image}" class="card-img" alt="${p.name}" loading="lazy">
          <span class="card-badge">Divan Bula</span>
        </div>
        <div class="card-body">
          <div class="card-category">${p.categoryLabel}</div>
          <h3 class="card-title">${p.name}</h3>
          <div class="card-specs">${p.dimensions} • ${p.materials[0]}</div>
          <div class="card-price-row">
            <div>
              <div class="price-main">${formatMoney(p.price)} ₸</div>
              <div class="dealer-margin-tag">Маржа дилера: +${formatMoney(p.margin)} ₸</div>
            </div>
            <button class="btn-add-cart" data-add-id="${p.id}" type="button">
              + В корзину 🛒
            </button>
          </div>
        </div>
      </div>
    `).join('');

    catalogGrid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-add-id');
        if (id) addToCart(id);
      });
    });
  }

  // Render Cart Drawer Content
  function renderCart() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartCountElem) cartCountElem.textContent = totalItems;
    if (cartHeaderCountElem) cartHeaderCountElem.textContent = `(${totalItems} ${totalItems === 1 ? 'товар' : 'товаров'})`;

    if (state.cart.length === 0) {
      if (cartItemsContainer) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty-box">
            <div class="cart-empty-icon">🛋️</div>
            <div class="cart-empty-text">Ваша корзина пока пуста.<br>Выберите понравившуюся мебель в каталоге!</div>
            <button class="btn-bula-primary" id="go-to-catalog-btn" type="button" style="font-size: 13px; padding: 12px 24px;">
              Перейти к каталогу
            </button>
          </div>
        `;
        const goBtn = document.getElementById('go-to-catalog-btn');
        if (goBtn) {
          goBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeCart();
            const catalogSec = document.getElementById('catalog');
            if (catalogSec) {
              try {
                catalogSec.scrollIntoView({ behavior: 'smooth' });
              } catch (e) {
                window.location.hash = '#catalog';
              }
            }
          });
        }
      }
      if (cartFooterContainer) cartFooterContainer.innerHTML = '';
      return;
    }

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${formatMoney(item.price * item.qty)} ₸</div>
            <div class="cart-qty-row">
              <button class="qty-btn" data-minus-id="${item.id}" type="button">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" data-plus-id="${item.id}" type="button">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-remove-id="${item.id}" type="button" title="Удалить товар">✕</button>
        </div>
      `).join('');

      cartItemsContainer.querySelectorAll('[data-minus-id]').forEach(b => {
        b.addEventListener('click', (e) => {
          e.preventDefault();
          updateQty(b.getAttribute('data-minus-id'), -1);
        });
      });
      cartItemsContainer.querySelectorAll('[data-plus-id]').forEach(b => {
        b.addEventListener('click', (e) => {
          e.preventDefault();
          updateQty(b.getAttribute('data-plus-id'), 1);
        });
      });
      cartItemsContainer.querySelectorAll('[data-remove-id]').forEach(b => {
        b.addEventListener('click', (e) => {
          e.preventDefault();
          removeFromCart(b.getAttribute('data-remove-id'));
        });
      });
    }

    const orderLines = state.cart.map(i => `• ${i.name} (x${i.qty}) — ${formatMoney(i.price * i.qty)} ₸`);
    const waText = encodeURIComponent(
      `Здравствуйте! Хочу оформить заказ из корзины Divan Bula:\n\n${orderLines.join('\n')}\n\nИтоговая сумма: ${formatMoney(totalPrice)} ₸\n\nПросьба уточнить наличие и сроки доставки!`
    );
    const waLink = `https://wa.me/77475560315?text=${waText}`;

    if (cartFooterContainer) {
      cartFooterContainer.innerHTML = `
        <div class="cart-subtotal-row">
          <span>Итого:</span>
          <span class="cart-total-price">${formatMoney(totalPrice)} ₸</span>
        </div>
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-checkout">
          <span>💬 Оформить заказ в WhatsApp</span>
        </a>
        <button class="btn-clear-cart" id="clear-cart-btn" type="button">Очистить корзину</button>
      `;

      const clearBtn = document.getElementById('clear-cart-btn');
      if (clearBtn) clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearCart();
      });
    }
  }

  catTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      catTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.getAttribute('data-cat') || 'all';
      renderCatalog();
    });
  });

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeCart();
  });
  if (cartOverlay) cartOverlay.addEventListener('click', (e) => {
    e.preventDefault();
    closeCart();
  });

  renderCatalog();
  renderCart();
}

// Cross-browser safe DOMReady launcher
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
