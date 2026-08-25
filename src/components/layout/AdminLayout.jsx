import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  FolderTree,
  Sparkles,
  Tag,
  ShoppingBag,
  Package,
  MessageSquare,
  ReceiptText,
  Calculator,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoldSpinner } from '../common/Spinner';
import logo from '../../assets/logo.svg';
import { cn } from '../../utils/helpers';

const NAV = [
  { to: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/treatments', label: 'Treatments', icon: Sparkles },
  { to: '/admin/deals', label: 'Deals', icon: Tag },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/invoices', label: 'Invoices', icon: ReceiptText },
  { to: '/soft', label: 'Billing /soft', icon: Calculator },
];

export default function AdminLayout({ title, children }) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setSidebarOpen(false), [title]);

  async function handleLogout() {
    await logout();
    navigate('/admin');
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-bg">
        <GoldSpinner size={44} />
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-brand-dark/8 px-6 py-5">
        <div className="rounded-xl bg-primary-bg px-2.5 py-1.5 shadow-soft">
          <img src={logo} alt="GAD Logo" className="h-9 w-auto object-contain" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-brand-dark">Admin Panel</p>
          <p className="text-[11px] uppercase tracking-widest text-brand-light/70">GAD Aesthetic</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-accent-gold-soft text-accent-gold-deep shadow-soft'
                  : 'text-brand-light hover:bg-secondary-bg hover:text-brand-dark'
              )
            }
          >
            <item.icon size={17} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-brand-dark/8 p-4">
        <div className="mb-3 rounded-xl bg-secondary-bg px-4 py-3">
          <p className="truncate text-xs font-bold text-brand-dark">{user?.email}</p>
          <p className="text-[11px] uppercase tracking-widest text-brand-light/70">Signed in</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-4 py-2.5 text-sm font-bold text-primary-bg transition-all duration-300 hover:bg-brand-deep"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-bg/60">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-brand-dark/8 bg-primary-bg lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-brand-deep/50 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-primary-bg shadow-lift lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-brand-dark/8 bg-primary-bg/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <h1 className="font-heading text-xl font-semibold text-brand-dark">{title}</h1>
            </div>
            <Link
              to="/"
              className="hidden rounded-full border border-brand-dark/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-brand-dark transition-all duration-300 hover:border-accent-gold hover:text-accent-gold-deep sm:inline-flex"
            >
              View Website
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
