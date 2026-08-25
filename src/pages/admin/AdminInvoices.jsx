import { ReceiptText } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { formatDate, formatPrice } from '../../utils/helpers';

export default function AdminInvoices() {
  const { data, loading } = useCollection('invoices');

  if (loading) return <p className="py-16 text-center text-sm text-brand-light">Loading invoices…</p>;

  if (data.length === 0) {
    return (
      <div className="card-lux flex flex-col items-center py-20 text-center">
        <ReceiptText size={40} className="text-brand-light/40" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-brand-light">
          No invoices yet. Generate your first bill from the Billing workspace (/soft).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((inv) => (
        <div key={inv.id} className="card-lux p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-dark/8 pb-4">
            <div>
              <p className="font-heading text-xl font-bold text-brand-dark">{inv.invoiceNumber}</p>
              <p className="mt-1 text-sm text-brand-light">
                {inv.customerName} · {inv.customerPhone}
              </p>
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl font-bold text-brand-dark">{formatPrice(inv.finalTotal)}</p>
              <p className="text-[11px] text-brand-light/60">
                {formatDate(inv.createdAt)} · by {inv.billedBy}
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Price at Billing</th>
                  <th className="pb-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {(inv.items || []).map((item, i) => (
                  <tr key={i} className="border-t border-brand-dark/5">
                    <td className="py-2 font-semibold text-brand-dark">{item.name}</td>
                    <td className="py-2 capitalize text-brand-light">{item.type}</td>
                    <td className="py-2 text-center text-brand-light">{item.quantity}</td>
                    <td className="py-2 text-right text-brand-light">{formatPrice(item.priceAtBilling)}</td>
                    <td className="py-2 text-right font-semibold text-brand-dark">
                      {formatPrice(item.priceAtBilling * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-6 border-t border-brand-dark/8 pt-4 text-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Subtotal</p>
              <p className="font-semibold text-brand-dark">{formatPrice(inv.subtotal)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Discount</p>
              <p className="font-semibold text-emerald-700">− {formatPrice(inv.discountTotal || 0)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Total</p>
              <p className="font-heading text-lg font-bold text-brand-dark">{formatPrice(inv.finalTotal)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
