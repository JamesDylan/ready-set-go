'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Tab = 'signin' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
    } else {
      router.push('/');
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!familyName.trim()) {
      setError('Please enter a family name.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }
    if (data.user) {
      const { error: familyError } = await supabase
        .from('families')
        .insert({ name: familyName.trim(), owner_id: data.user.id });
      if (familyError) {
        setLoading(false);
        setError(familyError.message);
        return;
      }
    }
    setLoading(false);
    router.push('/onboarding');
  }

  const purple = '#7B2FBE';
  const lightPurple = '#f3e8ff';

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg, #f8f0ff)',
        padding: '1rem',
        fontFamily: 'var(--font-nunito), system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-fredoka-one), var(--font-fredoka), cursive',
          fontSize: '2rem',
          color: purple,
          marginBottom: '1.5rem',
          letterSpacing: '0.02em',
        }}
      >
        Unicorn Sparkles
      </h1>

      <div
        style={{
          background: '#fff',
          borderRadius: '1.25rem',
          boxShadow: '0 8px 32px rgba(123,47,190,0.12)',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderRadius: '0.75rem',
            background: lightPurple,
            padding: '4px',
            marginBottom: '1.5rem',
          }}
        >
          {(['signin', 'signup'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '0.625rem',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-nunito), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                background: tab === t ? purple : 'transparent',
                color: tab === t ? '#fff' : purple,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}>
          {tab === 'signup' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem', color: '#333' }}>
                Family name
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. The Smith Family"
                required
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.25rem', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              style={{
                color: '#c0392b',
                background: '#fdf0ef',
                borderRadius: '0.5rem',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#c5a3e0' : purple,
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontFamily: 'var(--font-fredoka-one), var(--font-fredoka), cursive',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Please wait...' : tab === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '2px solid #e9d5ff',
  borderRadius: '0.625rem',
  fontSize: '1rem',
  fontFamily: 'var(--font-nunito), system-ui, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fafafa',
};
