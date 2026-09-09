import { useState } from 'react';
import { PRODUCT_CATEGORIES } from '../data/products';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function Catalog() {
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products: catalogProducts } = useCatalog();
  const products = catalogProducts.filter((product) => category === 'all' || product.category === category);

  return (
    <section className="section catalog-section" id="catalog">
      <div className="container">
        <div className="section-heading split-heading">
          <div><span className="eyebrow">Каталог</span><h2>Выберите свой диван</h2></div>
          <p>Откройте карточку, чтобы посмотреть реальные фото, видео, размеры, материалы и доступные варианты.</p>
        </div>
        <div className="category-tabs" role="group" aria-label="Фильтр каталога">
          {PRODUCT_CATEGORIES.map((item) => (
            <button key={item.id} type="button" className={category === item.id ? 'active' : ''} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>
          ))}
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} />)}
        </div>
        <p className="catalog-note">Цена зависит от выбранной ткани и конфигурации. Финальную стоимость подтвердит менеджер.</p>
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
