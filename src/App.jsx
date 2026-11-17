import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/public/Home';
import Treatments from './pages/public/Treatments';
import CategoryPage from './pages/public/CategoryPage';
import Deals from './pages/public/Deals';
import Products from './pages/public/Products';
import About from './pages/public/About';
import AiRecommender from './pages/public/AiRecommender';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTreatments from './pages/admin/AdminTreatments';
import AdminDeals from './pages/admin/AdminDeals';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMessages from './pages/admin/AdminMessages';
import AdminInvoices from './pages/admin/AdminInvoices';
import BillingSoft from './pages/soft/BillingSoft';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function PublicShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-primary-bg">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* ===== WhatsApp Floating Button ===== */}
      <a
        href="https://wa.me/923286005559"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.13)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)';
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width: '30px', height: '30px', fill: '#fff' }} xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<PublicShell><Home /></PublicShell>} />
          <Route path="/treatments" element={<PublicShell><Treatments /></PublicShell>} />
          <Route path="/treatments/:slug" element={<PublicShell><CategoryPage /></PublicShell>} />
          <Route path="/deals" element={<PublicShell><Deals /></PublicShell>} />
          <Route path="/products" element={<PublicShell><Products /></PublicShell>} />
          <Route path="/about" element={<PublicShell><About /></PublicShell>} />
          <Route path="/ai-recommender" element={<PublicShell><AiRecommender /></PublicShell>} />

          {/* Auth */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout title="Dashboard Overview">
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AdminLayout title="Consultation Requests">
                  <AdminAppointments />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminLayout title="Manage Categories">
                  <AdminCategories />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/treatments"
            element={
              <ProtectedRoute>
                <AdminLayout title="Manage Treatments">
                  <AdminTreatments />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/deals"
            element={
              <ProtectedRoute>
                <AdminLayout title="Manage Deals">
                  <AdminDeals />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminLayout title="Manage Products">
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout title="Product Orders">
                  <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminLayout title="Contact Messages">
                  <AdminMessages />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute>
                <AdminLayout title="Invoices">
                  <AdminInvoices />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Billing workspace */}
          <Route
            path="/soft"
            element={
              <ProtectedRoute>
                <AdminLayout title="Billing Workspace">
                  <BillingSoft />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<PublicShell><Home /></PublicShell>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
