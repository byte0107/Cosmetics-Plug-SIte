import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import clsx from 'clsx';

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
    products = [],
    productsLoading = false,
    productsError = null,
    dbConnected = false,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
  } = useStore();

  const [view, setView] = useState<AdminView>('dashboard');
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
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
    const matchCat  = filterCat === 'All' || p.category === filterCat;
    const matchSrch = p.name.toLowerCase().includes(search.toLowerCase());
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
        name: form.name.trim(), category: form.category, price: Number(form.price),
        image: form.image.trim() || 'https://images.unsplash.com/photo-1596462502278-27bfad450216?auto=format&fit=crop&q=80&w=600',
        description: form.description.trim(),
        benefits: form.benefitsRaw.split(',').map(s => s.trim()).filter(Boolean),
        ingredients: form.ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean),
        isNew: form.isNew, isActive: form.isActive, isFeatured: form.isFeatured,
        isOnSale: form.isOnSale, isRecommended: form.isRecommended,
      } as any);
      toast('Product added ✓');
      setView('products');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save. Check your Supabase connection.');
    } finally { setSaving(false); }
  }

  async function handleSaveEdit() {
    if (!editingId || !form.name.trim() || !form.price) {
      setSaveError('Name and price are required.'); return;
    }
    setSaving(true); setSaveError(null);
    try {
      await updateProduct(editingId, {
        name: form.name.trim(), category: form.category, price: Number(form.price),
        image: form.image.trim(), description: form.description.trim(),
        benefits: form.benefitsRaw.split(',').map(s => s.trim()).filter(Boolean),
        ingredients: form.ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean),
        isNew: form.isNew, isActive: form.isActive, isFeatured: form.isFeatured,
        isOnSale: form.isOnSale, isRecommended: form.isRecommended,
      } as any);
      toast('Product updated ✓');
      setView('products');
    } catch (e: any) {
      setSaveError(e.message || 'Failed to update.');
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setDeleteConfirm(null);
    try { await deleteProduct(id); toast('Product deleted.'); }
    catch (e: any) { toast('Delete failed: ' + e.message); }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-zinc-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => view === 'dashboard' ? navigate('/') : (view === 'products' ? setView('dashboard') : setView('products'))}
            className="text-white active:scale-95 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-black text-white text-lg tracking-tight leading-none">
              {view === 'dashboard' ? 'Shop Manager' : view === 'products' ? 'Products' : view === 'add' ? 'Add Product' : 'Edit Product'}
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-none mt-0.5">Cosmetic Plug Admin</p>
          </div>
        </div>
        <div className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase',
          dbConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400')}>
          <div className={clsx('w-1.5 h-1.5 rounded-full', dbConnected ? 'bg-emerald-400' : 'bg-zinc-500')}></div>
          {dbConnected ? 'Live DB' : 'Offline'}
        </div>
      </header>

      {productsError && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
          <p className="text-xs font-bold text-amber-700 flex-1">{productsError}</p>
        </div>
      )}

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="flex-1 p-5 space-y-5 pb-10">
          <div className="grid grid-cols-2 gap-3">
            <StatCard title="Total Products" value={totalProducts}  icon="inventory_2"  color="text-zinc-900"/>
            <StatCard title="Active"          value={activeListings} icon="check_circle" color="text-emerald-500"/>
            <StatCard title="Featured"        value={featured}       icon="star"         color="text-primary"/>
            <StatCard title="On Sale"         value={onSale}         icon="local_offer"  color="text-accent"/>
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Quick Actions</p>
            <div className="space-y-3">
              <ActionCard icon="add_circle" iconColor="text-primary" bg="bg-primary/5"
                title="Add New Product" sub="Add a product to your catalogue" onClick={openAdd}/>
              <ActionCard icon="inventory_2" iconColor="text-zinc-900" bg="bg-zinc-50"
                title="Manage Products" sub={`${totalProducts} products · ${activeListings} active`}
                onClick={() => setView('products')}/>
              <ActionCard icon="auto_awesome" iconColor="text-secondary" bg="bg-secondary/10"
                title="Bontle AI Advisor" sub="Your AI beauty advisor is live"
                onClick={() => navigate('/bontle')}/>
              <ActionCard icon="storefront" iconColor="text-emerald-600" bg="bg-emerald-50"
                title="View Live Store" sub="See what customers see"
                onClick={() => navigate('/shop')}/>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">By Category</p>
            <div className="bg-white rounded-[28px] p-5 border border-zinc-100 space-y-3">
              {CATEGORIES.map(cat => {
                const count = products.filter(p => p.category === cat).length;
                const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-zinc-500 w-20 uppercase tracking-wider">{cat}</span>
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-700" style={{width:`${pct}%`}}></div>
                    </div>
                    <span className="text-[11px] font-black text-zinc-900 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS LIST */}
      {view === 'products' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 pt-4 pb-3 bg-white border-b border-zinc-50 space-y-3 flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-zinc-50 rounded-2xl px-4 py-2.5 border border-zinc-200">
                <span className="material-symbols-outlined text-zinc-400 text-xl">search</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-sm font-bold text-zinc-900 outline-none placeholder:text-zinc-400"/>
                {search && <button onClick={() => setSearch('')} className="text-zinc-400">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>}
              </div>
              <button onClick={openAdd}
                className="bg-primary text-white px-4 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-1 active:scale-95 shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-base">add</span>Add
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {['All', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={clsx('shrink-0 px-4 py-1.5 rounded-xl text-[11px] font-black transition-all active:scale-95',
                    filterCat === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500')}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 pb-10">
            {productsLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            {!productsLoading && filtered.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-zinc-200 block mb-3">inventory_2</span>
                <p className="font-black text-zinc-400">No products found</p>
              </div>
            )}
            {filtered.map(product => (
              <div key={product.id} className="bg-white rounded-[24px] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="flex gap-3 p-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm text-zinc-900 leading-snug line-clamp-1 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black text-zinc-400 uppercase">{product.category}</span>
                      <span className="text-sm font-black text-primary">M{product.price}</span>
                      {product.isNew      && <Tag label="New"      color="bg-accent/10 text-accent"/>}
                      {product.isFeatured && <Tag label="Featured" color="bg-primary/10 text-primary"/>}
                      {product.isOnSale   && <Tag label="Sale"     color="bg-amber-100 text-amber-700"/>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(product.id, !product.isActive)}
                      className={clsx('w-10 h-6 rounded-full transition-all relative', product.isActive ? 'bg-emerald-500' : 'bg-zinc-200')}>
                      <div className={clsx('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
                        product.isActive ? 'left-5' : 'left-1')}></div>
                    </button>
                    <button onClick={() => openEdit(product)}
                      className="w-9 h-9 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-primary active:scale-90 transition-all">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => setDeleteConfirm(product.id)}
                      className="w-9 h-9 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-accent active:scale-90 transition-all">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                {deleteConfirm === product.id && (
                  <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Delete "{product.name}"?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirm(null)} className="text-zinc-400 text-xs font-black px-3 py-1.5">Cancel</button>
                      <button onClick={() => handleDelete(product.id)} className="bg-accent text-white text-xs font-black px-4 py-1.5 rounded-xl active:scale-95">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT FORM */}
      {(view === 'add' || view === 'edit') && (
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-10 space-y-5">
          {saveError && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-accent">error</span>
              <p className="text-sm font-bold text-accent">{saveError}</p>
            </div>
          )}
          <div className="aspect-[16/7] bg-zinc-100 rounded-[28px] overflow-hidden">
            {form.image
              ? <img src={form.image} alt="preview" className="w-full h-full object-cover"/>
              : <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-300">
                  <span className="material-symbols-outlined text-5xl">image</span>
                  <p className="text-xs font-bold">Image preview</p>
                </div>}
          </div>
          <F label="Product Name *">
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="inp" placeholder="e.g. Cerave Foaming Face Wash"/>
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Category *">
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="inp">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="Price (M) *">
              <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})}
                className="inp" placeholder="0"/>
            </F>
          </div>
          <F label="Image URL">
            <input type="url" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
              className="inp" placeholder="https://images.unsplash.com/..."/>
          </F>
          <F label="Description">
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              className="inp resize-none h-24" placeholder="Short description..."/>
          </F>
          <F label="Benefits (comma-separated)">
            <input type="text" value={form.benefitsRaw} onChange={e => setForm({...form, benefitsRaw: e.target.value})}
              className="inp" placeholder="e.g. Moisturizing, Lightweight"/>
          </F>
          <F label="Ingredients (comma-separated)">
            <input type="text" value={form.ingredientsRaw} onChange={e => setForm({...form, ingredientsRaw: e.target.value})}
              className="inp" placeholder="e.g. Ceramides, Hyaluronic Acid"/>
          </F>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Product Flags</p>
            <div className="grid grid-cols-2 gap-3">
              <Tog label="Active"      checked={form.isActive}      onChange={v => setForm({...form, isActive:v})}      color="emerald"/>
              <Tog label="New Arrival" checked={form.isNew}         onChange={v => setForm({...form, isNew:v})}         color="accent"/>
              <Tog label="Featured"    checked={form.isFeatured}    onChange={v => setForm({...form, isFeatured:v})}    color="primary"/>
              <Tog label="On Sale"     checked={form.isOnSale}      onChange={v => setForm({...form, isOnSale:v})}      color="amber"/>
              <Tog label="Recommended" checked={form.isRecommended} onChange={v => setForm({...form, isRecommended:v})} color="primary"/>
            </div>
          </div>
          <button onClick={view === 'add' ? handleSaveNew : handleSaveEdit} disabled={saving}
            className={clsx('w-full h-16 rounded-[28px] font-black text-white flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] uppercase tracking-wider',
              saving ? 'bg-zinc-400' : 'bg-zinc-900 hover:bg-primary')}>
            {saving
              ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</>
              : <><span className="material-symbols-outlined">save</span>{view === 'add' ? 'Add Product' : 'Save Changes'}</>}
          </button>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl whitespace-nowrap">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title:string; value:string|number; icon:string; color:string }) {
  return (
    <div className="bg-white rounded-[28px] p-5 border border-zinc-100 shadow-sm">
      <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center mb-3">
        <span className={clsx('material-symbols-outlined', color)}>{icon}</span>
      </div>
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">{title}</p>
      <span className="text-2xl font-black text-zinc-900 tracking-tighter">{value}</span>
    </div>
  );
}
function ActionCard({ icon, iconColor, bg, title, sub, onClick }: {icon:string;iconColor:string;bg:string;title:string;sub:string;onClick:()=>void}) {
  return (
    <button onClick={onClick} className="w-full bg-white rounded-[24px] p-4 border border-zinc-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all hover:border-zinc-200">
      <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', bg)}>
        <span className={clsx('material-symbols-outlined text-2xl', iconColor)}>{icon}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="font-black text-sm text-zinc-900">{title}</p>
        <p className="text-[11px] text-zinc-400 font-bold mt-0.5">{sub}</p>
      </div>
      <span className="material-symbols-outlined text-zinc-300">chevron_right</span>
    </button>
  );
}
function F({ label, children }: { label:string; children:React.ReactNode }) {
  return <div><label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider block mb-1.5">{label}</label>{children}</div>;
}
function Tog({ label, checked, onChange, color }: { label:string; checked:boolean; onChange:(v:boolean)=>void; color:string }) {
  const activeBg = color==='primary'?'bg-primary':color==='emerald'?'bg-emerald-500':color==='accent'?'bg-accent':'bg-amber-500';
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-3 bg-white rounded-[20px] px-4 py-3 border border-zinc-100 transition-all active:scale-95">
      <div className={clsx('w-9 h-5 rounded-full relative transition-all flex-shrink-0', checked ? activeBg : 'bg-zinc-200')}>
        <div className={clsx('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', checked ? 'left-4' : 'left-0.5')}></div>
      </div>
      <span className="text-[11px] font-black text-zinc-700">{label}</span>
    </button>
  );
}
function Tag({ label, color }: { label:string; color:string }) {
  return <span className={clsx('text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider', color)}>{label}</span>;
}