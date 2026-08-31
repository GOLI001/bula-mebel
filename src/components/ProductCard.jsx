import React from 'react';
import { formatMoney } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div class="product-card">
      <div class="card-img-wrap">
        <img src={product.image} class="card-img" alt={product.name} loading="lazy" />
        <span class="card-badge">Divan Bula</span>
      </div>
      <div class="card-body">
        <div class="card-category">{product.categoryLabel}</div>
        <h3 class="card-title">{product.name}</h3>
        <div class="card-specs">{product.dimensions} • {product.materials[0]}</div>
        <div class="card-price-row">
          <div>
            <div class="price-main">{formatMoney(product.price)} ₸</div>
            <div class="dealer-margin-tag">Маржа дилера: +{formatMoney(product.margin)} ₸</div>
          </div>
          <button
            class="btn-add-cart"
            onClick={() => addToCart(product.id)}
            type="button"
          >
            + В корзину 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
