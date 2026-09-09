import { Armchair, BadgeCheck, Factory, Ruler } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="section production-section" id="production">
      <div className="container">
        <div className="section-heading centered"><span className="eyebrow">Как мы работаем</span><h2>От идеи до дивана в вашем доме</h2><p>Один производитель отвечает за замер, конструкцию, пошив, сборку и доставку.</p></div>
        <div className="process-grid">
          <article><span>01</span><Ruler /><h3>Подбираем размер</h3><p>Учитываем планировку, проходы и сценарии использования.</p></article>
          <article><span>02</span><Armchair /><h3>Выбираем ткань</h3><p>Покажем образцы и подберём материал под детей, питомцев и бюджет.</p></article>
          <article><span>03</span><Factory /><h3>Производим</h3><p>Собираем мебель на собственной фабрике в Астане.</p></article>
          <article><span>04</span><BadgeCheck /><h3>Доставляем</h3><p>Привозим, собираем и передаём гарантию на 18 месяцев.</p></article>
        </div>
        <div className="production-banner"><div><span>С 2018 года</span><h3>Мебель, сделанная людьми, которым не всё равно</h3><p>Более 5 000 заказов для квартир, домов, офисов и коммерческих пространств по Казахстану.</p></div><div className="stats"><div><strong>8+</strong><span>лет опыта</span></div><div><strong>50+</strong><span>вариантов ткани</span></div><div><strong>18</strong><span>месяцев гарантии</span></div></div></div>
      </div>
    </section>
  );
}
