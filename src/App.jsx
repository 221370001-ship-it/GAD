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
