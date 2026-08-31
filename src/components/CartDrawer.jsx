import React from 'react';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../data/products';

export default function CartDrawer() {
  const {
    cart,
    updateQty,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const orderLines = cart.map(i => `• ${i.name} (x${i.qty}) — ${formatMoney(i.price * i.qty)} ₸`);
  const waText = encodeURIComponent(
    `Здравствуйте! Хочу оформить заказ из корзины Divan Bula:\n\n${orderLines.join('\n')}\n\nИтоговая сумма: ${formatMoney(totalPrice)} ₸\n\nПросьба уточнить наличие и сроки доставки!`
  );
  const waLink = `https://wa.me/77475560315?text=${waText}`;

  return (
    <>
      <div
        class={`cart-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={handleClose}
      ></div>

      <div class={`cart-drawer ${isCartOpen ? 'active' : ''}`}>
        <div class="cart-header">
          <div class="cart-header-title">
            <span>🛒 Корзина</span>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              ({totalItems} {totalItems === 1 ? 'товар' : 'товаров'})
            </span>
          </div>
          <button class="cart-close-btn" onClick={handleClose} title="Закрыть" type="button">
            ✕
          </button>
        </div>

        <div class="cart-body">
          {cart.length === 0 ? (
            <div class="cart-empty-box">
              <div class="cart-empty-icon">🛋️</div>
              <div class="cart-empty-text">
                Ваша корзина пока пуста.<br />Выберите понравившуюся мебель в каталоге!
              </div>
              <button
                class="btn-bula-primary"
                onClick={handleClose}
                type="button"
                style={{ fontSize: '13px', padding: '12px 24px' }}
              >
                Перейти к каталогу
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div class="cart-item-card" key={item.id}>
                <img src={item.image} alt={item.name} class="cart-item-img" />
                <div class="cart-item-info">
                  <div class="cart-item-title">{item.name}</div>
                  <div class="cart-item-price">{formatMoney(item.price * item.qty)} ₸</div>
                  <div class="cart-qty-row">
                    <button class="qty-btn" onClick={() => updateQty(item.id, -1)} type="button">-</button>
                    <span class="qty-val">{item.qty}</span>
                    <button class="qty-btn" onClick={() => updateQty(item.id, 1)} type="button">+</button>
                  </div>
                </div>
                <button
                  class="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  type="button"
                  title="Удалить товар"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div class="cart-footer">
            <div class="cart-subtotal-row">
              <span>Итого:</span>
              <span class="cart-total-price">{formatMoney(totalPrice)} ₸</span>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-whatsapp-checkout"
            >
              <span>💬 Оформить заказ в WhatsApp</span>
            </a>
            <button class="btn-clear-cart" onClick={clearCart} type="button">
              Очистить корзину
            </button>
          </div>
        )}
      </div>
    </>
  );
}
