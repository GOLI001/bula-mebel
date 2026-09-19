import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit3, Save, X, Image as ImageIcon, 
  Palette, Package, LogOut, ExternalLink, Check, AlertCircle,
  ArrowLeft, Eye, RefreshCw, KeyRound
} from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { formatMoney } from '../data/products';

const CATEGORIES = [
  { id: 'straight', label: 'Прямой диван' },
  { id: 'corner', label: 'Угловой диван' },
  { id: 'modular', label: 'Модульный диван' },
  { id: 'designer', label: 'Дизайнерский диван' },
];

const POPULAR_COLORS = [
  { name: 'Молочный', hex: '#F5EFEB' },
  { name: 'Бежевый', hex: '#D2B48C' },
  { name: 'Светло-серый', hex: '#C0C0C0' },
  { name: 'Графит', hex: '#383838' },
  { name: 'Изумрудный', hex: '#1B4D3E' },
  { name: 'Синий', hex: '#1E3F66' },
  { name: 'Шоколадный', hex: '#4B3621' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { products, loadProducts, removeProduct, createProduct, updateProduct } = useCatalog();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Edit / Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'straight',
    category_label: 'Прямой диван',
    price: 250000,
    old_price: 280000,
    dimensions: '220 × 95 × 85 см',
    sleeping_area: '200 × 140 см',
    seats: 3,
    availability: 'Под заказ · от 14 дней',
    badge: 'Новинка',
    description: '',
    video: '',
    variants: [
      {
        color_name: 'Молочный',
        color_hex: '#F5EFEB',
        price_override: null,
        images: ['/media/products/orda-1.webp']
      }
    ]
  });

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState('admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordModalError, setPasswordModalError] = useState('');
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadProducts();
      axios.get('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data?.username) {
            setCurrentAdminUser(res.data.username);
            setNewUsername(res.data.username);
          }
        })
        .catch(() => {});
    }
  }, [loadProducts]);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setIsUpdatingCredentials(true);
    setPasswordModalError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/admin/change-credentials', {
        current_password: currentPassword,
        new_username: newUsername || undefined,
        new_password: newPassword || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.access_token) {
        localStorage.setItem('adminToken', res.data.access_token);
      }
      if (res.data.username) {
        setCurrentAdminUser(res.data.username);
      }
      setStatusMessage({ type: 'success', text: 'Логин и пароль успешно изменены!' });
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordModalError(err.response?.data?.detail || 'Не удалось обновить данные. Проверьте текущий пароль.');
    } finally {
      setIsUpdatingCredentials(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const body = new FormData();
      body.append('username', username);
      body.append('password', password);
      const res = await axios.post('/api/admin/token', body);
      localStorage.setItem('adminToken', res.data.access_token);
      setIsAuthenticated(true);
      loadProducts();
    } catch (err) {
      setLoginError(err.response?.data?.detail || 'Неверный логин или пароль');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'straight',
      category_label: 'Прямой диван',
      price: 250000,
      old_price: '',
      dimensions: '220 × 95 × 85 см',
      sleeping_area: '200 × 140 см',
      seats: 3,
      availability: 'Под заказ · от 14 дней',
      badge: 'Новинка',
      description: '',
      video: '',
      variants: [
        {
          color_name: 'Молочный',
          color_hex: '#F5EFEB',
          price_override: null,
          images: ['/media/products/orda-1.webp']
        },
        {
          color_name: 'Графит',
          color_hex: '#383838',
          price_override: null,
          images: ['/media/products/orda-2.webp']
        }
      ]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    
    // Map variants
    let variants = [];
    if (product.variants && product.variants.length > 0) {
      variants = product.variants.map(v => ({
        id: v.id,
        color_name: v.color_name,
        color_hex: v.color_hex || '#CCCCCC',
        price_override: v.price_override || '',
        images: v.images && v.images.length > 0 ? v.images.map(img => img.url) : []
      }));
    } else if (product.colors && product.colors.length > 0) {
      variants = product.colors.map((c, idx) => ({
        color_name: c,
        color_hex: '#CCCCCC',
        price_override: '',
        images: product.images ? [product.images[idx % product.images.length]] : []
      }));
    } else {
      variants = [
        { color_name: 'Основной', color_hex: '#C0C0C0', price_override: '', images: product.images || [] }
      ];
    }

    setFormData({
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel || 'Прямой диван',
      price: product.price || 0,
      old_price: product.oldPrice || '',
      dimensions: product.dimensions || '',
      sleeping_area: product.sleepingArea || '',
      seats: product.seats || 3,
      availability: product.availability || '',
      badge: product.badge || '',
      description: product.description || '',
      video: product.video || '',
      variants: variants
    });
    setIsModalOpen(true);
  };

  // Color variant handlers
  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color_name: 'Новый цвет',
          color_hex: '#E0E0E0',
          price_override: '',
          images: ['/media/products/orda-1.webp']
        }
      ]
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleAddImageToVariant = (variantIndex, imageUrl) => {
    if (!imageUrl.trim()) return;
    setFormData(prev => {
      const updated = [...prev.variants];
      const currentImages = updated[variantIndex].images || [];
      updated[variantIndex] = {
        ...updated[variantIndex],
        images: [...currentImages, imageUrl.trim()]
      };
      return { ...prev, variants: updated };
    });
  };

  const handleRemoveImageFromVariant = (variantIndex, imageIndex) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      const currentImages = updated[variantIndex].images || [];
      updated[variantIndex] = {
        ...updated[variantIndex],
        images: currentImages.filter((_, i) => i !== imageIndex)
      };
      return { ...prev, variants: updated };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const categoryObj = CATEGORIES.find(c => c.id === formData.category);

    const payload = {
      name: formData.name,
      category: formData.category,
      category_label: categoryObj?.label || 'Диван',
      price: parseFloat(formData.price) || 0,
      old_price: formData.old_price ? parseFloat(formData.old_price) : null,
      dimensions: formData.dimensions,
      sleeping_area: formData.sleeping_area,
      seats: parseInt(formData.seats, 10) || 3,
      availability: formData.availability,
      badge: formData.badge,
      description: formData.description,
      video: formData.video || null,
      variants: formData.variants.map(v => ({
        color_name: v.color_name,
        color_hex: v.color_hex,
        price_override: v.price_override ? parseFloat(v.price_override) : null,
        images: v.images
      }))
    };

    try {
      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, payload);
        setStatusMessage({ type: 'success', text: 'Диван успешно обновлен!' });
      } else {
        await createProduct(payload);
        setStatusMessage({ type: 'success', text: 'Диван успешно добавлен в каталог!' });
      }
      setIsModalOpen(false);
      await loadProducts();
    } catch (err) {
      setStatusMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'Ошибка при сохранении. Проверьте данные.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Вы действительно хотите удалить диван "${name}"?`)) {
      try {
        await removeProduct(id);
        await loadProducts();
      } catch (err) {
        alert('Не удалось удалить товар: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', padding: '20px' }}>
        <div style={{ maxWidth: '420px', width: '100%', backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', padding: '32px', border: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>Bula Mebel · Админка</h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Панель управления товарами и цветами</p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              style={{ width: '100%', backgroundColor: '#2C3E50', color: '#FFF', padding: '12px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              {isLoggingIn ? 'Проверка...' : 'Войти в админку'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
            <span>Тестовый доступ: <strong>admin</strong> / <strong>adminpassword123</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
      {/* Top Navbar */}
      <header style={{ backgroundColor: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/')} 
            title="Вернуться на сайт"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}
          >
            <ArrowLeft size={16} /> На сайт
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Управление мебелью · Bula Mebel</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => loadProducts()}
            title="Обновить список"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#475569' }}
          >
            <RefreshCw size={16} /> Обновить
          </button>
          <button
            onClick={() => {
              setPasswordModalError('');
              setIsPasswordModalOpen(true);
            }}
            title="Сменить пароль или логин"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <KeyRound size={16} /> Доступ
          </button>
          <button
            onClick={openCreateModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2C3E50', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={18} /> Добавить диван
          </button>
          <button
            onClick={handleLogout}
            title="Выйти"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 20px' }}>
        {statusMessage && (
          <div style={{ 
            backgroundColor: statusMessage.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            color: statusMessage.type === 'success' ? '#16A34A' : '#DC2626',
            border: `1px solid ${statusMessage.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={18} />
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1E293B', margin: 0 }}>Каталог товаров ({products.length})</h2>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Настройте цвета, фото, цены и размеры диванов</p>
          </div>
        </div>

        {/* Product Cards Table / List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {products.map((product) => {
            const previewImage = (product.variants && product.variants[0]?.images?.[0]?.url) 
              || product.images?.[0] 
              || '/media/products/orda-1.webp';
            
            const variantList = product.variants || [];

            return (
              <div 
                key={product.id} 
                style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}
              >
                {/* Image & Badge */}
                <div style={{ position: 'relative', height: '180px', backgroundColor: '#F1F5F9' }}>
                  <img 
                    src={previewImage} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#1E293B' }}>
                    {product.badge || 'Товар'}
                  </span>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(44,62,80,0.85)', color: '#FFF', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    {product.categoryLabel || product.category}
                  </span>
                </div>

                {/* Body info */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', margin: '0 0 6px 0' }}>{product.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 12px 0' }}>{product.dimensions} · {product.seats} мест</p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2C3E50' }}>{formatMoney(product.price)} ₸</span>
                    {product.oldPrice && (
                      <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: '#94A3B8' }}>{formatMoney(product.oldPrice)} ₸</span>
                    )}
                  </div>

                  {/* Colors & Variants Display */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Цвета ({variantList.length || product.colors?.length || 0}):
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {variantList.length > 0 ? (
                        variantList.map((v, i) => (
                          <div 
                            key={v.id || i} 
                            title={`${v.color_name} (${v.images?.length || 0} фото)`} 
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#FFF', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem' }}
                          >
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: v.color_hex || '#CCC' }} />
                            <span>{v.color_name}</span>
                          </div>
                        ))
                      ) : (
                        (product.colors || []).map((c, i) => (
                          <span key={i} style={{ backgroundColor: '#E2E8F0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{c}</span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      onClick={() => openEditModal(product)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#F1F5F9', color: '#334155', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      <Edit3 size={15} /> Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      title="Удалить"
                      style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1E293B' }}>
                {editingProduct ? `Редактирование: ${editingProduct.name}` : 'Добавление нового дивана'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveProduct} style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Название модели *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Orda"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Бейдж</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Хит продаж, Новинка и т.д."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Базовая цена (₸) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Старая цена (для скидки ₸)</label>
                  <input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Габариты</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="260 × 165 × 82 см"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Спальное место</label>
                  <input
                    type="text"
                    value={formData.sleeping_area}
                    onChange={(e) => setFormData({ ...formData, sleeping_area: e.target.value })}
                    placeholder="200 × 145 см"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Описание дивана</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Опишите особенности, посадку, каркас и удобство..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', resize: 'vertical' }}
                />
              </div>

              {/* COLORS & VARIANTS SECTION */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Palette size={18} color="#2C3E50" /> Варианты цветов и фотографии
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                      Добавьте цвета для дивана. Клиенты смогут переключать их на сайте и видеть соответствующее фото!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Plus size={16} /> Добавить цвет
                  </button>
                </div>

                {/* Variant list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.variants.map((variant, vIdx) => (
                    <div key={vIdx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        
                        {/* Color Name */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Название цвета</label>
                          <input
                            type="text"
                            value={variant.color_name}
                            onChange={(e) => handleVariantChange(vIdx, 'color_name', e.target.value)}
                            placeholder="Например: Молочный"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                          />
                        </div>

                        {/* Color Picker / Hex */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Оттенок (Hex)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="color"
                              value={variant.color_hex || '#CCCCCC'}
                              onChange={(e) => handleVariantChange(vIdx, 'color_hex', e.target.value)}
                              style={{ width: '36px', height: '36px', padding: '2px', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer' }}
                            />
                            <input
                              type="text"
                              value={variant.color_hex}
                              onChange={(e) => handleVariantChange(vIdx, 'color_hex', e.target.value)}
                              placeholder="#F5EFEB"
                              style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>

                        {/* Price override for this color */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Индивидуальная цена (опц.)</label>
                          <input
                            type="number"
                            value={variant.price_override || ''}
                            onChange={(e) => handleVariantChange(vIdx, 'price_override', e.target.value)}
                            placeholder="Как в базовой"
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                          />
                        </div>

                        {/* Delete variant button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(vIdx)}
                            disabled={formData.variants.length <= 1}
                            style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: formData.variants.length <= 1 ? 'not-allowed' : 'pointer', opacity: formData.variants.length <= 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={14} /> Удалить цвет
                          </button>
                        </div>
                      </div>

                      {/* Images for this variant */}
                      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', padding: '12px', border: '1px dashed #CBD5E1' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ImageIcon size={14} /> Фотографии для цвета "{variant.color_name}":
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                          {(variant.images || []).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #CBD5E1' }}>
                              <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => handleRemoveImageFromVariant(vIdx, imgIdx)}
                                style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Input for adding image URL */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Вставьте ссылку на фото (/media/products/... или http...)"
                            id={`img-input-${vIdx}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddImageToVariant(vIdx, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`img-input-${vIdx}`);
                              if (el) {
                                handleAddImageToVariant(vIdx, el.value);
                                el.value = '';
                              }
                            }}
                            style={{ backgroundColor: '#2C3E50', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Добавить фото
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#2C3E50', color: '#FFF', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} />
                  {isSaving ? 'Сохранение...' : 'Сохранить диван'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Change Password / Username Modal */}
      {isPasswordModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="#2C3E50" /> Доступ администратора
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {passwordModalError && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{passwordModalError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCredentials}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Текущий пароль *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Новый логин (если хотите изменить)</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder={currentAdminUser || 'admin'}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Новый пароль *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Придумайте новый надежный пароль"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCredentials}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2C3E50', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}
                >
                  {isUpdatingCredentials ? 'Обновление...' : 'Сохранить данные'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
