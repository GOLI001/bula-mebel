import React from 'react';

export default function Hero() {
  return (
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          <div>
            <span class="hero-badge">✨ Официальный Стиль Бренда Divan Bula</span>
            <h1 class="hero-title">Создаем Мебель <span>С Заботой О Каждом</span> Доме</h1>
            <p class="hero-desc">
              Собственное производство диванов, кроватей и столов в Астане. Премиальные материалы, немецкая фурнитура и честные оптовые цены.
            </p>

            <div class="hero-actions-group">
              <a href="#catalog" class="btn-bula-primary hero-btn">Смотреть каталог</a>
              <a
                href="https://wa.me/77475560315?text=Здравствуйте!%20Нужна%20консультация%20дизайнера."
                target="_blank"
                rel="noopener noreferrer"
                class="btn-bula-secondary hero-btn"
              >
                Консультация дизайнера
              </a>
            </div>
          </div>

          <div class="hero-visual">
            <img src="/images/hero_classic.png" alt="Divan Bula Premium Furniture" class="hero-visual-img" loading="eager" />
          </div>
        </div>
      </div>
    </section>
  );
}
