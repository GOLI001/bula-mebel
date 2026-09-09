import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS_DATA } from '../data/products';

const CatalogContext = createContext(null);
const STORAGE_KEY = 'divan_bula_catalog_v1';

function readLocalCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved) && saved.length ? saved : null;
  } catch {
    return null;
  }
}

async function uploadCloudImage(dataUrl, productId) {
  try {
    const { upload } = await import('@vercel/blob/client');
    const image = await fetch(dataUrl).then((response) => response.blob());
    const safeProductId = String(productId || 'new-product').toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 80) || 'new-product';
    const pathname = `products/${safeProductId}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.webp`;
    const blob = await upload(pathname, image, {
      access: 'public', handleUploadUrl: '/api/catalog-images', contentType: 'image/webp'
    });
    return blob.url;
  } catch (error) {
    const detail = error instanceof Error ? error.message : '';
    if (/401|unauthorized/i.test(detail)) throw new Error('Сессия завершена. Выйдите и войдите в админ-панель снова.');
    if (/size|large|413/i.test(detail)) throw new Error('Фотография слишком большая. Выберите другое изображение.');
    throw new Error('Не удалось загрузить фотографию в Blob. Проверьте подключение хранилища и повторите.');
  }
}

export function CatalogProvider({ children }) {
  const localCatalog = useMemo(readLocalCatalog, []);
  const [products, setProducts] = useState(localCatalog || PRODUCTS_DATA);
  const [isCatalogLoading, setIsCatalogLoading] = useState(!import.meta.env.DEV);
  const [catalogError, setCatalogError] = useState('');
  const [hasLocalDraft, setHasLocalDraft] = useState(false);

  const loadCloudCatalog = useCallback(async () => {
    if (import.meta.env.DEV) return;
    try {
      const response = await fetch('/api/catalog', { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Не удалось загрузить облачный каталог.');
      const data = await response.json();
      if (!Array.isArray(data.products) || !data.products.length) throw new Error('Получен неверный каталог.');
      if (data.source === 'default' && localCatalog) {
        setProducts(localCatalog);
        setHasLocalDraft(true);
      } else {
        setProducts(data.products);
        setHasLocalDraft(false);
        localStorage.removeItem(STORAGE_KEY);
      }
      setCatalogError('');
    } catch (error) {
      setCatalogError(error.message || 'Не удалось загрузить облачный каталог.');
    } finally {
      setIsCatalogLoading(false);
    }
  }, [localCatalog]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsCatalogLoading(false);
      return undefined;
    }
    loadCloudCatalog();
    const refresh = () => { if (document.visibilityState === 'visible') loadCloudCatalog(); };
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, [loadCloudCatalog]);

  const persist = useCallback(async (next) => {
    if (import.meta.env.DEV) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProducts(next);
      return next;
    }
    const cloudReady = await Promise.all(next.map(async (product) => ({
      ...product,
      images: await Promise.all(product.images.map((image) => image.startsWith('data:image/') ? uploadCloudImage(image, product.id) : image))
    })));
    const response = await fetch('/api/catalog', {
      method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ products: cloudReady })
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Сессия завершена. Выйдите и войдите в админ-панель снова.');
      throw new Error('Не удалось сохранить каталог в облаке.');
    }
    const data = await response.json();
    setProducts(data.products);
    setHasLocalDraft(false);
    localStorage.removeItem(STORAGE_KEY);
    return data.products;
  }, []);

  const updateProduct = useCallback((product) => persist(products.map((item) => item.id === product.id ? product : item)), [persist, products]);
  const addProduct = useCallback((product) => persist([...products, product]), [persist, products]);
  const removeProduct = useCallback((productId) => persist(products.filter((item) => item.id !== productId)), [persist, products]);
  const replaceCatalog = useCallback((next) => persist(next), [persist]);
  const resetCatalog = useCallback(() => persist(PRODUCTS_DATA), [persist]);
  const getProductById = useCallback((productId) => products.find((product) => product.id === productId), [products]);

  const uploadImage = useCallback(async (dataUrl, productId) => {
    if (import.meta.env.DEV) return dataUrl;
    return uploadCloudImage(dataUrl, productId);
  }, []);

  const value = useMemo(() => ({
    products, updateProduct, addProduct, removeProduct, replaceCatalog, resetCatalog, getProductById, uploadImage,
    isCatalogLoading, catalogError, hasLocalDraft, reloadCatalog: loadCloudCatalog
  }), [products, updateProduct, addProduct, removeProduct, replaceCatalog, resetCatalog, getProductById, uploadImage, isCatalogLoading, catalogError, hasLocalDraft, loadCloudCatalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}
