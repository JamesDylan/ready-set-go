'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';

type Tab = 'signin' | 'signup';

/** Translate raw Supabase/network errors into something a parent can understand. */
function getFriendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('row-level security') || m.includes('violates row')) {
    return 'Your account was created — please sign in to continue.';
  }
  if (m.includes('invalid login credentials') || m.includes('invalid_credentials') || m.includes('invalid credentials')) {
    return 'Incorrect email or password. Please try again.';
  }
  if (m.includes('already registered') || m.includes('already exists') || m.includes('user already')) {
    return 'An account with this email already exists — try signing in instead.';
  }
  if (m.includes('password should be') || m.includes('password must be') || m.includes('at least 6')) {
    return 'Password must be at least 6 characters long.';
  }
  if (m.includes('email not confirmed') || m.includes('not confirmed')) {
    return 'Please check your email and click the confirmation link, then sign in.';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many attempts — please wait a moment and try again.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Connection problem — please check your internet and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export default function AuthPage() {
  const router = useRouter();
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  function switchTab(t: Tab) {
    setTab(t);
    setError('');
    setInfo('');
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      setError(getFriendlyError(signInError.message));
      return;
    }
    // If the user has a family they've previously onboarded — skip onboarding
    const { data: families } = await supabase.from('families').select('id').limit(1);
    if (families && families.length > 0) {
      setOnboardingComplete(true);
    }
    setLoading(false);
    router.push('/');
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!familyName.trim()) {
      setError('Please enter a family name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setLoading(false);
      setError(getFriendlyError(signUpError.message));
      return;
    }

    // Email confirmation is required — session not yet available
    if (!data.session) {
      setLoading(false);
      setInfo('Almost there! Check your email for a confirmation link, then come back to sign in.');
      return;
    }

    // Session available — insert the family row
    if (data.user) {
      const { error: familyError } = await supabase
        .from('families')
        .insert({ name: familyName.trim(), owner_id: data.user.id });
      if (familyError) {
        // Non-fatal: family can be created during onboarding instead
        console.error('Family insert failed:', familyError.message);
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
        Ready Set Go
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
              onClick={() => switchTab(t)}
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

        {/* Context note */}
        {tab === 'signin' && (
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.5 }}>
            New here? Switch to <strong>Create account</strong> to set up your family&apos;s routines.
          </p>
        )}
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
            {tab === 'signup' && (
              <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: '0.3rem' }}>
                At least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              style={{
                color: '#B91C1C',
                background: '#FEE2E2',
                borderRadius: '0.5rem',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          {info && (
            <div
              role="status"
              style={{
                color: '#065F46',
                background: '#D1FAE5',
                borderRadius: '0.5rem',
                padding: '0.625rem 0.875rem',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                lineHeight: 1.4,
              }}
            >
              {info}
            </div>
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
            {loading ? 'Please wait…' : tab === 'signin' ? 'Sign in' : 'Create account'}
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
