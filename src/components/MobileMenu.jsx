import React from 'react';
import { useCart } from '../context/CartContext';

export default function MobileMenu() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useCart();

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div
        class={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div class={`mobile-menu-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
        <div class="mobile-menu-header">
          <img src="/images/logo.svg" alt="Divan Bula Logo" style={{ height: '36px' }} />
          <button
            class="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Закрыть меню"
            type="button"
          >
            ✕
          </button>
        </div>

        <nav class="mobile-nav-links">
          <a href="#catalog" class="mobile-nav-item" onClick={handleLinkClick}>🛋️ Каталог мебели</a>
          <a href="#about" class="mobile-nav-item" onClick={handleLinkClick}>🏭 О нашей фабрике</a>
          <a href="#dealer" class="mobile-nav-item" onClick={handleLinkClick}>🤝 Дилерам & B2B</a>
          <a href="#contacts" class="mobile-nav-item" onClick={handleLinkClick}>📍 Контакты в Астане</a>
        </nav>

        <div class="mobile-menu-footer">
          <a
            href="https://wa.me/77475560315?text=Здравствуйте!%20Хочу%20получить%20расчет%20мебели."
            target="_blank"
            rel="noopener noreferrer"
            class="btn-bula-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '20px' }}
          >
            💬 Рассчитать мебель в WhatsApp
          </a>

          <div class="mobile-contact-info">
            <div>📍 г. Астана, ул. Кабанбай Батыра 42</div>
            <div>
              📞 <a href="tel:+77475560315" style={{ color: 'var(--color-brand-gold-dark)', fontWeight: 800 }}>8 (747) 556-03-15</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
