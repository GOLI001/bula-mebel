import { MessageCircle, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function MobileMenu() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useCart();
  const closeRef = useRef(null);
  const drawerRef = useRef(null);
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
      if (event.key === 'Tab') {
        const nodes = drawerRef.current?.querySelectorAll('button, a[href]');
        if (!nodes?.length) return;
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey); closeRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);
  const close = () => setIsMobileMenuOpen(false);
  return (
    <>
      <button className={`drawer-overlay ${isMobileMenuOpen ? 'active' : ''}`} type="button" onClick={close} tabIndex={isMobileMenuOpen ? 0 : -1} aria-label="Закрыть меню" />
      <aside ref={drawerRef} id="mobile-navigation" className={`mobile-drawer ${isMobileMenuOpen ? 'active' : ''}`} aria-hidden={!isMobileMenuOpen} inert={!isMobileMenuOpen ? '' : undefined}>
        <div className="drawer-head"><img src="/images/logo.svg" alt="Divan Bula" /><button ref={closeRef} className="icon-button" type="button" onClick={close} aria-label="Закрыть меню"><X size={22} /></button></div>
        <nav className="mobile-nav" aria-label="Мобильная навигация"><a href="#catalog" onClick={close}>Каталог <span>01</span></a><a href="#production" onClick={close}>О фабрике <span>02</span></a><a href="#buyers" onClick={close}>Покупателям <span>03</span></a><a href="#dealer" onClick={close}>Дилерам <span>04</span></a><a href="#contacts" onClick={close}>Контакты <span>05</span></a></nav>
        <div className="mobile-drawer-footer"><a className="button button-primary" href="https://wa.me/77475560315" target="_blank" rel="noreferrer"><MessageCircle size={18} /> Написать в WhatsApp</a><a href="tel:+77475560315">+7 747 556-03-15</a><span>Астана, Казахстан</span></div>
      </aside>
    </>
  );
}
