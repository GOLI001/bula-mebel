import React from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

export default function App() {
  return (
    <CartProvider>
      <div class="app-root">
        <Header />
        <MobileMenu />
        <main>
          <Hero />
          <Catalog />
          <AboutSection />
        </main>
        <Footer />
        <CartDrawer />
        <Toast />
      </div>
    </CartProvider>
  );
}
