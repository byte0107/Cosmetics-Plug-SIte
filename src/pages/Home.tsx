import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Product } from '../data/products';
import { fetchBanners, Banner } from '../services/productService';
import clsx from 'clsx';

const FALLBACK_SLIDES = [
  { id: '1', title: 'Glow Like Royalty',    subtitle: "Premium skincare for Roma's mountain air", image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200', position: 0, is_active: true },
  { id: '2', title: 'Fresh Hair Fresh Start', subtitle: 'Ultra Braid & One Million Hairpieces',    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1200', position: 1, is_active: true },
  { id: '3', title: 'NUL Gala Ready',        subtitle: 'Exclusive Lashes & Ruby Rose Makeup',      image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=1200', position: 2, is_active: true },
];

const REVIEWS = [
  { id: 1, name: 'Thato M.',     text: 'Best plug in Roma! Delivered right to my res.',               rating: 5 },
  { id: 2, name: 'Lerato S.',    text: 'The Eco Styler gel is legit. Will buy again.',                rating: 5 },
  { id: 3, name: 'Kamohelo T.', text: 'Bontle AI recommended the perfect foundation shade!',         rating: 5 },
];

export default function Home() {
  const { products = [], currency } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_SLIDES as Banner[]);

  // Load banners from Supabase
  useEffect(() => {
    fetchBanners()
      .then(data => { if (data.length > 0) setBanners(data); })
      .catch(() => {}); // fallback stays on error
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const newProducts         = products.filter(p => p.isActive && p.isNew);
  const featuredProducts    = products.filter(p => p.isActive && p.isFeatured);
  const saleProducts        = products.filter(p => p.isActive && p.isOnSale);
  const recommendedProducts = products.filter(p => p.isActive && p.isRecommended);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO CAROUSEL ── */}
      <div className="px-4 md:px-10 py-4 md:py-6">
        <div className="relative w-full h-52 md:h-[420px] rounded-[28px] md:rounded-[36px] overflow-hidden shadow-lg">
          {banners.map((slide, index) => (
            <div key={slide.id}
              className={clsx('absolute inset-0 transition-opacity duration-700',
                index === currentSlide ? 'opacity-100' : 'opacity-0')}>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-5 md:p-12">
                <h2 className="text-white font-black text-xl md:text-5xl tracking-tighter leading-tight">{slide.title}</h2>
                {slide.subtitle && (
                  <p className="text-white/70 text-xs md:text-base mt-1 font-medium">{slide.subtitle}</p>
                )}
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-4 right-5 flex gap-1.5">
            {banners.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)}
                className={clsx('h-1.5 rounded-full transition-all duration-300',
                  index === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50')} />
            ))}
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="bg-primary text-white py-2.5 overflow-hidden whitespace-nowrap mb-6 flex">
        {[0, 1].map(i => (
          <div key={i} aria-hidden={i === 1}
            className="animate-marquee inline-block text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap shrink-0">
            FREE DELIVERY ON NUL CAMPUS &nbsp;•&nbsp; GLOW LIKE ROYALTY &nbsp;•&nbsp; NEW STOCK JUST ARRIVED &nbsp;•&nbsp; PAY VIA M-PESA OR ECOCASH &nbsp;•&nbsp; ASK BONTLE AI &nbsp;•&nbsp;&nbsp;
          </div>
        ))}
      </div>

      {/* ── PRODUCT SECTIONS ── */}
      <ProductSection title="New in Stock"        products={newProducts}         currency={currency} />
      <ProductSection title="Featured Items"      products={featuredProducts}    currency={currency} />

      {/* ── BONTLE AI BANNER ── */}
      <div className="px-4 md:px-10 py-6">
        <div className="bg-zinc-900 rounded-[36px] md:rounded-[44px] p-6 md:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary/40 rounded-full blur-3xl" />
          <div className="relative z-10 md:max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <h3 className="text-white font-black text-lg md:text-2xl">Meet Bontle</h3>
                <p className="text-zinc-400 text-xs font-medium">Your AI Beauty Advisor</p>
              </div>
            </div>
            <p className="text-zinc-300 text-sm mb-5 leading-relaxed">
              Not sure what works for your skin type or the Roma climate? Chat with Bontle for personalised recommendations.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto shrink-0">
            <Link to="/bontle"
              className="w-full md:w-64 bg-white text-zinc-900 h-14 rounded-[28px] font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-zinc-100">
              <span className="material-symbols-outlined">chat_bubble</span>CHAT NOW
            </Link>
          </div>
        </div>
      </div>

      <ProductSection title="On Sale"             products={saleProducts}        currency={currency} />
      <ProductSection title="Highly Recommended"  products={recommendedProducts} currency={currency} />

      {/* ── PLUG REWARDS BANNER ── */}
      <div className="px-4 md:px-10 py-4">
        <Link to="/club"
          className="block bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-[32px] p-5 md:p-8 active:scale-95 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Plug Rewards</span>
            <span className="text-sm font-black text-zinc-900">2,450 pts</span>
          </div>
          <div className="w-full bg-white rounded-full h-2.5 mb-2 overflow-hidden shadow-inner">
            <div className="bg-primary h-full rounded-full w-[80%]" />
          </div>
          <p className="text-xs text-zinc-600 font-medium">50 pts away from <strong className="text-zinc-900">R10 Discount</strong></p>
        </Link>
      </div>

      {/* ── REVIEWS ── */}
      <div className="py-6">
        <div className="px-4 md:px-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter">Campus Love</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-10 pb-4">
          {REVIEWS.map(review => (
            <div key={review.id}
              className="min-w-[260px] md:min-w-[320px] bg-white border border-zinc-100 rounded-[28px] p-5 shadow-sm">
              <div className="flex gap-1 text-accent mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-sm text-zinc-700 font-medium mb-4 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-sm font-black text-zinc-400">
                  {review.name.charAt(0)}
                </div>
                <span className="text-sm font-black text-zinc-900">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHATSAPP CTA ── */}
      <div className="px-4 md:px-10 pb-10">
        <a href="https://wa.me/26650963071" target="_blank" rel="noreferrer"
          className="flex items-center justify-between bg-zinc-50 border border-zinc-100 rounded-[28px] p-5 active:scale-95 transition-all hover:bg-zinc-100">
          <div>
            <h4 className="font-black text-zinc-900 mb-1">Need Help?</h4>
            <p className="text-xs text-zinc-500 font-medium">WhatsApp us directly</p>
          </div>
          <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">forum</span>
          </div>
        </a>
      </div>

    </div>
  );
}

function ProductSection({ title, products, currency }: { title: string; products: Product[]; currency: string }) {
  const { addToCart } = useStore();
  if (products.length === 0) return null;

  const displayPrice = (price: number) =>
    currency === 'ZAR' ? `R ${(price * 0.74).toFixed(2)}` : `M ${price.toFixed(2)}`;

  return (
    <div className="py-5">
      <div className="px-4 md:px-10 mb-4 flex justify-between items-end">
        <h3 className="text-xl md:text-3xl font-black text-zinc-900 tracking-tighter">{title}</h3>
        <Link to="/shop" className="text-xs font-black text-primary uppercase tracking-wider hover:underline">View All</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-10 pb-4">
        {products.map(product => (
          <div key={product.id}
            className="min-w-[150px] md:min-w-[200px] max-w-[200px] bg-white rounded-[28px] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 shrink-0">
            <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-zinc-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-accent text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xl tracking-wider">New</span>
              )}
              {product.isOnSale && (
                <span className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-xl tracking-wider">Sale</span>
              )}
            </Link>
            <div className="p-3 md:p-4">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] block mb-1">{product.category}</span>
              <h4 className="font-black text-sm text-zinc-900 leading-tight mb-3 line-clamp-2">{product.name}</h4>
              <div className="flex items-center justify-between">
                <span className="font-black text-primary text-sm">{displayPrice(product.price)}</span>
                <button onClick={() => addToCart(product)}
                  className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center hover:bg-primary transition-colors active:scale-95 shadow-md">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}