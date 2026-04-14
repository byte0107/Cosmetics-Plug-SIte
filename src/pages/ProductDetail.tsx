import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getAIPersonalMatch } from '../services/bontle';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [], addToCart, currency } = useStore();
  
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [aiMatchText, setAiMatchText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setIsAiLoading(true);
      getAIPersonalMatch(product.name).then(text => {
        setAiMatchText(text);
        setIsAiLoading(false);
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-5">
        <span className="material-symbols-outlined text-6xl text-zinc-200 mb-4">inventory_2</span>
        <h2 className="text-xl font-black text-zinc-900 mb-2">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="text-primary font-bold">Back to Shop</button>
      </div>
    );
  }

  const displayPrice = (price: number) => {
    if (currency === 'ZAR') return `R ${(price * 0.74).toFixed(2)}`;
    return `M ${price.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-zinc-50 relative pb-32">
      {/* Floating Header Actions */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-zinc-900">arrow_back</span>
        </button>
        <button 
          onClick={() => navigate('/cart')}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-zinc-900">shopping_bag</span>
        </button>
      </div>

      {/* Full Bleed Image */}
      <div className="w-full aspect-[3/4] bg-zinc-200 relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Pull-up Card */}
      <div className="bg-white rounded-t-[56px] -mt-12 relative z-20 px-6 pt-8 pb-12 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6"></div>
        
        <div className="mb-6">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] block mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-black text-zinc-900 leading-tight mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-primary">{displayPrice(product.price)}</span>
            <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl tracking-wider">
              In Stock
            </span>
          </div>
        </div>

        <p className="text-zinc-600 text-sm leading-relaxed mb-8">
          {product.description}
        </p>

        {/* Bontle AI Skin Match Card */}
        <div className="bg-zinc-900 rounded-[44px] p-6 relative overflow-hidden shadow-xl mb-8">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary animate-pulse">auto_awesome</span>
              <h3 className="text-white font-black text-sm">Bontle AI Match</h3>
            </div>
            
            {isAiLoading ? (
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                {aiMatchText}
              </p>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[98%]"></div>
              </div>
              <span className="text-primary font-black text-xs">98% Match</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-black text-zinc-900 mb-4 uppercase tracking-wider">Why you'll love it</h3>
            <div className="space-y-2">
              {product.benefits.map((benefit, idx) => (
                <div key={idx} className="bg-zinc-50 rounded-3xl px-4 py-3 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">done_all</span>
                  <span className="text-sm font-medium text-zinc-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-black text-zinc-900 mb-4 uppercase tracking-wider">Key Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient, idx) => (
                <span key={idx} className="bg-zinc-50 text-zinc-600 text-xs font-bold px-4 py-2 rounded-2xl">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white/90 backdrop-blur-2xl border-t border-zinc-50 px-6 py-5 rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.07)] z-50 flex items-center gap-4">
        <div className="flex items-center bg-zinc-50 rounded-[24px] p-1">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-zinc-500 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="w-8 text-center font-black text-zinc-900">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-zinc-900 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-zinc-900 text-white h-14 rounded-[28px] font-black flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all uppercase tracking-wider"
        >
          Add to Bag
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
        </button>
      </div>
    </div>
  );
}
