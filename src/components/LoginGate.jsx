import React, { useState } from 'react';
import { ShieldAlert, KeyRound, User, ArrowLeft } from 'lucide-react';

export default function LoginGate({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Let's call the API login route
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      // Fallback to local offline check if API fails or is not deployed yet (local dev)
      if (username === 'admin' && password === 'packco2026') {
        onLoginSuccess('local-demo-token');
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <button 
          onClick={onBack} 
          className="mb-6 inline-flex items-center gap-2 text-xs text-slate-light/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        {/* Card */}
        <div className="glass p-8 rounded-2xl shadow-xl flex flex-col text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber to-amber-light flex items-center justify-center font-outfit text-white font-extrabold text-lg shadow-lg">P</div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">PackCo Demo Gate</h2>
              <p className="text-xs text-slate-light/60">Enter credentials to launch workspace</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-light/80">Username</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-light/40"><User size={16} /></span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 focus:ring-1 focus:ring-amber/40 text-white text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-light/80">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-light/40"><KeyRound size={16} /></span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 focus:ring-1 focus:ring-amber/40 text-white text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-tr from-amber to-amber-light hover:from-amber-light hover:to-amber text-white font-semibold shadow-lg shadow-amber/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
