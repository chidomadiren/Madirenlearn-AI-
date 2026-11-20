import { useState } from 'react';
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { API_BASE, apiFetch } from './api';

function AuthBrandHeader() {
  return (
    <div className="glass-brand-header">
      <div className="glass-cap-badge" aria-hidden="true">
        <FaGraduationCap />
      </div>
      <span className="glass-brand-title">
        madirenLearn <strong>AI</strong>
      </span>
    </div>
  );
}

export function AuthPage({ onAuthenticated }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const base = (API_BASE || 'http://localhost:5000').replace(/\/+$/, '');
    const rootBase = base.replace(/\/api$/, '');

    const candidateEndpoints = isRegister
      ? [
          `${base}/auth/signup`,
          `${rootBase}/auth/signup`,
          `${base}/auth/register`,
          `${rootBase}/auth/register`,
        ]
      : [
          `${base}/auth/signin`,
          `${rootBase}/auth/signin`,
          `${base}/auth/login`,
          `${rootBase}/auth/login`,
        ];

    const payload = isRegister
      ? { name: trimmedName, email: trimmedEmail, password }
      : { email: trimmedEmail, password };

    try {
      let response = null;
      let data = {};

      for (const endpoint of [...new Set(candidateEndpoints)]) {
        const res = await apiFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        response = res;
        data = await res.json().catch(() => ({}));

        if (res.status !== 404) {
          break;
        }
      }

      if (!response || !response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            (response?.status === 404
              ? 'Auth route returned 404. Check your Express auth route mount path.'
              : 'Authentication failed. Please check your details.')
        );
      }

      const token = data.token || data.session?.token || 'active-session';
      const user = data.user || {
        name: trimmedName || trimmedEmail.split('@')[0] || 'Student',
        email: trimmedEmail,
      };

      if (rememberMe) {
        localStorage.setItem('madirenlearn-token', token);
        localStorage.setItem('madirenlearn-user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('madirenlearn-token', token);
        sessionStorage.setItem('madirenlearn-user', JSON.stringify(user));
      }

      onAuthenticated({ token, user });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Cannot reach the server. Please make sure your backend server is running.'
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-screen glass-bg-wrapper">
      <section className="auth-card glass-card">
        <AuthBrandHeader />

        <span className="glass-eyebrow">YOUR PERSONAL STUDY SPACE</span>
        <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <p className="glass-subtitle">
          {isRegister
            ? 'Join madirenLearn AI to start learning, practicing, and growing.'
            : 'Sign in to continue learning, practicing, and growing.'}
        </p>

        {error && (
          <div className="glass-error-banner" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-form">
          {isRegister && (
            <div className="glass-input-group">
              <label htmlFor="auth-name">Full name</label>
              <div className="glass-input-wrap">
                <FaUser className="glass-input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div className="glass-input-group">
            <label htmlFor="auth-email">Email address</label>
            <div className="glass-input-wrap">
              <FaEnvelope className="glass-input-icon" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="glass-input-group">
            <label htmlFor="auth-password">Password</label>
            <div className="glass-input-wrap">
              <FaLock className="glass-input-icon" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="glass-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {!isRegister && (
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          )}

          <button type="submit" className="auth-primary-btn" disabled={submitting}>
            <span>
              {submitting
                ? isRegister
                  ? 'Creating account…'
                  : 'Signing in…'
                : isRegister
                ? 'Create account'
                : 'Sign in'}
            </span>
            <FaArrowRight />
          </button>
        </form>

        <p className="glass-switch-row">
          {isRegister ? 'Already have an account? ' : 'New to MadirenLearn? '}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => {
              setIsRegister((prev) => !prev);
              setError('');
            }}
          >
            {isRegister ? 'Sign in' : 'Create account'}
          </button>
        </p>

        <span className="footnote">A welcoming space for learning at your own pace.</span>
      </section>
    </main>
  );
}

export function WelcomePage({ name, onEnter }) {
  return (
    <main className="welcome-screen glass-bg-wrapper">
      <section className="welcome-card glass-card welcome-glass-card">
        <AuthBrandHeader />

        <span className="glass-eyebrow">MADIRENLEARN AI</span>
        <h1>Welcome to madirenLearn AI, {name || 'Student'}!</h1>
        <p className="glass-subtitle">
          Your study space is ready. Explore your subjects, ask your tutor, or challenge yourself with a revision quiz.
        </p>

        <button type="button" className="auth-primary-btn" onClick={onEnter}>
          <span>Enter Study Space</span>
          <FaArrowRight />
        </button>

        <span className="footnote welcome-redirect">Opening your study space shortly…</span>
      </section>
    </main>
  );
}