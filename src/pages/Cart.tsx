import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

type CheckoutStep = 1 | 2 | 3;
type DeliveryZone = 'NUL' | 'Roma' | 'Other';

const DELIVERY_RATES = {
  'NUL': 0,
  'Roma': 10,
  'Other': 50
};

export default function Cart() {
  const navigate = useNavigate();
  const { cart, currency, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  
  const [step, setStep] = useState<CheckoutStep>(1);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('NUL');
  const [copied, setCopied] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const deliveryFee = DELIVERY_RATES[deliveryZone];
  const total = subtotal + deliveryFee;

  const displayPrice = (price: number) => {
    if (currency === 'ZAR') return `R ${(price * 0.74).toFixed(2)}`;
    return `M ${price.toFixed(2)}`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmOrder = () => {
    setStep(3);
  };

  const getWhatsAppLink = () => {
    const itemsText = cart.map(item => `${item.quantity}x ${item.name}`).join('%0A');
    const text = `Lumelang Cosmetic Plug! 🌟%0A%0AI would like to place an order:%0A${itemsText}%0A%0ADelivery: ${deliveryZone}%0ATotal: ${displayPrice(total)}%0A%0APlease confirm my order!`;
    return `https://wa.me/26650963071?text=${text}`;
  };

  if (cart.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-zinc-300">shopping_bag</span>
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tighter">Your bag is empty</h2>
        <p className="text-zinc-500 text-sm mb-8">Looks like you haven't added anything to your bag yet.</p>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-zinc-900 text-white h-16 rounded-[28px] font-black flex items-center justify-center shadow-xl active:scale-[0.98] transition-all uppercase tracking-wider"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header & Progress */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-zinc-100 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => step > 1 ? setStep((step - 1) as CheckoutStep) : navigate(-1)} className="active:scale-95 transition-all">
            <span className="material-symbols-outlined text-zinc-900">close</span>
          </button>
          <h1 className="font-black text-lg text-zinc-900">Checkout</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
        
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={clsx(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/30" : "w-4 bg-zinc-200"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-5 pb-32">
        {/* STEP 1: YOUR BAG */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter mb-6">Your Bag</h2>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-[32px] flex gap-4 shadow-sm border border-zinc-50">
                  <div className="w-20 h-24 bg-zinc-100 rounded-[24px] overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{item.category}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-300 hover:text-accent transition-colors">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                      <h3 className="font-black text-sm text-zinc-900 leading-tight mt-1 line-clamp-1">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-primary">{displayPrice(item.price)}</span>
                      <div className="flex items-center bg-zinc-50 rounded-xl p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-zinc-500">
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-zinc-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-zinc-900">
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500 font-medium text-sm">Subtotal</span>
                <span className="font-black text-zinc-900">{displayPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-zinc-400">Delivery calculated in next step</p>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY & PAYMENT */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter mb-6">Delivery & Payment</h2>
            
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Select Zone</h3>
            <div className="space-y-3 mb-8">
              {(['NUL', 'Roma', 'Other'] as DeliveryZone[]).map(zone => (
                <button
                  key={zone}
                  onClick={() => setDeliveryZone(zone)}
                  className={clsx(
                    "w-full flex items-center justify-between p-5 rounded-[28px] border-2 transition-all active:scale-[0.98]",
                    deliveryZone === zone 
                      ? "border-primary bg-primary/5" 
                      : "border-zinc-100 bg-white hover:border-zinc-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      deliveryZone === zone ? "border-primary" : "border-zinc-300"
                    )}>
                      {deliveryZone === zone && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-bold text-zinc-900">{zone === 'NUL' ? 'NUL Campus' : zone === 'Roma' ? 'Roma Area' : 'Other Areas'}</span>
                  </div>
                  <span className="font-black text-primary">
                    {DELIVERY_RATES[zone] === 0 ? 'FREE' : displayPrice(DELIVERY_RATES[zone])}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3">Payment Methods</h3>
            <div className="bg-zinc-900 rounded-[44px] p-8 relative overflow-hidden mb-8 shadow-xl">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary/25 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-zinc-400 text-xs mb-6">Pay manually to one of these numbers, then confirm your order via WhatsApp.</p>
                
                <div className="space-y-4">
                  <div 
                    onClick={() => handleCopy('50963071', 'mpesa')}
                    className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-[24px] flex items-center justify-between cursor-pointer active:scale-95"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">M-Pesa (Vodacom)</span>
                      <span className="text-white font-black text-lg tracking-wider">50963071</span>
                      <span className="text-zinc-400 text-xs block mt-1">Ts'epo Ntoane</span>
                    </div>
                    <span className="material-symbols-outlined text-white">
                      {copied === 'mpesa' ? 'check_circle' : 'content_copy'}
                    </span>
                  </div>

                  <div 
                    onClick={() => handleCopy('62495282', 'ecocash')}
                    className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-[24px] flex items-center justify-between cursor-pointer active:scale-95"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">EcoCash (Econet)</span>
                      <span className="text-white font-black text-lg tracking-wider">62495282</span>
                      <span className="text-zinc-400 text-xs block mt-1">Ntaoleng Makatsela</span>
                    </div>
                    <span className="material-symbols-outlined text-white">
                      {copied === 'ecocash' ? 'check_circle' : 'content_copy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-500 font-medium text-sm">Subtotal</span>
                <span className="font-bold text-zinc-900">{displayPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-100">
                <span className="text-zinc-500 font-medium text-sm">Delivery</span>
                <span className="font-bold text-zinc-900">{displayPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-900 font-black text-base">Total</span>
                <span className="font-black text-xl text-primary">{displayPrice(total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMED */}
        {step === 3 && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center pt-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
              <span className="material-symbols-outlined text-5xl relative z-10">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter mb-2">Almost Done!</h2>
            <p className="text-zinc-500 text-sm mb-8 px-4">Your order is saved. Complete these 2 steps to get your glow.</p>

            <div className="w-full bg-white rounded-[36px] p-6 shadow-sm border border-zinc-50 mb-8 text-left">
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-black text-zinc-900 shrink-0">1</div>
                <div>
                  <h4 className="font-black text-zinc-900 mb-1">Make Payment</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Pay <strong className="text-primary">{displayPrice(total)}</strong> to the M-Pesa or EcoCash number from the previous step.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-black text-zinc-900 shrink-0">2</div>
                <div>
                  <h4 className="font-black text-zinc-900 mb-1">Send WhatsApp</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Tap the button below to send us your order details and proof of payment.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white/90 backdrop-blur-2xl border-t border-zinc-50 px-6 py-5 rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.07)] z-50">
        {step === 1 && (
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-zinc-900 text-white h-16 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all uppercase tracking-wider"
          >
            Continue to Delivery
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        )}
        {step === 2 && (
          <button 
            onClick={handleConfirmOrder}
            className="w-full bg-primary text-white h-16 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all uppercase tracking-wider"
          >
            Confirm Order
            <span className="material-symbols-outlined">check_circle</span>
          </button>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] text-white h-16 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all uppercase tracking-wider"
            >
              <span className="material-symbols-outlined">forum</span>
              Send WhatsApp
            </a>
            <button 
              onClick={() => {
                clearCart();
                navigate('/');
              }}
              className="w-full bg-zinc-100 text-zinc-900 h-14 rounded-[28px] font-black flex items-center justify-center active:scale-[0.98] transition-all uppercase tracking-wider text-sm"
            >
              Back to Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
