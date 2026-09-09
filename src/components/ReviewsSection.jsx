import { FileCheck2, Images, MessageSquareText } from 'lucide-react';

const buyerSteps = [
  { icon: FileCheck2, title: 'Фиксируем заказ', text: 'До запуска согласуем модель, размеры, ткань, комплектацию, стоимость и срок изготовления.' },
  { icon: Images, title: 'Показываем результат', text: 'Перед доставкой отправляем фото готового изделия и подтверждаем удобное время.' },
  { icon: MessageSquareText, title: 'Остаёмся на связи', text: 'Менеджер сопровождает заказ и помогает по вопросам эксплуатации и гарантии.' }
];

export default function ReviewsSection() {
  return (
    <section className="section reviews-section" id="buyers">
      <div className="container">
        <div className="section-heading split-heading"><div><span className="eyebrow">Покупателям</span><h2>Понятно на каждом этапе</h2></div><p>Мебель изготавливается индивидуально, поэтому все важные параметры закрепляются до начала производства.</p></div>
        <div className="reviews-grid">{buyerSteps.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={28} /><p>{text}</p><div><strong>{title}</strong><span>Стандарт работы Divan Bula</span></div></article>)}</div>
      </div>
    </section>
  );
}
