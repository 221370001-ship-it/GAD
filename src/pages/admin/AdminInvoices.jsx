import { ReceiptText, Trash2, Lock, ShieldAlert, X, Banknote, Smartphone } from 'lucide-react';
import { useState } from 'react';
import useCollection from '../../hooks/useCollection';
import { deleteDocument, updateDocument } from '../../firebase/services';
import { formatDate, formatPrice } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function AdminInvoices() {
  const { data, loading } = useCollection('invoices');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ customerName: '', customerPhone: '' });
  const { toast } = useToast();

  const handleSuperAdmin = () => {
    const pwd = window.prompt('Enter Super Admin Password:');
    if (pwd === 'superaligad') {
      setIsSuperAdmin(true);
      toast('Super Admin access granted.', 'success');
    } else if (pwd !== null) {
      toast('Incorrect password.', 'error');
    }
  };

  const deactivateSuperAdmin = () => {
    setIsSuperAdmin(false);
    setEditingId(null);
    toast('Super Admin mode deactivated.', 'success');
  };

  const handleDelete = async (id, invoiceNumber) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`)) return;
    try {
      await deleteDocument('invoices', id);
      toast('Invoice deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to delete invoice.', 'error');
    }
  };

  const startEdit = (inv) => {
    setEditingId(inv.id);
    setEditForm({ customerName: inv.customerName, customerPhone: inv.customerPhone });
  };

  const saveEdit = async (id) => {
    try {
      await updateDocument('invoices', id, editForm);
      setEditingId(null);
      toast('Invoice updated successfully.', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to update invoice.', 'error');
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-brand-dark">Invoice Directory</h2>
        {!isSuperAdmin ? (
          <button type="button" onClick={handleSuperAdmin} className="relative z-10 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-600 transition-colors hover:bg-rose-100 sm:gap-2 sm:px-4 sm:text-xs">
            <Lock size={14} /> <span className="hidden sm:inline">Super Admin</span><span className="sm:hidden">Admin</span>
          </button>
        ) : (
          <button type="button" onClick={deactivateSuperAdmin} className="relative z-10 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-rose-600 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-soft transition-colors hover:bg-rose-700 sm:gap-2 sm:px-4 sm:text-xs">
            <ShieldAlert size={14} /> <span className="hidden sm:inline">Super Admin Active</span><span className="sm:hidden">Active</span> <X size={14} className="ml-0.5 opacity-70 sm:ml-1" />
          </button>
        )}
      </div>

      <div className="space-y-4">
      {data.map((inv) => (
        <div key={inv.id} className="card-lux p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-dark/8 pb-4">
            {editingId === inv.id ? (
              <div className="flex flex-col gap-2 min-w-[240px]">
                <p className="font-heading text-xl font-bold text-brand-dark">{inv.invoiceNumber}</p>
                <input className="input-lux py-1.5 px-3 text-sm" value={editForm.customerName} onChange={e => setEditForm({...editForm, customerName: e.target.value})} placeholder="Customer Name" />
                <input className="input-lux py-1.5 px-3 text-sm" value={editForm.customerPhone} onChange={e => setEditForm({...editForm, customerPhone: e.target.value})} placeholder="Phone" />
                <div className="flex gap-2 mt-1">
                  <button onClick={() => saveEdit(inv.id)} className="rounded bg-emerald-100 text-emerald-700 px-3 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-emerald-200">Save</button>
                  <button onClick={() => setEditingId(null)} className="rounded bg-brand-light/10 text-brand-dark px-3 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-brand-light/20">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-heading text-xl font-bold text-brand-dark">{inv.invoiceNumber}</p>
                <p className="mt-1 text-sm text-brand-light">
                  {inv.customerName} · {inv.customerPhone}
                </p>
                {/* Payment Method Badge */}
                <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                  inv.paymentMethod === 'online'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : inv.paymentMethod === 'cash'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-50 text-gray-500 border border-gray-200'
                }`}>
                  {inv.paymentMethod === 'online' ? <Smartphone size={11} /> : inv.paymentMethod === 'cash' ? <Banknote size={11} /> : null}
                  {inv.paymentMethod ? inv.paymentMethod : 'N/A'}
                </span>
              </div>
            )}
            <div className="text-right">
              <p className="font-heading text-2xl font-bold text-brand-dark">{formatPrice(inv.finalTotal)}</p>
              <p className="text-[11px] text-brand-light/60">
                {formatDate(inv.createdAt)} · by {inv.billedBy}
              </p>
              {isSuperAdmin && (
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => startEdit(inv)}
                    className="flex items-center gap-1.5 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                    className="flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-600 transition-colors hover:bg-rose-100"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              )}
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Payment</p>
              <p className={`font-semibold capitalize ${inv.paymentMethod === 'online' ? 'text-blue-700' : inv.paymentMethod === 'cash' ? 'text-emerald-700' : 'text-gray-500'}`}>
                {inv.paymentMethod || 'N/A'}
              </p>
            </div>
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
    </div>
  );
}
