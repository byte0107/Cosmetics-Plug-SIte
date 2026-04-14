import { Outlet, NavLink, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import CartDrawer from './CartDrawer';
import clsx from 'clsx';

export default function Layout() {
  const { getCartCount, openCart, currency, toggleCurrency } = useStore();
  const cartCount = getCartCount();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* Desktop header */}
      <header className="hidden md:flex sticky top-0 z-40 w-full bg-white/90 backdrop-blur-2xl border-b border-zinc-100 px-6 lg:px-12 py-4 items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-xl">flare</span>
          </div>
          <div>
            <div className="font-black text-lg text-zinc-900 tracking-tight leading-none uppercase">Cosmetic Plug</div>
            <div className="text-[9px] font-black text-primary tracking-[0.4em] leading-none mt-0.5">Roma · Maseru</div>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <DesktopNav to="/"       label="Home"      />
          <DesktopNav to="/shop"   label="Shop"      />
          <DesktopNav to="/bontle" label="Bontle AI" />
          <DesktopNav to="/club"   label="Rewards"   />
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCurrency}
            className="text-xs font-black bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-xl transition-all active:scale-95"
          >
            {currency === 'LSL' ? 'M LSL' : 'R ZAR'}
          </button>
          <button
            onClick={openCart}
            className="relative w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-zinc-100 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl text-zinc-900">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-zinc-50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-base">flare</span>
          </div>
          <div>
            <div className="font-black text-base text-zinc-900 tracking-tight leading-none uppercase">Cosmetic Plug</div>
            <div className="text-[8px] font-black text-primary tracking-[0.3em] leading-none mt-0.5">Roma · Maseru</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCurrency}
            className="text-[11px] font-black bg-zinc-100 px-2.5 py-1.5 rounded-xl active:scale-95 transition-all"
          >
            {currency === 'LSL' ? 'M LSL' : 'R ZAR'}
          </button>
          <button
            onClick={openCart}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl text-zinc-900">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 w-full pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-zinc-100 px-2 py-2 flex items-center justify-around rounded-t-[28px] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        <MobileNav to="/"       icon="home"         label="Home"   />
        <MobileNav to="/shop"   icon="storefront"   label="Shop"   />
        <MobileNav to="/bontle" icon="auto_awesome" label="Bontle" />
        <CartButton count={cartCount} onClick={openCart} />
        <MobileNav to="/club"   icon="stars"        label="Club"   />
      </nav>

      <CartDrawer />
    </div>
  );
}

function DesktopNav({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to}
      className={({ isActive }) => clsx(
        'text-sm font-black uppercase tracking-wider transition-colors',
        isActive ? 'text-primary' : 'text-zinc-500 hover:text-zinc-900'
      )}>
      {label}
    </NavLink>
  );
}

function MobileNav({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink to={to} end={to === '/'}
      className={({ isActive }) => clsx(
        'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all active:scale-95',
        isActive ? 'text-primary' : 'text-zinc-400'
      )}>
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </NavLink>
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all active:scale-95 text-zinc-400 relative">
      <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
      <span className="text-[9px] font-black uppercase tracking-wider">Bag</span>
      {count > 0 && (
        <span className="absolute top-0 right-1 bg-accent text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
          {count}
        </span>
      )}
    </button>
  );
}