import { useState } from 'react';

const ADMIN_PASSWORD = 'cosmetic2025';
const STORAGE_KEY = 'cp_admin_auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(false);

  if (authed) {
    return <div style={{ width: '100%', minHeight: '100vh' }}>{children}</div>;
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: '#6b00ad', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(107,0,173,0.4)' }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '32px' }}>storefront</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>Shop Manager</h1>
          <p style={{ color: '#71717a', fontSize: '14px', margin: 0 }}>Cosmetic Plug · Roma, Maseru</p>
        </div>

        <div style={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '28px', padding: '24px' }}>
          <label style={{ display: 'block', color: '#71717a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            autoFocus
            style={{ width: '100%', background: '#27272a', border: error ? '2px solid #ef4444' : '1px solid #52525b', borderRadius: '16px', padding: '12px 16px', color: 'white', fontSize: '14px', fontWeight: 700, outline: 'none', marginBottom: '12px', boxSizing: 'border-box' as const }}
          />
          {error && (
            <p style={{ color: '#f87171', fontSize: '12px', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>
              Incorrect password. Try again.
            </p>
          )}
          <button
            onClick={handleLogin}
            style={{ width: '100%', background: '#6b00ad', color: 'white', height: '48px', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
          >
            Sign In →
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#52525b', fontSize: '12px', marginTop: '24px' }}>
          Cosmetic Plug · Roma, Maseru
        </p>
      </div>
    </div>
  );
}