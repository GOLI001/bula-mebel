import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { PRODUCTS_DATA } from '../data/products';

const CatalogContext = createContext(null);

function normalizeProduct(raw) {
  // Extract images from variants or fallback
  const variantImages = (raw.variants || []).flatMap(v => (v.images || []).map(img => img.url)).filter(Boolean);
  const images = variantImages.length > 0 
    ? variantImages 
    : (raw.images && raw.images.length ? raw.images : ['/media/products/orda-1.webp']);

  const colors = (raw.variants && raw.variants.length > 0)
    ? raw.variants.map(v => v.color_name)
    : (raw.colors || ['Молочный', 'Бежевый', 'Серый']);

  return {
    id: raw.id,
    name: raw.name || raw.title || 'Диван',
    category: raw.category || 'straight',
    categoryLabel: raw.category_label || raw.categoryLabel || 'Прямой диван',
    price: raw.price || 0,
    oldPrice: raw.old_price || raw.oldPrice || null,
    dimensions: raw.dimensions || '210 × 95 × 84 см',
    sleepingArea: raw.sleeping_area || raw.sleepingArea || 'Не предусмотрено',
    seats: raw.seats || 3,
    availability: raw.availability || 'Под заказ · от 14 дней',
    badge: raw.badge || 'Новинка',
    description: raw.description || '',
    video: raw.video || null,
    variants: raw.variants || [],
    colors: colors,
    images: images,
    materials: Array.isArray(raw.materials) ? raw.materials : (raw.materials ? [raw.materials] : ['Ткань на выбор', 'Деревянный мебельный каркас']),
    features: Array.isArray(raw.features) ? raw.features : (raw.features ? [raw.features] : ['Изготовление в Астане', 'Выбор ткани и цвета'])
  };
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setIsCatalogLoading(true);
      const res = await axios.get('/api/catalog/products/');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data.map(normalizeProduct));
      } else {
        setProducts(PRODUCTS_DATA);
      }
      setCatalogError('');
    } catch (err) {
      console.warn('Could not load products from API, using fallback data', err);
      // Fallback to initial PRODUCTS_DATA
      setProducts(PRODUCTS_DATA);
    } finally {
      setIsCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const createProduct = useCallback(async (productData) => {
    const res = await axios.post('/api/admin/products/', productData, getAdminHeaders());
    await loadProducts();
    return res.data;
  }, [loadProducts]);

  const updateProduct = useCallback(async (productId, productData) => {
    const res = await axios.put(`/api/admin/products/${productId}`, productData, getAdminHeaders());
    await loadProducts();
    return res.data;
  }, [loadProducts]);

  const removeProduct = useCallback(async (productId) => {
    await axios.delete(`/api/admin/products/${productId}`, getAdminHeaders());
    await loadProducts();
  }, [loadProducts]);

  const addVariant = useCallback(async (productId, variantData) => {
    const res = await axios.post(`/api/admin/products/${productId}/variants/`, variantData, getAdminHeaders());
    await loadProducts();
    return res.data;
  }, [loadProducts]);

  const removeVariant = useCallback(async (variantId) => {
    await axios.delete(`/api/admin/variants/${variantId}`, getAdminHeaders());
    await loadProducts();
  }, [loadProducts]);

  const addImageToVariant = useCallback(async (variantId, imageData) => {
    const res = await axios.post(`/api/admin/variants/${variantId}/images/`, imageData, getAdminHeaders());
    await loadProducts();
    return res.data;
  }, [loadProducts]);

  const removeImage = useCallback(async (imageId) => {
    await axios.delete(`/api/admin/images/${imageId}`, getAdminHeaders());
    await loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback((id) => {
    return products.find(p => p.id === id || String(p.id) === String(id));
  }, [products]);

  const value = useMemo(() => ({
    products,
    isCatalogLoading,
    catalogError,
    loadProducts,
    createProduct,
    updateProduct,
    removeProduct,
    addVariant,
    removeVariant,
    addImageToVariant,
    removeImage,
    getProductById
  }), [
    products,
    isCatalogLoading,
    catalogError,
    loadProducts,
    createProduct,
    updateProduct,
    removeProduct,
    addVariant,
    removeVariant,
    addImageToVariant,
    removeImage,
    getProductById
  ]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside CatalogProvider');
  return context;
}
