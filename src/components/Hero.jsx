import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Мебельная фабрика в Астане</div>
          <h1>Диваны, в которые хочется возвращаться</h1>
          <p>Создаём мягкую мебель под ваш интерьер: выбирайте модель, размер, конфигурацию и ткань. Производим сами и отвечаем за результат.</p>
          <div className="hero-actions">
            <a href="#catalog" className="button button-primary">Выбрать диван <ArrowRight size={18} /></a>
            <a href="https://wa.me/77475560315?text=Здравствуйте!%20Помогите%20подобрать%20диван." target="_blank" rel="noreferrer" className="button button-secondary"><MessageCircle size={18} /> Помочь с выбором</a>
          </div>
          <div className="hero-benefits" aria-label="Преимущества"><span><ShieldCheck size={18} /> Гарантия 18 месяцев</span><span><Truck size={18} /> Доставка по Казахстану</span></div>
        </div>
        <div className="hero-media">
          <img src="/media/hero.webp" alt="Диван Divan Bula в современном интерьере" fetchpriority="high" />
          <div className="hero-floating-card"><strong>Собственное производство</strong><span>Контролируем качество от каркаса до обивки</span></div>
        </div>
      </div>
    </section>
  );
}
