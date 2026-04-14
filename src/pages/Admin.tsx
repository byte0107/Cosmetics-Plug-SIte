import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import clsx from 'clsx';

export default function Admin() {
  const navigate = useNavigate();
  const { adminProducts, updateProduct, addProduct } = useStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);

  // Stats
  const totalProducts = adminProducts.length;
  const activeListings = adminProducts.filter(p => p.isActive).length;
  const thisMonthOrders = 142; // Mock
  const revenue = 12450; // Mock

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleSaveEdit = () => {
    if (editingId && editForm.name && editForm.price) {
      updateProduct(editForm as Product);
      setEditingId(null);
    }
  };

  const handleSaveNew = () => {
    if (editForm.name && editForm.price && editForm.category) {
      addProduct({
        ...editForm,
        id: Date.now().toString(),
        image: editForm.image || 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=600',
        isActive: true
      } as Product);
      setIsAdding(false);
      setEditForm({});
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-900 px-5 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-white active:scale-95 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-black text-lg text-white tracking-tight">Admin Dashboard</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Total Products" value={totalProducts} icon="inventory_2" />
          <StatCard title="Active Listings" value={activeListings} icon="check_circle" color="text-green-500" />
          <StatCard title="Orders (Month)" value={thisMonthOrders} icon="shopping_bag" />
          <StatCard title="Revenue (M)" value={`M${revenue}`} icon="payments" color="text-primary" />
        </div>

        {/* Products List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-zinc-900 tracking-tighter">Products</h2>
            <button 
              onClick={() => { setIsAdding(true); setEditForm({ category: 'Skincare' }); }}
              className="bg-zinc-900 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> Add
            </button>
          </div>

          <div className="space-y-3">
            {adminProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[24px] p-4 border border-zinc-100 shadow-sm">
                {editingId === product.id ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-bold"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={editForm.price} 
                        onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                        className="w-24 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-bold"
                      />
                      <select 
                        value={editForm.category}
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm font-bold"
                      >
                        <option>Haircare</option>
                        <option>Skincare</option>
                        <option>Makeup</option>
                        <option>Body</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <input 
                          type="checkbox" 
                          checked={editForm.isActive} 
                          onChange={e => setEditForm({...editForm, isActive: e.target.checked})}
                          className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                        />
                        Active
                      </label>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="text-xs font-bold text-zinc-500 px-3 py-1">Cancel</button>
                        <button onClick={handleSaveEdit} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-lg">Save</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100" />
                    <div className="flex-1">
                      <h3 className="font-black text-sm text-zinc-900 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-zinc-400 uppercase">{product.category}</span>
                        <span className="text-xs font-black text-primary">M{product.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={clsx("w-2 h-2 rounded-full", product.isActive ? "bg-green-500" : "bg-zinc-300")}></div>
                      <button onClick={() => handleEditClick(product)} className="w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Bottom Sheet */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[430px] bg-white rounded-t-[48px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-zinc-900">Add Product</h2>
              <button onClick={() => setIsAdding(false)} className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 block mb-1">Name</label>
                <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none" placeholder="Product Name" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-zinc-500 block mb-1">Category</label>
                  <select value={editForm.category || 'Skincare'} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none">
                    <option>Haircare</option>
                    <option>Skincare</option>
                    <option>Makeup</option>
                    <option>Body</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold text-zinc-500 block mb-1">Price (M)</label>
                  <input type="number" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500 block mb-1">Description</label>
                <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-medium focus:border-primary outline-none h-24 resize-none" placeholder="Short description..."></textarea>
              </div>
              <button onClick={handleSaveNew} className="w-full bg-zinc-900 text-white h-14 rounded-[28px] font-black uppercase tracking-wider mt-4 active:scale-[0.98] transition-all">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-zinc-900" }: { title: string, value: string | number, icon: string, color?: string }) {
  return (
    <div className="bg-white rounded-[28px] p-5 border border-zinc-100 shadow-sm">
      <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center mb-3">
        <span className={clsx("material-symbols-outlined", color)}>{icon}</span>
      </div>
      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1">{title}</h4>
      <span className="text-2xl font-black text-zinc-900 tracking-tighter">{value}</span>
    </div>
  );
}
