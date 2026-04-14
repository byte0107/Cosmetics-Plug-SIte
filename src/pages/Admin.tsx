import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';

const CATEGORIES = ['Haircare', 'Skincare', 'Makeup', 'Body'];
const EMPTY_FORM = {
  name: '', category: 'Skincare', price: 0, image: '',
  description: '', benefitsRaw: '', ingredientsRaw: '',
  isNew: false, isActive: true, isFeatured: false,
  isOnSale: false, isRecommended: false, stock: 0,
};
type AdminView = 'dashboard' | 'products' | 'add' | 'edit';

export default function Admin() {
  const navigate = useNavigate();
  const {
    products = [], productsLoading = false, productsError = null,
    dbConnected = false, loadProducts, addProduct, updateProduct,
    deleteProduct, toggleActive,
  } = useStore();

  const [view, setView]           = useState<AdminView>('dashboard');
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toastMsg, setToastMsg]   = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { loadProducts(); }, []);

  function toast(msg: string) {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3000);
  }

  const totalProducts  = products.length;
  const activeListings = products.filter(p => p.isActive).length;
  const featured       = products.filter(p => p.isFeatured).length;
  const onSale         = products.filter(p => p.isOnSale).length;

  const filtered = products.filter(p => {
    const matchCat   = filterCat === 'All' || p.category === filterCat;
    const matchSrch  = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  function openAdd() {
    setForm({ ...EMPTY_FORM });
    setSaveError(null);
    setView('add');
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name, category: p.category, price: p.price,
      image: p.image || '', description: p.description || '',
      benefitsRaw: (p.benefits || []).join(', '),
      ingredientsRaw: (p.ingredients || []).join(', '),
      isNew: !!p.isNew, isActive: p.isActive !== false,
      isFeatured: !!p.isFeatured, isOnSale: !!p.isOnSale,
      isRecommended: !!p.isRecommended, stock: (p as any).stock ?? 0,
    });
    setSaveError(null);
    setView('edit');
  }

  async function handleSaveNew() {
    if (!form.name.trim() || !form.price || !form.category) {
      setSaveError('Name, price and category are required.'); return;
    }
    setSaving(true); setSaveError(null);
    try {
      await addProduct({
        name: form.name.trim(), category: form.category,
        price: Number(form.price),
        image: form.image.trim() || 'https://images.unsplash.com/photo-1596462502278-27bfad450216?auto=format&fit=crop&q=80&w=600',
        description: form.description.trim(),
        benefits: form.benefitsRaw.split(',').map(s => s.trim()).filter(Boolean),
        ingredients: form.ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean),
        isNew: form.isNew, isActive: form.isActive,
        isFeatured: form.isFeatured, isOnSale: form.isOnSale,
        isRecommended: form.isRecommended,
      } as any);
      toast('Product added ✓'); setView('products');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save.');
    } finally { setSaving(false); }
  }

  async function handleSaveEdit() {
    if (!editingId || !form.name.trim() || !form.price) {
      setSaveError('Name and price are required.'); return;
    }
    setSaving(true); setSaveError(null);
    try {
      await updateProduct(editingId, {
        name: form.name.trim(), category: form.category,
        price: Number(form.price),
        image: form.image.trim(), description: form.description.trim(),
        benefits: form.benefitsRaw.split(',').map(s => s.trim()).filter(Boolean),
        ingredients: form.ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean),
        isNew: form.isNew, isActive: form.isActive,
        isFeatured: form.isFeatured, isOnSale: form.isOnSale,
        isRecommended: form.isRecommended,
      } as any);
      toast('Product updated ✓'); setView('products');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to update.');
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setDeleteConfirm(null);
    try { await deleteProduct(id); toast('Product deleted.'); }
    catch (e: any) { toast('Delete failed: ' + e.message); }
  }

  const S: Record<string, React.CSSProperties> = {
    page:    { minHeight: '100vh', background: '#f4f4f5', display: 'flex', flexDirection: 'column' },
    header:  { position: 'sticky', top: 0, zIndex: 30, background: '#18181b', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
    backBtn: { color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
    dbBadge: (ok: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', background: ok ? 'rgba(34,197,94,0.15)' : '#3f3f46', color: ok ? '#4ade80' : '#a1a1aa', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }),
    dot:     (ok: boolean): React.CSSProperties => ({ width: '6px', height: '6px', borderRadius: '50%', background: ok ? '#4ade80' : '#71717a' }),
    card:    { background: 'white', borderRadius: '20px', border: '1px solid #f4f4f5' },
    inp:     { width: '100%', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '14px', padding: '11px 14px', fontSize: '14px', fontWeight: 600, color: '#18181b', outline: 'none', boxSizing: 'border-box' as const },
  };

  return (
    <div style={S.page}>

      {/* HEADER */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={S.backBtn}
            onClick={() => view === 'dashboard' ? navigate('/') : view === 'products' ? setView('dashboard') : setView('products')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div style={{ color: 'white', fontWeight: 900, fontSize: '18px', lineHeight: 1 }}>
              {view === 'dashboard' ? 'Shop Manager' : view === 'products' ? 'Products' : view === 'add' ? 'Add Product' : 'Edit Product'}
            </div>
            <div style={{ color: '#71717a', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>
              Cosmetic Plug Admin
            </div>
          </div>
        </div>
        <div style={S.dbBadge(dbConnected)}>
          <div style={S.dot(dbConnected)} />
          {dbConnected ? 'Live DB' : 'Offline'}
        </div>
      </header>

      {productsError && (
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fcd34d', padding: '10px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '18px' }}>warning</span>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', margin: 0 }}>{productsError}</p>
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {view === 'dashboard' && (
        <div style={{ flex: 1, padding: '20px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { title: 'Total Products', value: totalProducts,  icon: 'inventory_2',  color: '#6b00ad' },
              { title: 'Active',         value: activeListings, icon: 'check_circle', color: '#22c55e' },
              { title: 'Featured',       value: featured,       icon: 'star',         color: '#6b00ad' },
              { title: 'On Sale',        value: onSale,         icon: 'local_offer',  color: '#ff2d55' },
            ].map(s => (
              <div key={s.title} style={{ ...S.card, padding: '18px' }}>
                <div style={{ width: '38px', height: '38px', background: '#f4f4f5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <span className="material-symbols-outlined" style={{ color: s.color, fontSize: '20px' }}>{s.icon}</span>
                </div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>{s.title}</p>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#18181b' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>Quick Actions</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '24px' }}>
            {[
              { icon: 'add_circle',   title: 'Add Product',  sub: 'Add to your catalogue',        fn: openAdd },
              { icon: 'inventory_2',  title: 'All Products', sub: `${totalProducts} products`,     fn: () => setView('products') },
              { icon: 'auto_awesome', title: 'Bontle AI',    sub: 'Your AI advisor',               fn: () => navigate('/bontle') },
              { icon: 'storefront',   title: 'View Store',   sub: 'See the live store',            fn: () => navigate('/shop') },
            ].map(a => (
              <button key={a.title} onClick={a.fn} style={{ ...S.card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: '1px solid #f4f4f5', textAlign: 'left' }}>
                <div style={{ width: '42px', height: '42px', background: '#f5f0ff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: '#6b00ad', fontSize: '20px' }}>{a.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', color: '#18181b', margin: '0 0 1px' }}>{a.title}</p>
                  <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0 }}>{a.sub}</p>
                </div>
                <span className="material-symbols-outlined" style={{ color: '#d4d4d8', fontSize: '18px' }}>chevron_right</span>
              </button>
            ))}
          </div>

          {/* Category breakdown */}
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>By Category</p>
          <div style={{ ...S.card, padding: '20px' }}>
            {CATEGORIES.map(cat => {
              const count = products.filter(p => p.category === cat).length;
              const pct   = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', width: '72px', textTransform: 'uppercase' }}>{cat}</span>
                  <div style={{ flex: 1, height: '8px', background: '#f4f4f5', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#6b00ad', borderRadius: '4px', width: `${pct}%`, transition: 'width 0.7s' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#18181b', width: '20px', textAlign: 'right' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PRODUCTS LIST ── */}
      {view === 'products' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
          <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid #f4f4f5' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f5', borderRadius: '14px', padding: '8px 14px', border: '1px solid #e4e4e7' }}>
                <span className="material-symbols-outlined" style={{ color: '#a1a1aa', fontSize: '20px' }}>search</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, color: '#18181b' }} />
                {search && (
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a1aa', display: 'flex', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                  </button>
                )}
              </div>
              <button onClick={openAdd} style={{ background: '#6b00ad', color: 'white', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '14px', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>Add
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {['All', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, background: filterCat === cat ? '#18181b' : '#f4f4f5', color: filterCat === cat ? 'white' : '#71717a' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {productsLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
                <div style={{ width: '32px', height: '32px', border: '4px solid #e4e4e7', borderTop: '4px solid #6b00ad', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            )}
            {!productsLoading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#e4e4e7', display: 'block', marginBottom: '12px' }}>inventory_2</span>
                <p style={{ fontWeight: 700, color: '#a1a1aa', margin: 0 }}>No products found</p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filtered.map(product => (
                <div key={product.id} style={{ ...S.card, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '14px', alignItems: 'center' }}>
                    <div style={{ width: '58px', height: '58px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, background: '#f4f4f5' }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '13px', color: '#18181b', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase' }}>{product.category}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b00ad' }}>M{product.price}</span>
                        {product.isNew      && <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '5px', background: '#fff0f3', color: '#ff2d55', textTransform: 'uppercase' }}>New</span>}
                        {product.isFeatured && <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '5px', background: '#f5f0ff', color: '#6b00ad', textTransform: 'uppercase' }}>Feat</span>}
                        {product.isOnSale   && <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '5px', background: '#fffbeb', color: '#d97706', textTransform: 'uppercase' }}>Sale</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => toggleActive(product.id, !product.isActive)}
                        style={{ width: '38px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer', background: product.isActive ? '#22c55e' : '#e4e4e7', position: 'relative', transition: 'background 0.2s' }}>
                        <div style={{ position: 'absolute', top: '3px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s', left: product.isActive ? '19px' : '3px' }} />
                      </button>
                      <button onClick={() => openEdit(product)}
                        style={{ width: '32px', height: '32px', background: '#f4f4f5', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#71717a' }}>edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirm(product.id)}
                        style={{ width: '32px', height: '32px', background: '#f4f4f5', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#71717a' }}>delete</span>
                      </button>
                    </div>
                  </div>
                  {deleteConfirm === product.id && (
                    <div style={{ background: '#18181b', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ color: 'white', fontSize: '12px', fontWeight: 700, margin: 0 }}>Delete "{product.name}"?</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setDeleteConfirm(null)} style={{ color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Cancel</button>
                        <button onClick={() => handleDelete(product.id)} style={{ background: '#ff2d55', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px' }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT FORM ── */}
      {(view === 'add' || view === 'edit') && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 48px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {saveError && (
              <div style={{ background: '#fff0f3', border: '1px solid #fecdd3', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff2d55', fontSize: '18px' }}>error</span>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#ff2d55', margin: 0 }}>{saveError}</p>
              </div>
            )}

            <div style={{ aspectRatio: '16/7', background: '#f4f4f5', borderRadius: '18px', overflow: 'hidden' }}>
              {form.image
                ? <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#d4d4d8' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>image</span>
                    <p style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>Paste an image URL below to preview</p>
                  </div>}
            </div>

            <Fld label="Product Name *"><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Cerave Foaming Face Wash" style={S.inp} /></Fld>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Fld label="Category *">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={S.inp}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Fld>
              <Fld label="Price (M) *"><input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} placeholder="0" style={S.inp} /></Fld>
            </div>

            <Fld label="Image URL"><input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://images.unsplash.com/..." style={S.inp} /></Fld>
            <Fld label="Description"><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short description..." style={{ ...S.inp, height: '88px', resize: 'none' }} /></Fld>
            <Fld label="Benefits (comma-separated)"><input type="text" value={form.benefitsRaw} onChange={e => setForm({...form, benefitsRaw: e.target.value})} placeholder="e.g. Moisturizing, SPF 15" style={S.inp} /></Fld>
            <Fld label="Ingredients (comma-separated)"><input type="text" value={form.ingredientsRaw} onChange={e => setForm({...form, ingredientsRaw: e.target.value})} placeholder="e.g. Ceramides, Hyaluronic Acid" style={S.inp} /></Fld>

            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>Product Flags</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                <Tog label="Active"      checked={form.isActive}      color="#22c55e" onChange={v => setForm({...form, isActive:v})} />
                <Tog label="New Arrival" checked={form.isNew}         color="#ff2d55" onChange={v => setForm({...form, isNew:v})} />
                <Tog label="Featured"    checked={form.isFeatured}    color="#6b00ad" onChange={v => setForm({...form, isFeatured:v})} />
                <Tog label="On Sale"     checked={form.isOnSale}      color="#f59e0b" onChange={v => setForm({...form, isOnSale:v})} />
                <Tog label="Recommended" checked={form.isRecommended} color="#6b00ad" onChange={v => setForm({...form, isRecommended:v})} />
              </div>
            </div>

            <button onClick={view === 'add' ? handleSaveNew : handleSaveEdit} disabled={saving}
              style={{ width: '100%', height: '52px', borderRadius: '26px', border: 'none', background: saving ? '#a1a1aa' : '#18181b', color: 'white', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {saving
                ? <><Spinner />Saving...</>
                : <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>{view === 'add' ? 'Add Product' : 'Save Changes'}</>}
            </button>
          </div>
        </div>
      )}

      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: '#18181b', color: 'white', padding: '10px 22px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
          {toastMsg}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Fld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}

function Tog({ label, checked, onChange, color }: { label: string; checked: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #f4f4f5', borderRadius: '14px', padding: '9px 12px', cursor: 'pointer', width: '100%' }}>
      <div style={{ width: '34px', height: '18px', borderRadius: '9px', position: 'relative', flexShrink: 0, background: checked ? color : '#e4e4e7', transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: '2px', width: '14px', height: '14px', background: 'white', borderRadius: '50%', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: 'left 0.2s', left: checked ? '18px' : '2px' }} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#52525b' }}>{label}</span>
    </button>
  );
}

function Spinner() {
  return <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />;
}