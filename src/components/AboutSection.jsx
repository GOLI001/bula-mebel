import React from 'react';

export default function AboutSection() {
  return (
    <section class="section" id="about" style={{ background: 'var(--color-bg-alt)' }}>
      <div class="container">
        <div class="hero-grid" style={{ alignItems: 'center' }}>
          <div class="hero-visual" style={{ aspectRatio: '4/3' }}>
            <img src="/images/hero_dark.png" alt="Фабрика Divan Bula" class="hero-visual-img" loading="lazy" />
          </div>
          <div>
            <span class="section-subtitle">Собственное Производство</span>
            <h2 class="section-title">Фабрика Качественной Мебели в Астане</h2>
            <p class="hero-desc" style={{ marginBottom: '24px' }}>
              Мы производим надежные диваны, столы и элементы интерьера с 2018 года. Работаем с индивидуальными чертежами, дизайнерами и оптовыми дилерами по всему Казахстану.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-brand-gold-dark)' }}>8+</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Лет на рынке</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-brand-gold-dark)' }}>5000+</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Довольных клиентов</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-brand-gold-dark)' }}>100%</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Гарантия качества</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
