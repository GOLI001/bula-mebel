import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import { useState } from 'react';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import AboutSection from './components/AboutSection';
import DealerSection from './components/DealerSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  return (
    <CatalogProvider>
      <CartProvider>
        <div className="app-root">
          <Header />
          <MobileMenu />
          <main><Hero /><Catalog /><AboutSection /><ReviewsSection /><DealerSection /></main>
          <Footer onOpenAdmin={() => setIsAdminOpen(true)} /><CartDrawer /><Toast />
          <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </div>
      </CartProvider>
    </CatalogProvider>
  );
}
