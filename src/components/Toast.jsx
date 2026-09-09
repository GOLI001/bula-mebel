import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
export default function Toast() { const { toasts } = useCart(); return <div className="toast-container" role="status" aria-live="polite">{toasts.map((toast) => <div className="toast" key={toast.id}><Check size={18} />{toast.message}</div>)}</div>; }
