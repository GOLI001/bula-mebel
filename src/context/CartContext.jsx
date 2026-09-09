import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from './CatalogContext';

const CartContext = createContext(null);
const STORAGE_KEY = 'divan_bula_cart_v2';

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => typeof item?.id === 'string' && Number.isFinite(Number(item?.qty)))
      .map((item) => ({ id: item.id, qty: Math.max(1, Math.min(20, Number(item.qty))) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { getProductById } = useCatalog();
  const [cartState, setCartState] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Set());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState)); } catch { /* private mode */ }
  }, [cartState]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const showToast = (message) => {
    const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message }]);
    const timer = setTimeout(() => {
      setToasts((items) => items.filter((toast) => toast.id !== id));
      timers.current.delete(timer);
    }, 2800);
    timers.current.add(timer);
  };

  const addToCart = (productId, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    setCartState((items) => {
      const current = items.find((item) => item.id === productId);
      if (current) return items.map((item) => item.id === productId ? { ...item, qty: Math.min(20, item.qty + quantity) } : item);
      return [...items, { id: productId, qty: Math.min(20, Math.max(1, quantity)) }];
    });
    showToast(`${product.name} добавлен в корзину`);
  };

  const updateQty = (productId, quantity) => setCartState((items) => items
    .map((item) => item.id === productId ? { ...item, qty: Math.min(20, quantity) } : item)
    .filter((item) => item.qty > 0));
  const removeFromCart = (productId) => setCartState((items) => items.filter((item) => item.id !== productId));
  const clearCart = () => setCartState([]);

  const cart = useMemo(() => cartState
    .map((item) => ({ ...getProductById(item.id), qty: item.qty }))
    .filter((item) => item.id), [cartState, getProductById]);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
  const hasRequestPrice = cart.some((item) => !item.price);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, totalItems, totalPrice, hasRequestPrice, isCartOpen, setIsCartOpen, isMobileMenuOpen, setIsMobileMenuOpen, toasts }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
