export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const SIGN_OUT_URL = import.meta.env.VITE_SIGN_OUT_URL || '/api/auth/signout';

export const readSession = () => {
  try {
    const user = JSON.parse(localStorage.getItem('madirenlearn-user') || 'null');
    const token = localStorage.getItem('madirenlearn-token');
    return token && user ? { token, user } : null;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('madirenlearn-token');
  localStorage.removeItem('madirenlearn-user');
};

export async function apiFetch(url, options = {}) {
  const session = readSession();
  const headers = new Headers(options.headers || {});
  if (session?.token) headers.set('Authorization', `Bearer ${session.token}`);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    const error = new Error('Your session has expired. Please sign in again.');
    error.status = response.status;
    throw error;
  }
  return response;
}