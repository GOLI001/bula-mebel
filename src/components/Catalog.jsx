import { useState } from 'react';
import { PRODUCT_CATEGORIES } from '../data/products';
import { useCatalog } from '../context/CatalogContext';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function Catalog() {
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { products: catalogProducts, catalogError } = useCatalog();
  const products = catalogProducts.filter((product) => category === 'all' || product.category === category);

  return (
    <section className="section catalog-section" id="catalog">
      <div className="container">
        <div className="section-heading split-heading">
          <div><span className="eyebrow">Каталог</span><h2>Коллекция мебели</h2></div>
          <p>Диваны, столы и стулья фабричного качества. Откройте карточку, чтобы посмотреть фото, размеры и доступные цвета.</p>
        </div>
        <div className="category-tabs" role="group" aria-label="Фильтр каталога">
          {PRODUCT_CATEGORIES.map((item) => (
            <button key={item.id} type="button" className={category === item.id ? 'active' : ''} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>
          ))}
        </div>
        {catalogError && <p className="catalog-sync-error" role="status">Показываем сохранённую версию каталога. Обновление данных временно недоступно.</p>}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpen={(prod, variant) => {
                setSelectedProduct(prod);
                setSelectedVariant(variant);
              }} 
            />
          ))}
        </div>
        <p className="catalog-note">Цена зависит от выбранной ткани и конфигурации. Финальную стоимость подтвердит менеджер.</p>
      </div>
      <ProductModal 
        product={selectedProduct} 
        initialVariant={selectedVariant}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedVariant(null);
        }} 
      />
    </section>
  );
}
