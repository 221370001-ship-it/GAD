import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gadaesthetics.com';
const ADMIN_USERNAME = 'admingad';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  /**
   * Accepts either the full admin email, or the short username "admingad"
   * which is mapped to the configured admin identity in Firebase Auth.
   */
  async function login(usernameOrEmail, password) {
    const identity = String(usernameOrEmail || '').trim().toLowerCase();
    const email = identity === ADMIN_USERNAME ? ADMIN_EMAIL : identity;
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function resetPassword(email) {
    const identity = String(email || '').trim().toLowerCase();
    return sendPasswordResetEmail(auth, identity === ADMIN_USERNAME ? ADMIN_EMAIL : identity);
  }

  async function logout() {
    return fbSignOut(auth);
  }

  const value = { user, loading, login, logout, resetPassword, adminEmail: ADMIN_EMAIL };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
