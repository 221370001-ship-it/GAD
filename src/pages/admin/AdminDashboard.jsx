import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Sparkles,
  Tag,
  ShoppingBag,
  MessageSquare,
  ReceiptText,
  Database,
  TrendingUp,
  Package,
} from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { seedStarterData } from '../../firebase/services';
import { seedCategories, seedTreatments, seedDeals, seedProducts } from '../../utils/seedData';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../../components/common/Spinner';
import { formatDate } from '../../utils/helpers';

const SEED = {
  categories: seedCategories.map(({ id, ...rest }) => ({ ...rest })),
  treatments: seedTreatments.map(({ id, ...rest }) => ({ ...rest })),
  deals: seedDeals.map(({ id, ...rest }) => ({ ...rest })),
  products: seedProducts.map(({ id, ...rest }) => ({ ...rest })),
};

function StatCard({ icon: Icon, label, value, accent, delay = 0, to }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="card-lux flex items-center gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
        <Icon size={22} strokeWidth={1.7} />
      </span>
      <div>
        <p className="font-heading text-3xl font-bold text-brand-dark">{value}</p>
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/80">{label}</p>
      </div>
    </motion.div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const { data: appointments } = useCollection('appointments');
  const { data: treatments } = useCollection('treatments');
  const { data: deals } = useCollection('deals');
  const { data: products } = useCollection('products');
  const { data: messages } = useCollection('messages');
  const { data: invoices } = useCollection('invoices');
  const { data: orders } = useCollection('orders');
  const { toast } = useToast();
  const [seeding, setSeeding] = useState(false);

  const pending = appointments.filter((a) => a.status === 'pending').length;
  const unread = messages.filter((m) => !m.read).length;
  const revenue = invoices.reduce((sum, inv) => sum + Number(inv.finalTotal || 0), 0);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await seedStarterData(SEED);
      const total = res.categories + res.treatments + res.deals + res.products;
      toast(
        `Catalogue synced — ${res.categories} categories and ${res.treatments} treatments written from the official price list${res.deals || res.products ? `, plus ${res.deals} deals and ${res.products} products` : ''}.`,
        'success',
        6000
      );
    } catch (err) {
      console.error(err);
      toast('Seeding failed. Check your connection and Firestore rules.', 'error');
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarCheck}
          label="Pending Requests"
          value={pending}
          accent="bg-amber-100 text-amber-700"
          delay={0}
          to="/admin/appointments"
        />
        <StatCard
          icon={Sparkles}
          label="Treatments Live"
          value={treatments.length}
          accent="bg-accent-gold-soft text-accent-gold-deep"
          delay={0.05}
          to="/admin/treatments"
        />
        <StatCard
          icon={Tag}
          label="Active Deals"
          value={deals.length}
          accent="bg-emerald-100 text-emerald-700"
          delay={0.1}
          to="/admin/deals"
        />
        <StatCard
          icon={ShoppingBag}
          label="Products"
          value={products.length}
          accent="bg-sky-100 text-sky-700"
          delay={0.15}
          to="/admin/products"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={MessageSquare}
          label="Unread Messages"
          value={unread}
          accent="bg-rose-100 text-rose-600"
          delay={0.2}
          to="/admin/messages"
        />
        <StatCard
          icon={ReceiptText}
          label="Invoices Issued"
          value={invoices.length}
          accent="bg-violet-100 text-violet-700"
          delay={0.25}
          to="/admin/invoices"
        />
        <StatCard
          icon={TrendingUp}
          label="Billed Revenue (PKR)"
          value={revenue.toLocaleString()}
          accent="bg-emerald-100 text-emerald-700"
          delay={0.3}
        />
      </div>

      {/* Seed panel */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card-lux p-6 sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-gold-soft text-accent-gold-deep">
              <Database size={22} strokeWidth={1.7} />
            </span>
            <div>
              <h3 className="font-heading text-xl font-semibold text-brand-dark">Official Price List</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-brand-light">
                One click syncs the catalogue with the official GAD price list:{' '}
                <code className="rounded bg-secondary-bg px-1.5 py-0.5 text-xs">categories</code> and{' '}
                <code className="rounded bg-secondary-bg px-1.5 py-0.5 text-xs">treatments</code> are
                replaced with the latest structure (17 categories · 74 treatments), while{' '}
                <code className="rounded bg-secondary-bg px-1.5 py-0.5 text-xs">deals</code> and{' '}
                <code className="rounded bg-secondary-bg px-1.5 py-0.5 text-xs">products</code> only
                seed when empty.
              </p>
            </div>
          </div>
          <button onClick={handleSeed} disabled={seeding} className="btn-gold shrink-0">
            {seeding ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : <Database size={15} />}
            {seeding ? 'Syncing…' : 'Sync Price List'}
          </button>
        </div>
      </motion.div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="card-lux p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-brand-dark">Latest Consultation Requests</h3>
            <Link to="/admin/appointments" className="text-xs font-bold uppercase tracking-widest text-accent-gold-deep">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {appointments.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl bg-secondary-bg/60 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-brand-dark">{a.fullName}</p>
                  <p className="text-xs text-brand-light">
                    {a.type === 'video' ? 'Video Consultation' : a.type === 'treatment-booking' ? a.treatmentName || 'Treatment Booking' : 'In-Clinic'} ·{' '}
                    {formatDate(a.createdAt)}
                  </p>
                </div>
                <span className="chip-gold">{a.status}</span>
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="py-8 text-center text-sm text-brand-light/70">No requests yet.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card-lux p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-brand-dark">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-accent-gold-deep">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl bg-secondary-bg/60 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-brand-dark">{o.productName}</p>
                  <p className="text-xs text-brand-light">
                    {o.fullName} · {o.phone}
                  </p>
                </div>
                <span className="chip-gold">{o.status}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-secondary-bg/60 px-4 py-5 text-sm text-brand-light">
                <Package size={16} className="text-accent-gold-deep" />
                Product orders will appear here when customers buy from the Products page.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
