import { useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, LoaderCircle, LockKeyhole, LogOut, Plus, RotateCcw, Save, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { useCatalog } from '../context/CatalogContext';
import { PRODUCTS_DATA } from '../data/products';

const CATEGORY_OPTIONS = [
  ['straight', 'Прямой диван'], ['corner', 'Угловой диван'],
  ['modular', 'Модульный диван'], ['designer', 'Дизайнерский диван']
];

const emptyProduct = () => ({
  id: '', name: '', category: 'straight', categoryLabel: 'Прямой диван',
  price: null, oldPrice: null, dimensions: 'Изготавливается под ваш размер',
  sleepingArea: 'Уточните у менеджера', seats: 3, availability: 'Под заказ · срок уточняется',
  badge: 'Новая модель', images: [], video: null,
  colors: ['Молочный', 'Бежевый', 'Серый'],
  materials: ['Ткань на выбор', 'Деревянный мебельный каркас', 'Эластичный наполнитель'],
  features: ['Изготовление в Астане', 'Выбор ткани и цвета', 'Размер под интерьер'],
  description: ''
});

function slugify(value) {
  const slug = value.toLowerCase().trim().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '');
  return `${slug || 'product'}-${Date.now().toString(36)}`;
}

function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) return reject(new Error('Не удалось обработать изображение'));
        const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
      }, 'image/webp', .78);
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Не удалось открыть ${file.name}`)); };
    image.src = url;
  });
}

export default function AdminPanel({ isOpen, onClose }) {
  const { products, updateProduct, addProduct, removeProduct, replaceCatalog, resetCatalog, uploadImage, hasLocalDraft } = useCatalog();
  const [selectedId, setSelectedId] = useState(products[0]?.id || '');
  const [draft, setDraft] = useState(() => ({ ...products[0] }));
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [password, setPassword] = useState('');
  const [accessError, setAccessError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement; const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; closeRef.current?.focus();
    const keydown = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', keydown); previous?.focus?.(); };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setAccessError('');
    setPassword('');
    if (import.meta.env.DEV) {
      setIsAuthenticated(sessionStorage.getItem('divan_bula_admin_dev') === '1');
      setIsCheckingAccess(false);
      return;
    }
    setIsCheckingAccess(true);
    fetch('/api/admin-auth', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
      .then(async (response) => {
        const data = await response.json();
        if (!cancelled) setIsAuthenticated(response.ok && data.authenticated === true);
      })
      .catch(() => { if (!cancelled) setAccessError('Не удалось проверить доступ. Попробуйте ещё раз.'); })
      .finally(() => { if (!cancelled) setIsCheckingAccess(false); });
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (isNew || !products.length) return;
    const product = products.find((item) => item.id === selectedId) || products[0];
    setSelectedId(product.id);
    setDraft({ ...product, images: [...product.images] });
  }, [products, selectedId, isNew]);

  const signIn = async (event) => {
    event.preventDefault();
    if (!password) return setAccessError('Введите пароль администратора.');
    setIsSigningIn(true); setAccessError('');
    try {
      if (import.meta.env.DEV) {
        const developmentPassword = import.meta.env.VITE_ADMIN_DEV_PASSWORD;
        if (!developmentPassword || password !== developmentPassword) throw new Error('Неверный пароль.');
        sessionStorage.setItem('divan_bula_admin_dev', '1');
      } else {
        const response = await fetch('/api/admin-auth', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
        if (!response.ok) throw new Error(response.status === 503 ? 'Доступ администратора ещё не настроен на Vercel.' : 'Неверный пароль.');
      }
      setPassword(''); setIsAuthenticated(true);
    } catch (error) { setAccessError(error.message || 'Не удалось выполнить вход.'); }
    finally { setIsSigningIn(false); }
  };

  const signOut = async () => {
    if (import.meta.env.DEV) sessionStorage.removeItem('divan_bula_admin_dev');
    else { try { await fetch('/api/admin-auth', { method: 'DELETE', credentials: 'same-origin' }); } catch { /* session still closes in UI */ } }
    setIsAuthenticated(false); setPassword(''); setAccessError('');
  };

  if (!isOpen) return null;
  if (isCheckingAccess) return (
    <div className="admin-backdrop"><section className="admin-panel admin-login-panel" role="dialog" aria-modal="true" aria-label="Проверка доступа"><LoaderCircle className="admin-spinner" size={30} /><strong>Проверяем доступ…</strong></section></div>
  );
  if (!isAuthenticated) return (
    <div className="admin-backdrop">
      <section className="admin-panel admin-login-panel" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button ref={closeRef} className="icon-button admin-login-close" type="button" onClick={onClose} aria-label="Закрыть"><X size={21} /></button>
        <div className="admin-lock-icon"><ShieldCheck size={30} /></div>
        <span>Закрытый раздел</span>
        <h2 id="admin-login-title">Вход для администратора</h2>
        <p>Управление ценами, фотографиями и товарами доступно только владельцу каталога.</p>
        <form onSubmit={signIn}>
          <label htmlFor="admin-password">Пароль</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
          {accessError && <p className="admin-access-error" role="alert">{accessError}</p>}
          <button className="button button-primary" type="submit" disabled={isSigningIn}>{isSigningIn ? <><LoaderCircle className="admin-spinner" size={17} /> Проверяем…</> : <><LockKeyhole size={17} /> Войти</>}</button>
        </form>
      </section>
    </div>
  );
  const field = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const chooseProduct = (id) => { const product = products.find((item) => item.id === id); setSelectedId(id); setDraft({ ...product, images: [...product.images] }); setIsNew(false); setMessage(''); };
  const startNew = () => { setSelectedId(''); setDraft(emptyProduct()); setIsNew(true); setMessage(''); };

  const handleImages = async (event) => {
    const files = [...event.target.files].slice(0, Math.max(0, 6 - draft.images.length));
    if (!files.length) return;
    setIsSaving(true); setMessage('Оптимизируем и загружаем фотографии…');
    try {
      const optimized = await Promise.all(files.map(optimizeImage));
      const uploaded = await Promise.all(optimized.map((image) => uploadImage(image, draft.id || slugify(draft.name))));
      field('images', [...draft.images, ...uploaded]);
      setMessage(import.meta.env.DEV ? 'Фотографии добавлены локально.' : 'Фотографии загружены в облако.');
    }
    catch (error) { setMessage(error.message); }
    finally { setIsSaving(false); }
    event.target.value = '';
  };

  const save = async () => {
    if (!draft.name.trim()) return setMessage('Укажите название товара.');
    if (!draft.images.length) return setMessage('Добавьте хотя бы одну фотографию.');
    const categoryLabel = CATEGORY_OPTIONS.find(([id]) => id === draft.category)?.[1] || 'Диван';
    const product = { ...draft, id: draft.id || slugify(draft.name), name: draft.name.trim(), categoryLabel, price: draft.price ? Number(draft.price) : null, oldPrice: draft.oldPrice ? Number(draft.oldPrice) : null, seats: Number(draft.seats) || 1 };
    setIsSaving(true); setMessage('Сохраняем каталог…');
    try {
      if (isNew) { await addProduct(product); setSelectedId(product.id); setIsNew(false); } else await updateProduct(product);
      setDraft(product); setMessage(import.meta.env.DEV ? 'Изменения сохранены локально.' : 'Каталог обновлён для всех устройств.');
    } catch (error) { setMessage(error.message); }
    finally { setIsSaving(false); }
  };

  const remove = async () => {
    if (isNew || !confirm(`Удалить «${draft.name}» из каталога?`)) return;
    setIsSaving(true);
    try {
      await removeProduct(draft.id); const next = products.find((item) => item.id !== draft.id);
      if (next) chooseProduct(next.id); else startNew();
      setMessage('Товар удалён из общего каталога.');
    } catch (error) { setMessage(error.message); }
    finally { setIsSaving(false); }
  };

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'divan-bula-catalog.json'; link.click(); URL.revokeObjectURL(link.href);
  };

  const importCatalog = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data) || data.some((item) => !item.id || !item.name || !Array.isArray(item.images))) throw new Error('Неверный формат каталога.');
      setIsSaving(true);
      await replaceCatalog(data);
      setMessage(import.meta.env.DEV ? 'Каталог импортирован локально.' : 'Каталог импортирован и опубликован для всех устройств.');
      setSelectedId(data[0].id); setDraft({ ...data[0], images: [...data[0].images] }); setIsNew(false);
    } catch (error) { setMessage(error.message); }
    finally { setIsSaving(false); event.target.value = ''; }
  };

  const restoreDefaults = async () => {
    if (!confirm('Вернуть исходный каталог для всех устройств?')) return;
    setIsSaving(true);
    try {
      await resetCatalog();
      const first = PRODUCTS_DATA[0];
      setSelectedId(first.id); setDraft({ ...first, images: [...first.images] }); setIsNew(false);
      setMessage('Исходный каталог опубликован для всех устройств.');
    } catch (error) { setMessage(error.message); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="admin-backdrop">
      <section className="admin-panel" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <header className="admin-header"><div><span>Divan Bula</span><h2 id="admin-title">Управление каталогом</h2></div><div className="admin-header-actions"><button className="admin-logout" type="button" onClick={signOut}><LogOut size={15} /> Выйти</button><button ref={closeRef} className="icon-button" type="button" onClick={onClose} aria-label="Закрыть редактор"><X size={22} /></button></div></header>
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <button type="button" className="button button-primary new-product" onClick={startNew}><Plus size={17} /> Новый товар</button>
            <div className="admin-product-list">{products.map((product) => <button type="button" key={product.id} className={selectedId === product.id && !isNew ? 'active' : ''} onClick={() => chooseProduct(product.id)}><img src={product.images[0]} alt="" /><span><strong>{product.name}</strong><small>{product.price ? `${product.price.toLocaleString('ru-RU')} ₸` : 'Цена по запросу'}</small></span></button>)}</div>
          </aside>
          <div className="admin-form">
            <div className="admin-form-title"><div><span>{isNew ? 'Новая карточка' : 'Редактирование'}</span><h3>{draft.name || 'Новый товар'}</h3></div>{!isNew && <button type="button" className="danger-link" onClick={remove}><Trash2 size={16} /> Удалить</button>}</div>
            <div className="form-grid">
              <label className="wide">Название товара<input value={draft.name} onChange={(e) => field('name', e.target.value)} placeholder="Например, диван Алма" /></label>
              <label>Категория<select value={draft.category} onChange={(e) => field('category', e.target.value)}>{CATEGORY_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
              <label>Цена, ₸<input type="number" min="0" value={draft.price ?? ''} onChange={(e) => field('price', e.target.value)} placeholder="Оставьте пустым" /></label>
              <label>Старая цена, ₸<input type="number" min="0" value={draft.oldPrice ?? ''} onChange={(e) => field('oldPrice', e.target.value)} placeholder="Необязательно" /></label>
              <label>Количество мест<input type="number" min="1" max="20" value={draft.seats} onChange={(e) => field('seats', e.target.value)} /></label>
              <label className="wide">Размеры<input value={draft.dimensions} onChange={(e) => field('dimensions', e.target.value)} /></label>
              <label className="wide">Описание<textarea rows="4" value={draft.description} onChange={(e) => field('description', e.target.value)} placeholder="Расскажите о модели" /></label>
            </div>
            <div className="admin-images"><div><strong>Фотографии</strong><span>До 6 изображений, они автоматически сжимаются</span></div><label className="upload-button"><ImagePlus size={18} /> Добавить фото<input type="file" accept="image/*" multiple onChange={handleImages} /></label></div>
            <div className="admin-image-grid">{draft.images.map((src, index) => <div key={`${src.slice(0, 40)}-${index}`}><img src={src} alt={`Фото ${index + 1}`} /><button type="button" onClick={() => field('images', draft.images.filter((_, itemIndex) => itemIndex !== index))} aria-label="Удалить фотографию"><X size={14} /></button>{index === 0 && <span>Обложка</span>}</div>)}</div>
            {message && <p className="admin-message" role="status">{message}</p>}
            <div className="admin-actions"><button type="button" className="button button-primary" onClick={save} disabled={isSaving}>{isSaving ? <LoaderCircle className="admin-spinner" size={17} /> : <Save size={17} />} {isSaving ? 'Сохраняем…' : hasLocalDraft ? 'Опубликовать каталог' : 'Сохранить'}</button><button type="button" className="button button-secondary" onClick={exportCatalog} disabled={isSaving}><Download size={17} /> Экспорт JSON</button><label className={`button button-secondary import-button${isSaving ? ' disabled' : ''}`}><Upload size={17} /> Импорт<input type="file" accept="application/json" onChange={importCatalog} disabled={isSaving} /></label></div>
            <div className={`admin-storage-note${hasLocalDraft ? ' migration' : ''}`}><p>{hasLocalDraft ? <><strong>Найдены локальные изменения.</strong> Нажмите «Опубликовать каталог», чтобы перенести их в Blob и показать на всех устройствах.</> : <><strong>{import.meta.env.DEV ? 'Локальный режим.' : 'Облачный каталог.'}</strong> {import.meta.env.DEV ? 'Изменения сохраняются только для разработки.' : 'После сохранения товары и цены становятся доступны всем посетителям.'}</>}</p><button type="button" onClick={restoreDefaults} disabled={isSaving}><RotateCcw size={15} /> Вернуть исходный каталог</button></div>
          </div>
        </div>
      </section>
    </div>
  );
}
