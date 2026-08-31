import React, { useState } from 'react';
import { PRODUCTS_DATA } from '../data/products';
import ProductCard from './ProductCard';

export default function Catalog() {
  const [currentCategory, setCurrentCategory] = useState('all');

  const filteredProducts = PRODUCTS_DATA.filter(
    p => currentCategory === 'all' || p.category === currentCategory
  );

  return (
    <section class="section" id="catalog">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">Официальный каталог</span>
          <h2 class="section-title">Коллекция Мебели Divan Bula</h2>
          <p class="section-desc">Выберите подходящий предмет или добавьте в корзину для мгновенного расчета.</p>
        </div>

        {/* Categories Filter Tabs (Touch scroll on Mobile) */}
        <div class="categories-tabs-wrapper">
          <div class="categories-tabs">
            <button
              class={`cat-tab-btn ${currentCategory === 'all' ? 'active' : ''}`}
              onClick={() => setCurrentCategory('all')}
              type="button"
            >
              Все товары
            </button>
            <button
              class={`cat-tab-btn ${currentCategory === 'sofas' ? 'active' : ''}`}
              onClick={() => setCurrentCategory('sofas')}
              type="button"
            >
              Диваны
            </button>
            <button
              class={`cat-tab-btn ${currentCategory === 'tables' ? 'active' : ''}`}
              onClick={() => setCurrentCategory('tables')}
              type="button"
            >
              Столы
            </button>
            <button
              class={`cat-tab-btn ${currentCategory === 'chairs' ? 'active' : ''}`}
              onClick={() => setCurrentCategory('chairs')}
              type="button"
            >
              Стулья
            </button>
          </div>
        </div>

        <div class="product-grid" id="catalog-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
