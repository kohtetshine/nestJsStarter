"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  useEffect(() => {
    // If already signed in, show a small message instead of forms
    const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (!jwt) return;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
      .then(async (r) => {
        if (!r.ok) return;
        const d = await r.json();
        setSignedInEmail(d?.user?.email ?? null);
      })
      .catch(() => null);
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data?.token) localStorage.setItem('jwt', data.token);
      setSignedInEmail(data?.user?.email ?? email);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      if (!res.ok) throw new Error(await res.text());
      // After successful signup, switch to login tab
      setTab('login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setSignedInEmail(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm space-y-8">
        <h1 className="text-3xl font-light text-center text-slate-800">Welcome</h1>

        {signedInEmail ? (
          <div className="text-center space-y-6">
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800">
              Welcome back, {signedInEmail}
            </div>
            <button
              onClick={logout}
              className="w-full py-3 px-4 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex border-b border-slate-200">
              <button
                className={`flex-1 py-4 text-sm font-medium transition-all duration-200 ${
                  tab === 'login'
                    ? 'border-b-2 border-slate-800 text-slate-800'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setTab('login')}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-4 text-sm font-medium transition-all duration-200 ${
                  tab === 'signup'
                    ? 'border-b-2 border-slate-800 text-slate-800'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => setTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
            )}

            {tab === 'login' ? (
              <form onSubmit={onLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={onSignup} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm" className="block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all duration-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
