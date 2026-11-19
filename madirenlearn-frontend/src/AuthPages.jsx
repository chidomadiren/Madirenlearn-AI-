import { useState } from 'react';
import { FaArrowRight, FaEnvelope, FaGraduationCap, FaLock, FaUser } from 'react-icons/fa';
import { API_BASE, apiFetch } from './api';

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch(`${API_BASE}/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        body: JSON.stringify(mode === 'login' ? { email, password } : { name, email, password }),
      });
      const rawText = await response.text().catch(() => '');
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }
      if (!response.ok) throw new Error(data.error || 'Unable to sign in. Please check your details and try again.');
      if (!data.token || !data.user) throw new Error('The server did not return a sign-in session. Please try again.');
      
      localStorage.setItem('madirenlearn-token', data.token);
      localStorage.setItem('madirenlearn-user', JSON.stringify(data.user));
      onAuthenticated({ token: data.token, user: data.user });
    } catch (requestError) {
      setError(requestError instanceof TypeError ? 'Cannot reach the MadirenLearn server. Check that the backend is running.' : requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand-header">
          <div className="auth-cap-box"><FaGraduationCap /></div>
          <span className="auth-brand-name">madirenLearn <strong>AI</strong></span>
        </div>

        <div className="auth-titles">
          <span className="auth-kicker">YOUR PERSONAL STUDY SPACE</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="auth-intro">{mode === 'login' ? 'Sign in to continue learning, practicing, and growing.' : 'Join MadirenLearn AI and start building your learning journey.'}</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <div className="auth-field-group">
              <label>Your name</label>
              <div className="auth-input-wrap">
                <div className="auth-icon-badge"><FaUser /></div>
                <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" required maxLength={100} />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <div className="auth-icon-badge"><FaEnvelope /></div>
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="auth-field-group">
            <label>Password</label>
            <div className="auth-input-wrap">
              <div className="auth-icon-badge"><FaLock /></div>
              <input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} required />
            </div>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" disabled={busy}>
            <span>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</span>
            <FaArrowRight />
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? 'New to MadirenLearn?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>

        <p className="auth-footnote">A welcoming space for learning at your own pace.</p>
      </section>
    </main>
  );
}

export function WelcomePage({ name, onEnter }) {
  return (
    <main className="welcome-screen">
      <section className="welcome-card">
        <div className="auth-brand-header">
          <div className="auth-cap-box"><FaGraduationCap /></div>
          <span className="auth-brand-name">madirenLearn <strong>AI</strong></span>
        </div>
        <span className="auth-kicker" style={{ marginTop: '0.5rem' }}>MADIRENLEARN AI</span>
        <h1 className="welcome-heading">Welcome to madirenLearn AI, <span className="welcome-name-highlight">{name}!</span></h1>
        <p className="welcome-body-text">Your study space is ready. Explore your subjects, ask your tutor, or challenge yourself with a revision quiz.</p>
        <button className="auth-submit" onClick={onEnter}>
          <span>Enter Study Space</span>
          <FaArrowRight />
        </button>
        <span className="welcome-redirect">Opening your study space shortly…</span>
      </section>
    </main>
  );
}