import { useState } from 'react';
import { ArrowUpRight, Camera, Play, ShoppingBag } from 'lucide-react';
import { formatMoney } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onOpen }) {
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const variants = product.variants && product.variants.length > 0 ? product.variants : null;
  const activeVariant = variants ? variants[selectedVariantIndex] || variants[0] : null;

  // Active image based on selected color variant
  const activeImage = (activeVariant && activeVariant.images && activeVariant.images.length > 0)
    ? activeVariant.images[0].url
    : (product.images && product.images[0] ? product.images[0] : '/media/products/orda-1.webp');

  // Active price (takes override into account if specified for this color)
  const activePrice = (activeVariant && activeVariant.price_override) 
    ? activeVariant.price_override 
    : product.price;

  return (
    <article className="product-card">
      <button 
        type="button" 
        className="product-preview" 
        onClick={() => onOpen(product, activeVariant)} 
        aria-label={`Открыть карточку ${product.name}`}
      >
        <img src={activeImage} alt={`${product.name} в цвете ${activeVariant?.color_name || ''}`} loading="lazy" />
        <span className="product-badge">{product.badge}</span>
        {product.video && <span className="video-pill"><Play size={13} fill="currentColor" /> Есть видео</span>}
      </button>

      <div className="product-content">
        <div className="product-meta">
          <span>{product.categoryLabel}</span>
          <span className="rating">{product.video ? <Play size={13} fill="currentColor" /> : <Camera size={13} />} Реальные материалы</span>
        </div>

        <button type="button" className="product-title" onClick={() => onOpen(product, activeVariant)}>
          <span>{product.name}</span>
          <ArrowUpRight size={20} />
        </button>

        <p className="product-dimensions">{product.dimensions}{product.seats ? ` · ${product.seats} мест` : ''}</p>

        {/* Dynamic Interactive Color Swatches */}
        <div className="color-swatches" aria-label="Доступные цвета" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {variants ? (
            variants.map((v, idx) => (
              <button
                key={v.id || idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                title={v.color_name}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: v.color_hex || '#CCCCCC',
                  border: selectedVariantIndex === idx ? '2px solid #2C3E50' : '1px solid rgba(0,0,0,0.15)',
                  boxShadow: selectedVariantIndex === idx ? '0 0 0 2px rgba(44,62,80,0.25)' : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transform: selectedVariantIndex === idx ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
                aria-label={`Выбрать цвет ${v.color_name}`}
              />
            ))
          ) : (
            <>
              <i className="swatch swatch-cream" />
              <i className="swatch swatch-grey" />
              <i className="swatch swatch-dark" />
            </>
          )}
          <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '4px' }}>
            {activeVariant ? activeVariant.color_name : '+47 тканей'}
          </span>
        </div>

        <div className="product-footer">
          <div>
            {activePrice ? (
              <>
                <small>от</small>
                <strong>{formatMoney(activePrice)} ₸</strong>
                {product.oldPrice && <del>{formatMoney(product.oldPrice)} ₸</del>}
              </>
            ) : (
              <>
                <small>Стоимость</small>
                <strong className="request-price">По запросу</strong>
              </>
            )}
          </div>
          <button 
            className="add-button" 
            type="button" 
            onClick={() => addToCart(product.id)} 
            aria-label={`Добавить ${product.name} в корзину`}
          >
            <ShoppingBag size={19} />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </article>
  );
}
