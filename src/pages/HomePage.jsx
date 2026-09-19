import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import AboutSection from '../components/AboutSection';
import DealerSection from '../components/DealerSection';
import ReviewsSection from '../components/ReviewsSection';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import Toast from '../components/Toast';
import AiChatWidget from '../components/AiChatWidget';

export default function HomePage() {
  return (
    <div className="app-root">
      <Header />
      <MobileMenu />
      <main>
        <Hero />
        <Catalog />
        <AboutSection />
        <ReviewsSection />
        <DealerSection />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
      <AiChatWidget />
    </div>
  );
}
