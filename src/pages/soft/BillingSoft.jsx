import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ReceiptText,
  CheckCircle2,
  Sparkles,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { createInvoice } from '../../firebase/services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../../components/common/Spinner';
import { formatPrice, cn } from '../../utils/helpers';
import logo from '../../assets/footer-logo.png';

function SearchRow({ icon: Icon, title, subtitle, price, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-brand-dark/8 bg-white px-4 py-3 text-left transition-all duration-200 hover:border-accent-gold/50 hover:shadow-soft"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold-soft text-accent-gold-deep">
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-brand-dark">{title}</span>
        <span className="block truncate text-xs text-brand-light">{subtitle}</span>
      </span>
      <span className="shrink-0 font-heading text-sm font-bold text-brand-dark">{formatPrice(price)}</span>
      <Plus size={15} className="shrink-0 text-accent-gold-deep" />
    </button>
  );
}

export default function BillingSoft() {
  const { data: treatments } = useCollection('treatments');
  const { data: deals } = useCollection('deals');
  const { data: products } = useCollection('products');
  const { user } = useAuth();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [manualDiscount, setManualDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(search.trim().toLowerCase()), 250);
    return () => clearTimeout(timerRef.current);
  }, [search]);

  const results = useMemo(() => {
    if (!debounced) return [];
    const t = treatments
      .filter((x) => `${x.name} ${x.category}`.toLowerCase().includes(debounced))
      .slice(0, 6)
      .map((x) => ({ key: `t-${x.id}`, type: 'treatment', id: x.id, name: x.name, subtitle: x.category || 'Treatment', price: Number(x.discountedPrice ?? x.originalPrice ?? 0), allowQty: false }));
    const d = deals
      .filter((x) => (x.title || '').toLowerCase().includes(debounced))
      .slice(0, 4)
      .map((x) => ({ key: `d-${x.id}`, type: 'deal', id: x.id, name: x.title, subtitle: 'Package Deal', price: Number(x.discountedPrice ?? x.originalPrice ?? 0), allowQty: false }));
    const p = products
      .filter((x) => (x.name || '').toLowerCase().includes(debounced))
      .slice(0, 6)
      .map((x) => ({ key: `p-${x.id}`, type: 'product', id: x.id, name: x.name, subtitle: 'Retail Product', price: Number(x.discountedPrice ?? x.originalPrice ?? 0), allowQty: true }));
    return [...t, ...d, ...p];
  }, [debounced, treatments, deals, products]);

  function addToCart(item) {
    setCart((c) => {
      const existing = c.find((i) => i.key === item.key);
      if (existing) {
        if (!item.allowQty) return c;
        return c.map((i) => (i.key === item.key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...c, { ...item, quantity: 1, priceAtBilling: item.price }];
    });
  }

  function changeQty(key, delta) {
    setCart((c) =>
      c
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(key) {
    setCart((c) => c.filter((i) => i.key !== key));
  }

  const subtotal = cart.reduce((sum, i) => sum + i.priceAtBilling * i.quantity, 0);
  const discountTotal = Math.max(0, Math.min(Number(manualDiscount) || 0, subtotal));
  const finalTotal = subtotal - discountTotal;

  async function generateBill() {
    if (cart.length === 0) return toast('Add at least one item to the bill.', 'error');
    if (!customer.name.trim()) return toast('Please enter the customer name.', 'error');
    if (!customer.phone.trim()) return toast('Please enter the customer phone number.', 'error');

    setSaving(true);
    try {
      const { invoiceNumber } = await createInvoice(
        {
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          items: cart.map((i) => ({
            type: i.type,
            refId: i.id,
            name: i.name,
            priceAtBilling: i.priceAtBilling,
            quantity: i.quantity,
          })),
          subtotal,
          discountTotal,
          finalTotal,
        },
        user?.email || 'staff'
      );
      setLastInvoice({ invoiceNumber, finalTotal });
      
      // Print the receipt
      printReceipt(invoiceNumber, customer, cart, subtotal, discountTotal, finalTotal);

      setCart([]);
      setCustomer({ name: '', phone: '' });
      setManualDiscount(0);
      setSearch('');
    } catch (err) {
      console.error(err);
      toast('Could not save the bill. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function printReceipt(invoiceNum, cust, items, sub, disc, final) {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return toast('Pop-up blocked. Could not print.', 'error');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${invoiceNum}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; margin: 0; padding: 10px; width: 280px; color: #000; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .logo { width: 140px; margin: 0 auto 10px; display: block; filter: grayscale(100%); }
            .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
            .flex { display: flex; justify-content: space-between; }
            .mt-2 { margin-top: 8px; }
            .mb-2 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 4px 0; font-size: 11px; }
            th.right, td.right { text-align: right; }
          </style>
        </head>
        <body>
          <img src="${logo}" class="logo" alt="GAD Logo" onload="window.print(); window.close();" onerror="window.print(); window.close();" />
          
          <div class="text-center mb-2 font-bold" style="font-size: 14px;">GAD AESTHETIC CLINIC</div>
          <div class="text-center mb-2">By Dr. Abdullah</div>
          
          <div class="divider"></div>
          <div class="flex"><span>Invoice:</span> <span>${invoiceNum}</span></div>
          <div class="flex"><span>Date:</span> <span>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span></div>
          <div class="divider"></div>
          <div class="flex"><span>Name:</span> <span>${cust.name}</span></div>
          <div class="flex"><span>Phone:</span> <span>${cust.phone}</span></div>
          <div class="divider"></div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th class="right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => 
                '<tr>' +
                  '<td style="max-width: 130px; word-wrap: break-word;">' + item.name + '</td>' +
                  '<td>x' + item.quantity + '</td>' +
                  '<td class="right">' + (item.priceAtBilling * item.quantity) + '</td>' +
                '</tr>'
              ).join('')}
            </tbody>
          </table>
          
          <div class="divider"></div>
          <div class="flex"><span>Subtotal:</span> <span>Rs ${sub}</span></div>
          <div class="flex"><span>Discount:</span> <span>Rs ${disc}</span></div>
          <div class="divider font-bold" style="border-width: 2px;"></div>
          <div class="flex font-bold" style="font-size: 15px;"><span>Total:</span> <span>Rs ${final}</span></div>
          <div class="divider font-bold" style="border-width: 2px;"></div>
          
          <div class="text-center mt-2">Thank you for visiting!</div>
          <div class="text-center mt-2" style="font-size: 10px; margin-top: 20px;">Software by Software Alliance</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      {/* LEFT — search & select */}
      <div className="xl:col-span-3">
        <div className="card-lux p-5 sm:p-6">
          <h2 className="font-heading text-lg font-semibold text-brand-dark">Find Treatments, Deals & Products</h2>
          <div className="relative mt-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/50" />
            <input
              className="input-lux py-3.5 pl-11"
              placeholder="Type to search — e.g. hydra, laser, vitamin c…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {!debounced && (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-brand-light/70">
                <Search size={26} className="text-brand-light/30" strokeWidth={1.5} />
                Start typing to search the live catalogue.
              </div>
            )}
            {debounced && results.length === 0 && (
              <div className="py-12 text-center text-sm text-brand-light/70">No matches found.</div>
            )}
            {results.map((r) => (
              <SearchRow
                key={r.key}
                icon={r.type === 'deal' ? Tag : r.type === 'product' ? ShoppingBag : Sparkles}
                title={r.name}
                subtitle={`${r.subtitle}${r.allowQty ? ' · qty adjustable' : ''}`}
                price={r.price}
                onClick={() => {
                  addToCart(r);
                  toast(`${r.name} added to bill.`, 'success', 1800);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — current bill */}
      <div className="xl:col-span-2">
        <div className="card-lux p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-brand-dark">Current Bill</h2>
            <span className="chip-gold">{cart.length} items</span>
          </div>

          {/* Customer */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="input-lux"
              placeholder="Customer name *"
              value={customer.name}
              onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
            />
            <input
              className="input-lux"
              placeholder="Phone number *"
              inputMode="tel"
              value={customer.phone}
              onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
            />
          </div>

          {/* Cart */}
          <div className="mt-5 max-h-[320px] space-y-2 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {cart.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-secondary-bg/60 px-4 py-8 text-center text-sm text-brand-light/70"
                >
                  Cart is empty — search and add items.
                </motion.p>
              )}
              {cart.map((item) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="flex items-center gap-3 rounded-xl border border-brand-dark/8 bg-white px-3.5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-brand-dark">{item.name}</p>
                    <p className="text-xs capitalize text-brand-light">
                      {item.type} · {formatPrice(item.priceAtBilling)}
                    </p>
                  </div>
                  {item.allowQty ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeQty(item.key, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-bg text-brand-dark transition-colors hover:bg-accent-gold-soft"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-brand-dark">{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item.key, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-bg text-brand-dark transition-colors hover:bg-accent-gold-soft"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-light/60">x1</span>
                  )}
                  <span className="w-20 shrink-0 text-right font-heading text-sm font-bold text-brand-dark">
                    {formatPrice(item.priceAtBilling * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-rose-400 transition-colors hover:text-rose-600"
                    aria-label="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="mt-5 space-y-2.5 border-t border-brand-dark/8 pt-4 text-sm">
            <div className="flex items-center justify-between text-brand-light">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-dark">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-brand-light">
              <span className="shrink-0">Discount (Rs)</span>
              <input
                type="number"
                min="0"
                className="input-lux w-32 py-1.5 text-right"
                value={manualDiscount || ''}
                onChange={(e) => setManualDiscount(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="flex items-center justify-between border-t border-brand-dark/8 pt-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-light">Final Total</span>
              <span className="font-heading text-2xl font-bold text-brand-dark">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <button onClick={generateBill} disabled={saving} className="btn-gold mt-5 w-full">
            {saving ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : <ReceiptText size={15} />}
            {saving ? 'Saving…' : 'Save and Print Bill'}
          </button>
        </div>

        {/* Last invoice confirmation */}
        <AnimatePresence>
          {lastInvoice && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            >
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
              <p className="text-sm text-emerald-800">
                <span className="font-bold">{lastInvoice.invoiceNumber}</span> saved — {formatPrice(lastInvoice.finalTotal)}
              </p>
              <button onClick={() => setLastInvoice(null)} className="ml-auto text-xs font-bold uppercase tracking-widest text-emerald-700">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
