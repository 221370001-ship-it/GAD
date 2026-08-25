import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoldSpinner } from '../../components/common/Spinner';
import logo from '../../assets/logo.svg';

function Botanical({ className }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute text-brand-dark/[0.07] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M100 180 C 100 120, 70 100, 40 90 C 70 85, 95 95, 100 130 C 105 95, 130 85, 160 90 C 130 100, 100 120, 100 180 Z" />
      <path d="M100 180 C 98 130, 90 110, 60 60 M100 180 C 102 130, 110 110, 140 60" />
      <circle cx="60" cy="60" r="6" />
      <circle cx="140" cy="60" r="6" />
      <circle cx="100" cy="40" r="8" />
    </svg>
  );
}

export default function AdminLogin() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/admin-dashboard" replace />;

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setBusy(true);
    try {
      await login(username, password);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err?.code, err?.message);
      const code = err?.code || '';
      let msg;
      switch (code) {
        case 'auth/operation-not-allowed':
          msg = 'Email/Password sign-in is disabled. Firebase Console → Authentication → Sign-in method → enable "Email/Password".';
          break;
        case 'auth/user-not-found':
          msg = 'Admin account not found. Create it in Firebase Console → Authentication → Users → Add user (email: admin@gadaesthetics.com, password: admingad).';
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          msg = 'Invalid credentials — the password is wrong, or the admin user does not exist yet. Create it in Firebase Console → Authentication → Users (email: admin@gadaesthetics.com, password: admingad).';
          break;
        case 'auth/too-many-requests':
          msg = 'Too many attempts. Please wait a moment and try again.';
          break;
        case 'auth/network-request-failed':
          msg = 'Network error. Check your internet connection and try again.';
          break;
        case 'auth/invalid-api-key':
        case 'auth/api-key-not-valid':
          msg = 'Firebase configuration error. Check the VITE_FIREBASE_* values in .env';
          break;
        default:
          msg = `Login failed (${code || 'unknown error'}). Verify the admin user exists in Firebase Console → Authentication → Users.`;
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary-bg lg:flex-row">
      {/* Left — brand */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-secondary-bg px-8 py-14 lg:py-0">
        <Botanical className="-left-14 -top-14 h-72 w-72" />
        <Botanical className="-bottom-16 -right-16 h-80 w-80" />
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <img src={logo} alt="GAD Logo" className="w-52 object-contain sm:w-64" />
          <div className="mt-3">
            <h1 className="font-heading text-6xl font-bold text-brand-dark sm:text-7xl">GAD</h1>
            <p className="mt-1 text-base font-bold uppercase tracking-[0.42em] text-brand-dark sm:text-lg">
              Aesthetic Clinic
            </p>
            <p className="mt-2 font-heading text-sm italic text-brand-light sm:text-base">
              By Dr. Abdullah Asif
            </p>
          </div>
          <div className="mt-6 h-px w-16 bg-accent-gold" />
          <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-brand-light/80">
            Secure administrative access — manage treatments, deals, products and bookings.
          </p>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-14 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="card-lux w-full max-w-md p-8 sm:p-10"
        >
          <span className="section-eyebrow">Restricted Area</span>
          <h2 className="font-heading text-3xl font-semibold text-brand-dark">Admin Login</h2>
          <div className="mt-3 h-px w-14 bg-accent-gold" />

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="label-lux">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/50" />
                <input
                  className="input-lux pl-11"
                  placeholder="Enter username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label-lux">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/50" />
                <input
                  className="input-lux pl-11"
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={busy} className="btn-gold w-full">
              {busy ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : <Lock size={15} />}
              {busy ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-brand-light/60">
            Access is restricted to authorised GAD Aesthetic Clinic staff only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
