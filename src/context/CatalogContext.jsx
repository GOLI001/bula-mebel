import { createContext, useContext, useMemo, useState } from 'react';
import { PRODUCTS_DATA } from '../data/products';

const CatalogContext = createContext(null);
const STORAGE_KEY = 'divan_bula_catalog_v1';

function loadCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved) && saved.length ? saved : PRODUCTS_DATA;
  } catch {
    return PRODUCTS_DATA;
  }
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(loadCatalog);

  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProducts(next);
    } catch {
      throw new Error('Не удалось сохранить каталог. Возможно, изображения занимают слишком много места.');
    }
  };

  const updateProduct = (product) => persist(products.map((item) => item.id === product.id ? product : item));
  const addProduct = (product) => persist([...products, product]);
  const removeProduct = (productId) => persist(products.filter((item) => item.id !== productId));
  const resetCatalog = () => { localStorage.removeItem(STORAGE_KEY); setProducts(PRODUCTS_DATA); };
  const getProductById = (productId) => products.find((product) => product.id === productId);

  const value = useMemo(() => ({ products, updateProduct, addProduct, removeProduct, resetCatalog, getProductById }), [products]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}
