import React from 'react';

export default function Footer() {
  return (
    <footer class="site-footer" id="contacts">
      <div class="container">
        <div class="footer-grid">
          <div>
            <img src="/images/logo.svg" alt="Divan Bula Logo" style={{ height: '48px', marginBottom: '20px', filter: 'brightness(2) contrast(0.5)' }} />
            <p style={{ fontSize: '14px', color: '#AAA', lineHeight: 1.7 }}>
              Официальная мебельная фабрика Divan Bula. Качество, проверенное годами.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFF', marginBottom: '16px', fontSize: '15px' }}>Навигация</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#AAA' }}>
              <a href="#catalog">Каталог продукции</a>
              <a href="#about">О нашей фабрике</a>
              <a href="#dealer">Оптовым покупателям</a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', marginBottom: '16px', fontSize: '15px' }}>Контакты в Астане</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#AAA' }}>
              <div>📍 г. Астана, ул. Кабанбай Батыра 42</div>
              <div>📞 <a href="tel:+77475560315" style={{ color: 'var(--color-brand-gold)' }}>8 (747) 556-03-15</a></div>
              <div>💬 WhatsApp: <a href="https://wa.me/77475560315" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>8 (747) 556-03-15</a></div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2026 Divan Bula. Все права защищены.</div>
          <div style={{ color: 'var(--color-brand-gold)' }}>Официальная цветовая палитра логотипа бренда</div>
        </div>
      </div>
    </footer>
  );
}
