import { Outlet, NavLink, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import CartDrawer from './CartDrawer';
import clsx from 'clsx';

export default function Layout() {
  const { getCartCount, openCart, currency, toggleCurrency } = useStore();
  const cartCount = getCartCount();

  return (
    <div className="w-full min-h-screen bg-zinc-50 relative pb-28 md:pb-0 md:pt-[73px]">
      
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 w-full z-40 bg-white/80 backdrop-blur-2xl px-10 py-4 border-b border-zinc-200 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
            C
          </div>
          <h1 className="font-black text-xl tracking-tight text-zinc-900">Cosmetic Plug</h1>
        </Link>
        
        <nav className="flex items-center gap-8">
          <DesktopNavItem to="/" label="Home" />
          <DesktopNavItem to="/shop" label="Shop" />
          <DesktopNavItem to="/bontle" label="Bontle AI" />
          <DesktopNavItem to="/club" label="Rewards" />
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleCurrency}
            className="text-xs font-black bg-zinc-100 px-3 py-1.5 rounded-xl hover:bg-zinc-200 active:scale-95 transition-all"
          >
            {currency}
          </button>
          <button onClick={openCart} className="relative active:scale-95 transition-all hover:text-primary">
            <span className="material-symbols-outlined text-3xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto bg-white min-h-screen shadow-sm relative">
        <Outlet />
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-2xl border-t border-zinc-50 px-6 py-5 rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.07)] z-40 flex justify-between items-center">
        <NavItem to="/" icon="home" label="Home" />
        <NavItem to="/shop" icon="storefront" label="Shop" />
        <NavItem to="/bontle" icon="auto_awesome" label="Bontle" />
        <button 
          onClick={openCart}
          className="flex flex-col items-center gap-1 relative transition-all duration-300 active:scale-95 text-zinc-400 hover:text-zinc-900"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-3xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider">Bag</span>
        </button>
        <NavItem to="/club" icon="stars" label="Club" />
      </nav>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: string, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => clsx(
        "flex flex-col items-center gap-1 relative transition-all duration-300 active:scale-95",
        isActive ? "text-primary" : "text-zinc-400 hover:text-zinc-900"
      )}
    >
      <span className="material-symbols-outlined text-3xl">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </NavLink>
  );
}

function DesktopNavItem({ to, label }: { to: string, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => clsx(
        "text-sm font-black uppercase tracking-wider transition-colors",
        isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-900"
      )}
    >
      {label}
    </NavLink>
  );
}
