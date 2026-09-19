import { useEffect, useRef, useState } from 'react';
import { Check, Image, MessageCircle, Minus, Palette, Play, Plus, ShieldCheck, ShoppingBag, Truck, X } from 'lucide-react';
import { FABRIC_COLLECTIONS, formatMoney } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose, initialVariant = null }) {
  const { addToCart } = useCart();
  const [media, setMedia] = useState({ type: 'image', index: 0, customUrl: null });
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(initialVariant?.color_name || product?.colors?.[0] || '');
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_COLLECTIONS[0].name);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  const variants = product?.variants && product.variants.length > 0 ? product.variants : null;
  const activeVariant = variants?.find(v => v.color_name === selectedColor) || variants?.[0] || null;

  useEffect(() => {
    if (!product) return undefined;
    const initColor = initialVariant?.color_name || product.colors?.[0] || '';
    setSelectedColor(initColor);
    
    // Find initial variant images if any
    const variant = product.variants?.find(v => v.color_name === initColor);
    const initialImg = variant?.images?.[0]?.url || product.images?.[0] || null;

    setMedia({ type: 'image', index: 0, customUrl: initialImg }); 
    setQuantity(1); 
    setSelectedFabric(FABRIC_COLLECTIONS[0].name);

    const previous = document.activeElement;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll('button, a[href], video[controls]');
        if (!nodes?.length) return;
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { 
      document.body.style.overflow = priorOverflow; 
      document.removeEventListener('keydown', handleKey); 
      previous?.focus?.(); 
    };
  }, [product, initialVariant, onClose]);

  if (!product) return null;

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const matchedVariant = variants?.find(v => v.color_name === color);
    if (matchedVariant && matchedVariant.images && matchedVariant.images.length > 0) {
      setMedia({ type: 'image', index: 0, customUrl: matchedVariant.images[0].url });
    }
  };

  const activePrice = (activeVariant && activeVariant.price_override) 
    ? activeVariant.price_override 
    : product.price;

  const currentDisplayImage = media.customUrl 
    ? media.customUrl 
    : (product.images[media.index] || '/media/products/orda-1.webp');

  const isSofa = !['tables', 'chairs'].includes(product.category) && !product.name.toLowerCase().startsWith('диван');
  const displayName = isSofa ? `Диван ${product.name}` : product.name;

  const whatsapp = `https://wa.me/77475560315?text=${encodeURIComponent(`Здравствуйте! Интересует ${displayName}. Цвет: ${selectedColor}${product.category !== 'tables' ? `, ткань: ${selectedFabric}` : ''}. Подскажите по наличию и срокам.`)}`;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <button ref={closeRef} className="modal-close" type="button" onClick={onClose} aria-label="Закрыть карточку"><X size={22} /></button>
        <div className="product-gallery">
          <div className="gallery-stage">
            {media.type === 'video' && product.video
              ? <video src={product.video} poster={product.images[0]} controls playsInline preload="metadata" aria-label={`Видео ${displayName}`} />
              : <img src={currentDisplayImage} alt={`${displayName} в цвете ${selectedColor}`} />}
          </div>
          {(product.images.length > 1 || product.video) && <div className="gallery-thumbs">
            {product.images.map((src, index) => (
              <button 
                key={src} 
                type="button" 
                className={media.type === 'image' && currentDisplayImage === src ? 'active' : ''} 
                onClick={() => setMedia({ type: 'image', index, customUrl: src })}
              >
                <img src={src} alt="" />
                <Image size={14} />
              </button>
            ))}
            {product.video && (
              <button 
                type="button" 
                className={media.type === 'video' ? 'active video-thumb' : 'video-thumb'} 
                onClick={() => setMedia({ type: 'video', index: 0, customUrl: null })}
              >
                <img src={product.images[1] || product.images[0]} alt="" />
                <span><Play size={18} fill="currentColor" /> Видео</span>
              </button>
            )}
          </div>}
        </div>
        <div className="product-details">
          <div className="detail-topline"><span>{product.categoryLabel}</span><span>Собственное производство</span></div>
          <h2 id="product-modal-title">{displayName}</h2>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">
            {activePrice ? (
              <>
                <div><small>Цена от</small><strong>{formatMoney(activePrice)} ₸</strong></div>
                {product.oldPrice && <><del>{formatMoney(product.oldPrice)} ₸</del><span>−{Math.round((1 - activePrice / product.oldPrice) * 100)}%</span></>}
              </>
            ) : (
              <div><small>Цена зависит от размера и ткани</small><strong>По запросу</strong></div>
            )}
          </div>
          <div className="availability"><i /> {product.availability}</div>
          <div className="choice-block">
            {product.category !== 'tables' && (
              <>
                <div className="choice-label"><span><Palette size={18} /> Коллекция ткани</span><a href={whatsapp} target="_blank" rel="noreferrer">Помочь выбрать</a></div>
                <div className="fabric-options">{FABRIC_COLLECTIONS.map((fabric) => <button key={fabric.id} type="button" className={selectedFabric === fabric.name ? 'selected' : ''} aria-pressed={selectedFabric === fabric.name} onClick={() => setSelectedFabric(fabric.name)}><img src={fabric.image} alt="" /><span><strong>{fabric.name}</strong><small>{fabric.type}</small></span></button>)}</div>
              </>
            )}
            <div className="choice-label color-label"><span>Предпочтительный цвет</span></div>
            <div className="choice-chips">
              {variants ? (
                variants.map((v) => (
                  <button 
                    key={v.id || v.color_name} 
                    type="button" 
                    className={selectedColor === v.color_name ? 'selected' : ''} 
                    aria-pressed={selectedColor === v.color_name} 
                    onClick={() => handleColorChange(v.color_name)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: v.color_hex || '#CCC', border: '1px solid rgba(0,0,0,0.2)' }} />
                    {v.color_name}
                  </button>
                ))
              ) : (
                product.colors.map((color) => (
                  <button 
                    key={color} 
                    type="button" 
                    className={selectedColor === color ? 'selected' : ''} 
                    aria-pressed={selectedColor === color} 
                    onClick={() => handleColorChange(color)}
                  >
                    {color}
                  </button>
                ))
              )}
            </div>
          </div>
          <dl className="spec-grid">
            <div><dt>Габариты</dt><dd>{product.dimensions}</dd></div>
            {product.sleepingArea && product.sleepingArea !== 'Не предусмотрено' && (
              <div><dt>Спальное место</dt><dd>{product.sleepingArea}</dd></div>
            )}
            <div><dt>{product.category === 'tables' ? 'Вместимость' : 'Посадочных мест'}</dt><dd>{product.seats}</dd></div>
            <div><dt>Производство</dt><dd>Астана, Казахстан</dd></div>
          </dl>
          <div className="feature-list">{product.features.map((feature) => <span key={feature}><Check size={17} /> {feature}</span>)}</div>
          <details className="materials"><summary>Материалы и конструкция</summary><ul>{product.materials.map((item) => <li key={item}>{item}</li>)}</ul></details>
          <div className="modal-actions"><div className="quantity"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Уменьшить количество"><Minus size={17} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(20, quantity + 1))} aria-label="Увеличить количество"><Plus size={17} /></button></div><button className="button button-primary" type="button" onClick={() => addToCart(product.id, quantity)}><ShoppingBag size={18} /> Добавить в корзину</button></div>
          <a className="whatsapp-order" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Уточнить детали в WhatsApp</a>
          <div className="service-row"><span><Truck size={19} /> Доставка по РК</span><span><ShieldCheck size={19} /> Гарантия 18 месяцев</span></div>
        </div>
      </section>
    </div>
  );
}
