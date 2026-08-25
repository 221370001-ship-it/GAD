import { Package, ExternalLink } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { updateDocument } from '../../firebase/services';
import { formatDate, formatPrice, STATUS_STYLES, cn } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function AdminOrders() {
  const { data, loading } = useCollection('orders');
  const { toast } = useToast();

  async function setStatus(order, status) {
    try {
      await updateDocument('orders', order.id, { status });
      toast(`Order marked as ${status}.`, 'success');
    } catch (err) {
      console.error(err);
      toast('Could not update order.', 'error');
    }
  }

  if (loading) return <p className="py-16 text-center text-sm text-brand-light">Loading orders…</p>;

  if (data.length === 0) {
    return (
      <div className="card-lux flex flex-col items-center py-20 text-center">
        <Package size={40} className="text-brand-light/40" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-brand-light">
          No product orders yet. Orders placed from the public Products page will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {data.map((o) => (
        <div key={o.id} className="card-lux p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-brand-dark">{o.productName}</h3>
                <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest', STATUS_STYLES[o.status] || 'bg-secondary-bg text-brand-light')}>
                  {o.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-brand-light">
                {o.fullName} · {o.phone}
              </p>
            </div>
            <div className="text-right">
              <p className="font-heading text-xl font-bold text-brand-dark">{formatPrice(o.price)}</p>
              <p className="text-[11px] text-brand-light/60">{formatDate(o.createdAt)}</p>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-secondary-bg/60 px-4 py-3 text-sm text-brand-light">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Address: </span>
            {o.address}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-dark/8 pt-4">
            {['new', 'contacted', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(o, s)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all',
                  o.status === s ? 'bg-brand-dark text-primary-bg' : 'bg-secondary-bg text-brand-light hover:text-brand-dark'
                )}
              >
                {s}
              </button>
            ))}
            {o.phone && (
              <a
                href={`https://wa.me/${String(o.phone).replace(/[^0-9]/g, '').replace(/^0/, '92')}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-accent-gold-deep underline underline-offset-2"
              >
                <ExternalLink size={12} />
                WhatsApp Customer
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
