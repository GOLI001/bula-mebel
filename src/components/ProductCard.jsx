import { ArrowUpRight, Camera, Play, ShoppingBag } from 'lucide-react';
import { formatMoney } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onOpen }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">
      <button type="button" className="product-preview" onClick={onOpen} aria-label={`Открыть карточку ${product.name}`}>
        <img src={product.images[0]} alt={`Диван ${product.name}`} loading="lazy" />
        <span className="product-badge">{product.badge}</span>
        {product.video && <span className="video-pill"><Play size={13} fill="currentColor" /> Есть видео</span>}
      </button>
      <div className="product-content">
        <div className="product-meta"><span>{product.categoryLabel}</span><span className="rating">{product.video ? <Play size={13} fill="currentColor" /> : <Camera size={13} />} Реальные материалы</span></div>
        <button type="button" className="product-title" onClick={onOpen}><span>{product.name}</span><ArrowUpRight size={20} /></button>
        <p className="product-dimensions">{product.dimensions} · {product.seats} мест</p>
        <div className="color-swatches" aria-label="Доступные цвета">
          <i className="swatch swatch-cream" /><i className="swatch swatch-grey" /><i className="swatch swatch-dark" /><span>+47 тканей</span>
        </div>
        <div className="product-footer">
          <div>{product.price ? <><small>от</small><strong>{formatMoney(product.price)} ₸</strong>{product.oldPrice && <del>{formatMoney(product.oldPrice)} ₸</del>}</> : <><small>Стоимость</small><strong className="request-price">По запросу</strong></>}</div>
          <button className="add-button" type="button" onClick={() => addToCart(product.id)} aria-label={`Добавить ${product.name} в корзину`}><ShoppingBag size={19} /><span>В корзину</span></button>
        </div>
      </div>
    </article>
  );
}
