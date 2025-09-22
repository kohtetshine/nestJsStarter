"use client";

import { useEffect, useState } from 'react';
import { AuthContainer } from '../components';

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<{ email: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side to avoid hydration mismatch
    setIsClient(true);

    // Check if already signed in
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return;

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
      .then(async (r) => {
        if (!r.ok) return;
        const d = await r.json();
        if (d?.user?.email) {
          setSignedInUser({ email: d.user.email });
        }
      })
      .catch(() => null);
  }, []);

  const handleSignIn = async (data: { email: string; password: string }) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      if (result?.token && isClient) {
        localStorage.setItem('jwt', result.token);
      }
      setSignedInUser({ email: result?.user?.email ?? data.email });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: { email: string; password: string; confirmPassword: string }) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      // After successful signup, user needs to sign in
      setSuccess('Account created successfully! Please sign in.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    if (isClient) {
      localStorage.removeItem('jwt');
    }
    setSignedInUser(null);
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert('Forgot password functionality would be implemented here');
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Welcome</h1>
            <p className="text-slate-600">Sign in to your account or create a new one</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Welcome</h1>
          <p className="text-slate-600">Sign in to your account or create a new one</p>
        </div>

        <AuthContainer
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onForgotPassword={handleForgotPassword}
          onSignOut={handleSignOut}
          loading={loading}
          error={error}
          success={success}
          signedInUser={signedInUser}
        />
      </div>
    </main>
  );
}