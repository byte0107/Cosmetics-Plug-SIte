import { useState } from 'react';

const ADMIN_PASSWORD = 'cosmeticplug2026';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(false);

  if (authed) return <>{children}</>;

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: '#09090b' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-[28px] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/40">
            <span className="material-symbols-outlined text-white text-3xl">storefront</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Shop Manager</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Cosmetic Plug · Roma, Maseru</p>
        </div>

        <div className="rounded-[28px] p-6 border border-zinc-800" style={{ background: '#18181b' }}>
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-wider block mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            autoFocus
            className={`w-full rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none transition-all mb-3 placeholder:text-zinc-600 ${
              error
                ? 'border-2 border-red-500'
                : 'border border-zinc-700 focus:border-primary'
            }`}
            style={{ background: '#27272a' }}
          />
          {error && (
            <p className="text-red-400 text-xs font-bold mb-3 text-center">
              Incorrect password. Try again.
            </p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white h-12 rounded-2xl font-black text-sm uppercase tracking-wider active:scale-[0.98] transition-all shadow-lg shadow-primary/30"
          >
            Sign In →
          </button>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6 font-medium">
          Cosmetic Plug · Roma, Maseru
        </p>
      </div>
    </div>
  );
}