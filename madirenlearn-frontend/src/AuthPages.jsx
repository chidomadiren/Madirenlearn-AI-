import { useState } from 'react';
import { FaArrowRight, FaGraduationCap, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
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
      // Diagnostic: capture the raw response so we can see exactly what the backend returns.
      const rawText = await response.text().catch(() => '');
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }
      console.log(`[madirenlearn auth:${mode}] status=${response.status} body=`, data);
      if (!response.ok) throw new Error(data.error || 'Unable to sign in. Please check your details and try again.');
      if (!data.token || !data.user) throw new Error('The server did not return a sign-in session (no token or user in response). Please try again.');
      localStorage.setItem('madirenlearn-token', data.token);
      localStorage.setItem('madirenlearn-user', JSON.stringify(data.user));
      // Pass the full session object { token, user } to handleAuthenticated
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
        <div className="auth-brand"><span className="auth-cap"><FaGraduationCap /></span><span>madirenLearn <strong>AI</strong></span></div>
        <span className="auth-kicker">YOUR PERSONAL STUDY SPACE</span>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-intro">{mode === 'login' ? 'Sign in to continue learning, practicing, and growing.' : 'Join MadirenLearn AI and start building your learning journey.'}</p>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && <label><span>Your name</span><div className="auth-input-wrap"><FaUser /><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Student name" required maxLength={100} /></div></label>}
          <label><span>Email address</span><div className="auth-input-wrap"><FaEnvelope /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></div></label>
          <label><span>Password</span><div className="auth-input-wrap"><FaLock /><input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /></div></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <FaArrowRight /></button>
        </form>
        <p className="auth-switch">{mode === 'login' ? 'New to MadirenLearn?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></p>
        <p className="auth-footnote">A welcoming space for learning at your own pace.</p>
      </section>
    </main>
  );
}

export function WelcomePage({ name, onEnter }) {
  return (
    <main className="welcome-screen">
      <section className="welcome-card">
        <span className="welcome-cap"><FaGraduationCap /></span>
        <span className="auth-kicker">MADIRENLEARN AI</span>
        <h1>Welcome to madirenLearn AI</h1>
        <h2 className="welcome-student">{name}!</h2>
        <p>Your study space is ready. Explore your subjects, ask your tutor, or challenge yourself with a revision quiz.</p>
        <button className="auth-submit" onClick={onEnter}>Enter Study Space <FaArrowRight /></button>
        <span className="welcome-redirect">Opening your study space shortly…</span>
      </section>
    </main>
  );
}
