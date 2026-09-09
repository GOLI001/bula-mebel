import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../data/products';

export default function CartDrawer() {
  const { cart, updateQty, removeFromCart, clearCart, totalItems, totalPrice, hasRequestPrice, isCartOpen, setIsCartOpen } = useCart();
  const closeRef = useRef(null);
  const drawerRef = useRef(null);
  const close = () => setIsCartOpen(false);
  useEffect(() => {
    if (!isCartOpen) return undefined;
    const previous = document.activeElement; const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; closeRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const nodes = drawerRef.current?.querySelectorAll('button, a[href]');
        if (!nodes?.length) return;
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = priorOverflow; document.removeEventListener('keydown', handleKey); previous?.focus?.(); };
  }, [isCartOpen]);
  const orderText = encodeURIComponent(`Здравствуйте! Хочу оформить заказ:\n\n${cart.map((item) => `• ${item.name}, ${item.qty} шт. — ${item.price ? `${formatMoney(item.price * item.qty)} ₸` : 'цена по запросу'}`).join('\n')}\n\n${totalPrice ? `Сумма товаров с указанной ценой: ${formatMoney(totalPrice)} ₸` : 'Прошу рассчитать стоимость заказа.'}`);
  return (
    <>
      <button className={`drawer-overlay cart-overlay ${isCartOpen ? 'active' : ''}`} type="button" onClick={close} tabIndex={isCartOpen ? 0 : -1} aria-label="Закрыть корзину" />
      <aside ref={drawerRef} className={`cart-drawer ${isCartOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Корзина" aria-hidden={!isCartOpen} inert={!isCartOpen ? '' : undefined}>
        <div className="drawer-head"><div><strong>Корзина</strong><span>{totalItems} товар(а)</span></div><button ref={closeRef} className="icon-button" type="button" onClick={close} aria-label="Закрыть корзину"><X size={22} /></button></div>
        <div className="cart-body">
          {cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={42} /><h3>Корзина пока пуста</h3><p>Добавьте понравившуюся модель — она сохранится здесь.</p><a href="#catalog" className="button button-primary" onClick={close}>Перейти в каталог</a></div>
            : cart.map((item) => <article className="cart-item" key={item.id}><img src={item.images[0]} alt={item.name} /><div className="cart-item-info"><span>{item.categoryLabel}</span><strong>{item.name}</strong><b>{item.price ? `${formatMoney(item.price * item.qty)} ₸` : 'Цена по запросу'}</b><div className="cart-item-controls"><div className="quantity compact"><button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Уменьшить"><Minus size={15} /></button><span>{item.qty}</span><button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Увеличить"><Plus size={15} /></button></div><button className="remove-button" type="button" onClick={() => removeFromCart(item.id)} aria-label={`Удалить ${item.name}`}><Trash2 size={17} /></button></div></div></article>)}
        </div>
        {cart.length > 0 && <div className="cart-footer"><div className="cart-total"><span>{hasRequestPrice ? 'Предварительно' : 'Итого'}</span><strong>{totalPrice ? `${formatMoney(totalPrice)} ₸` : 'По запросу'}</strong></div><p>{hasRequestPrice ? 'В корзине есть модели с индивидуальным расчётом. Менеджер рассчитает полную стоимость.' : 'Финальную стоимость, ткань и срок изготовления подтвердит менеджер.'}</p><a className="button whatsapp-button" href={`https://wa.me/77475560315?text=${orderText}`} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Оформить в WhatsApp</a><button className="clear-cart" type="button" onClick={clearCart}>Очистить корзину</button></div>}
      </aside>
    </>
  );
}
