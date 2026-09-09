import { Menu, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems, setIsCartOpen, isMobileMenuOpen, setIsMobileMenuOpen } = useCart();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="logo-link" aria-label="Divan Bula — на главную"><img src="/images/logo.svg" alt="Divan Bula" className="logo-img" /></a>
        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#catalog">Каталог</a><a href="#production">О фабрике</a><a href="#buyers">Покупателям</a><a href="#dealer">Дилерам</a><a href="#contacts">Контакты</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href="tel:+77475560315">+7 747 556-03-15</a>
          <a className="header-message" href="https://wa.me/77475560315?text=Здравствуйте!%20Хочу%20получить%20консультацию." target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp"><MessageCircle size={19} /><span>Консультация</span></a>
          <button className="icon-button cart-button" type="button" onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }} aria-label={`Корзина, товаров: ${totalItems}`}><ShoppingBag size={21} />{totalItems > 0 && <span className="cart-count">{totalItems}</span>}</button>
          <button className="icon-button menu-button" type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label="Открыть меню"><Menu size={22} /></button>
        </div>
      </div>
    </header>
  );
}
