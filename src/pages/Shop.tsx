import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

const CATEGORIES = ['All', 'Haircare', 'Skincare', 'Makeup', 'Body'];

export default function Shop() {
  const { adminProducts, currency, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? adminProducts.filter(p => p.isActive)
    : adminProducts.filter(p => p.isActive && p.category === activeCategory);

  const displayPrice = (price: number) => {
    if (currency === 'ZAR') {
      return `R ${(price * 0.74).toFixed(2)}`;
    }
    return `M ${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl px-5 md:px-10 py-4 border-b border-zinc-50">
        <h1 className="font-black text-2xl tracking-tighter text-zinc-900">Shop All</h1>
      </header>

      {/* Categories */}
      <div className="px-5 md:px-10 py-4 overflow-x-auto hide-scrollbar flex gap-2 sticky top-[73px] z-20 bg-white/90 backdrop-blur-xl">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              "whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95",
              activeCategory === cat 
                ? "bg-zinc-900 text-white shadow-md" 
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-5 md:px-10 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-32">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[36px] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-zinc-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.isNew && (
                <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-black uppercase px-2 py-1 rounded-xl tracking-wider">
                  New
                </span>
              )}
              {product.isOnSale && (
                <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded-xl tracking-wider">
                  Sale
                </span>
              )}
            </Link>
            <div className="p-4 md:p-5">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] block mb-1">
                {product.category}
              </span>
              <h3 className="font-black text-sm text-zinc-900 leading-tight mb-3 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="font-black text-primary">{displayPrice(product.price)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-9 h-9 rounded-2xl bg-zinc-900 text-white flex items-center justify-center hover:bg-primary transition-colors active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
