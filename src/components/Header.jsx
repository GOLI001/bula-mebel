import React from 'react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems, setIsCartOpen, isMobileMenuOpen, setIsMobileMenuOpen, cartBounce } = useCart();

  return (
    <header class="site-header">
      <div class="container">
        <div class="header-inner">
          <a href="#" class="logo-link">
            <img src="/images/logo.svg" alt="Divan Bula Logo" class="logo-img" />
          </a>

          {/* Desktop Navigation */}
          <nav class="main-nav">
            <a href="#catalog" class="nav-link">Каталог</a>
            <a href="#about" class="nav-link">О фабрике</a>
            <a href="#dealer" class="nav-link">Дилерам B2B</a>
            <a href="#contacts" class="nav-link">Контакты</a>
          </nav>

          <div class="header-actions">
            <button
              class="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              title="Открыть корзину"
              aria-label="Корзина"
              type="button"
            >
              🛒
              <span class={`cart-count-badge ${cartBounce ? 'bounce' : ''}`}>
                {totalItems}
              </span>
            </button>

            <a
              href="https://wa.me/77475560315?text=Здравствуйте!%20Хочу%20получить%20расчет%20мебели."
              target="_blank"
              rel="noopener noreferrer"
              class="btn-bula-primary header-calc-btn"
            >
              <span>Получить расчет</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              class={`mobile-hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Открыть навигацию"
              type="button"
            >
              <span class="hamburger-bar"></span>
              <span class="hamburger-bar"></span>
              <span class="hamburger-bar"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
