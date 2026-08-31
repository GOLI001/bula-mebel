import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toasts } = useCart();

  return (
    <div class="toast-container">
      {toasts.map(toast => (
        <div class="toast-item" key={toast.id}>
          <span>🛒</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
