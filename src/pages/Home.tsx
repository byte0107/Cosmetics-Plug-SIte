import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import clsx from 'clsx';

const CAROUSEL_SLIDES = [
  { id: 1, title: "Glow Like Royalty", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200" },
  { id: 2, title: "Fresh Hair Fresh Start", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1200" },
  { id: 3, title: "NUL Gala Ready", image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=1200" },
];

const REVIEWS = [
  { id: 1, name: "Thato M.", text: "Best plug in Roma! Delivered right to my res.", rating: 5 },
  { id: 2, name: "Lerato S.", text: "The Eco Styler gel is legit. Will buy again.", rating: 5 },
  { id: 3, name: "Kamohelo T.", text: "Bontle AI recommended the perfect foundation shade!", rating: 5 },
];

export default function Home() {
  const { products = [], currency, toggleCurrency, openCart, getCartCount } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const newProducts = products.filter(p => p.isActive && p.isNew);
  const featuredProducts = products.filter(p => p.isActive && p.isFeatured);
  const saleProducts = products.filter(p => p.isActive && p.isOnSale);
  const recommendedProducts = products.filter(p => p.isActive && p.isRecommended);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-2xl px-5 py-4 border-b border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
            C
          </div>
          <h1 className="font-black text-xl tracking-tight text-zinc-900">Cosmetic Plug</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleCurrency}
            className="text-xs font-black bg-zinc-100 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
          >
            {currency}
          </button>
          <button onClick={openCart} className="relative active:scale-95 transition-all">
            <span className="material-symbols-outlined text-3xl text-zinc-900">shopping_bag</span>
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Carousel */}
      <div className="px-5 md:px-10 py-6">
        <div className="relative w-full h-48 md:h-[400px] rounded-[36px] overflow-hidden shadow-lg">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={clsx(
                "absolute inset-0 transition-opacity duration-700",
                index === currentSlide ? "opacity-100" : "opacity-0"
              )}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-12">
                <h2 className="text-white font-black text-2xl md:text-5xl tracking-tighter">{slide.title}</h2>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {CAROUSEL_SLIDES.map((_, index) => (
              <div 
                key={index} 
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Marquee (Moved below slider) */}
      <div className="bg-primary text-white py-3 overflow-hidden whitespace-nowrap mb-8 shadow-inner flex">
        <div className="animate-marquee inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap shrink-0">
          FREE DELIVERY ON NUL CAMPUS • GLOW LIKE ROYALTY • NEW STOCK JUST ARRIVED • FREE DELIVERY ON NUL CAMPUS • GLOW LIKE ROYALTY • NEW STOCK JUST ARRIVED •&nbsp;
        </div>
        <div className="animate-marquee inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap shrink-0" aria-hidden="true">
          FREE DELIVERY ON NUL CAMPUS • GLOW LIKE ROYALTY • NEW STOCK JUST ARRIVED • FREE DELIVERY ON NUL CAMPUS • GLOW LIKE ROYALTY • NEW STOCK JUST ARRIVED •&nbsp;
        </div>
      </div>

      {/* Sections */}
      <ProductSection title="New in Stock" products={newProducts} currency={currency} />
      <ProductSection title="Featured Items" products={featuredProducts} currency={currency} />
      
      {/* Bontle AI Banner */}
      <div className="px-5 md:px-10 py-8">
        <div className="bg-zinc-900 rounded-[44px] p-8 md:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary/40 rounded-full blur-3xl"></div>
          <div className="relative z-10 md:max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-white font-black text-xl md:text-2xl">Meet Bontle</h3>
                <p className="text-zinc-400 text-xs md:text-sm font-medium">Your AI Beauty Advisor</p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm md:text-base mb-6 leading-relaxed">
              Not sure what works for your skin type or the Roma climate? Chat with Bontle for personalized recommendations.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto shrink-0">
            <Link to="/bontle" className="w-full md:w-64 bg-white text-zinc-900 h-14 md:h-16 rounded-[28px] font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-zinc-100">
              <span className="material-symbols-outlined">chat_bubble</span>
              CHAT NOW
            </Link>
          </div>
        </div>
      </div>

      <ProductSection title="On Sale" products={saleProducts} currency={currency} />
      <ProductSection title="Highly Recommended" products={recommendedProducts} currency={currency} />

      {/* Plug Rewards Banner */}
      <div className="px-5 md:px-10 py-4">
        <Link to="/club" className="block bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-[36px] p-6 md:p-8 active:scale-95 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.3em]">Plug Rewards</span>
            <span className="text-sm md:text-base font-black text-zinc-900">2,450 pts</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden shadow-inner">
            <div className="bg-primary h-full rounded-full w-[80%]"></div>
          </div>
          <p className="text-xs md:text-sm text-zinc-600 font-medium">50 pts away from <strong className="text-zinc-900">R10 Discount</strong></p>
        </Link>
      </div>

      {/* Reviews Scroll */}
      <div className="py-8">
        <div className="px-5 md:px-10 mb-6">
          <h3 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter">Campus Love</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 md:px-10 pb-4">
          {REVIEWS.map(review => (
            <div key={review.id} className="min-w-[280px] md:min-w-[320px] bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex gap-1 text-accent mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-sm md:text-base text-zinc-700 font-medium mb-6 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-sm font-black text-zinc-400">
                  {review.name.charAt(0)}
                </div>
                <span className="text-sm font-black text-zinc-900">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="px-5 md:px-10 pb-12">
        <a href="https://wa.me/26650963071" target="_blank" rel="noreferrer" className="flex items-center justify-between bg-zinc-50 border border-zinc-100 rounded-[32px] p-6 active:scale-95 transition-all hover:bg-zinc-100">
          <div>
            <h4 className="font-black text-zinc-900 mb-1 md:text-lg">Need Help?</h4>
            <p className="text-xs md:text-sm text-zinc-500 font-medium">WhatsApp us directly</p>
          </div>
          <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">forum</span>
          </div>
        </a>
      </div>

    </div>
  );
}

function ProductSection({ title, products, currency }: { title: string, products: Product[], currency: string }) {
  const { addToCart } = useStore();
  if (products.length === 0) return null;

  const displayPrice = (price: number) => {
    if (currency === 'ZAR') return `R ${(price * 0.74).toFixed(2)}`;
    return `M ${price.toFixed(2)}`;
  };

  return (
    <div className="py-6">
      <div className="px-5 md:px-10 mb-4 flex justify-between items-end">
        <h3 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter">{title}</h3>
        <Link to="/shop" className="text-xs font-black text-primary uppercase tracking-wider hover:underline">View All</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 md:px-10 pb-4">
        {products.map(product => (
          <div key={product.id} className="min-w-[160px] md:min-w-[200px] max-w-[200px] bg-white rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 shrink-0">
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
            <div className="p-4">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] block mb-1">
                {product.category}
              </span>
              <h4 className="font-black text-sm text-zinc-900 leading-tight mb-3 line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center justify-between">
                <span className="font-black text-primary">{displayPrice(product.price)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-2xl bg-zinc-900 text-white flex items-center justify-center hover:bg-primary transition-colors active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px] md:text-[20px]">add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
