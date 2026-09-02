import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
  Banknote,
  Smartphone,
} from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { createInvoice } from '../../firebase/services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../../components/common/Spinner';
import { formatPrice, cn, CLINIC } from '../../utils/helpers';
import { LOGO_BASE64 } from '../../assets/logoBase64';

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

/* ─────────────────────────────────────────────────────────────────────────────
   Receipt HTML builder — optimised for SpeedX SP-210 (80mm / 72mm printable)
   ───────────────────────────────────────────────────────────────────────────── */

function buildReceiptHTML(invoiceNum, cust, items, sub, disc, final, paymentMethod) {
  const dateStr = new Date().toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:4px 0;font-size:13px;word-wrap:break-word;max-width:140px;">${item.name}</td>
          <td style="padding:4px 0;font-size:13px;text-align:center;">x${item.quantity}</td>
          <td style="padding:4px 0;font-size:13px;text-align:right;font-weight:bold;">Rs ${(item.priceAtBilling * item.quantity).toLocaleString('en-PK')}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt - ${invoiceNum}</title>
  <style>
    /* ── SpeedX SP-210 — 80mm thermal paper, ~72mm printable area ── */
    @page {
      size: 72mm auto;
      margin: 0mm;
    }
    @media print {
      html, body {
        width: 72mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 72mm;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Arial', sans-serif;
      font-size: 13px;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .receipt {
      width: 72mm;
      padding: 4mm 3mm 6mm 3mm;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .logo {
      display: block;
      width: 52mm;
      max-width: 100%;
      margin: 0 auto 3mm auto;
      filter: grayscale(100%) contrast(1.5);
    }
    .clinic-name {
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 1mm;
    }
    .clinic-info {
      font-size: 10px;
      color: #333;
      line-height: 1.5;
      margin-bottom: 2mm;
    }
    .divider {
      border: none;
      border-bottom: 1px dashed #000;
      margin: 3mm 0;
    }
    .divider-bold {
      border: none;
      border-bottom: 2px solid #000;
      margin: 3mm 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 1px 0;
      font-size: 13px;
    }
    .row .label { color: #333; }
    .row .value { font-weight: bold; text-align: right; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2mm 0;
    }
    th {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 0 4px 0;
      border-bottom: 1px solid #000;
      text-align: left;
      color: #333;
    }
    th.r { text-align: right; }
    th.c { text-align: center; }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 17px;
      font-weight: bold;
      padding: 2mm 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      margin-top: 4mm;
      line-height: 1.6;
    }
    .footer-credit {
      text-align: center;
      font-size: 9px;
      color: #888;
      margin-top: 5mm;
      padding-bottom: 3mm;
    }
    .payment-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.5px;
      padding: 1px 8px;
      border: 1px solid #000;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <!-- Logo -->
    <img src="${LOGO_BASE64}" class="logo" alt="GAD" />

    <!-- Clinic Info -->
    <div class="center clinic-info">
      ${CLINIC.address}<br>
      Ph: ${CLINIC.phone}
    </div>

    <hr class="divider-bold">

    <!-- Invoice Details -->
    <div class="row"><span class="label">Invoice:</span><span class="value">${invoiceNum}</span></div>
    <div class="row"><span class="label">Date:</span><span class="value">${dateStr} ${timeStr}</span></div>

    <hr class="divider">

    <!-- Customer Info -->
    <div class="row"><span class="label">Customer:</span><span class="value">${cust.name}</span></div>
    <div class="row"><span class="label">Phone:</span><span class="value">${cust.phone}</span></div>
    <div class="row"><span class="label">Payment:</span><span class="value"><span class="payment-badge">${paymentMethod.toUpperCase()}</span></span></div>

    <hr class="divider">

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="c">Qty</th>
          <th class="r">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <hr class="divider">

    <!-- Totals -->
    <div class="row"><span class="label">Subtotal:</span><span class="value">Rs ${sub.toLocaleString('en-PK')}</span></div>
    ${disc > 0 ? `<div class="row"><span class="label">Discount:</span><span class="value">- Rs ${disc.toLocaleString('en-PK')}</span></div>` : ''}

    <hr class="divider-bold">

    <div class="total-row">
      <span>TOTAL:</span>
      <span>Rs ${final.toLocaleString('en-PK')}</span>
    </div>

    <hr class="divider-bold">

    <!-- Footer -->
    <div class="footer">
      Thank you for visiting!<br>
      <span style="font-size:11px;">${CLINIC.website}</span>
    </div>

    <div class="footer-credit">Software by Abdullah</div>
  </div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   printViaIframe — reliable hidden-iframe print for thermal printers
   • No popup blocker issues (iframe is same-origin, inline)
   • No image race conditions (logo is base64)
   • afterprint cleanup ensures exactly one print per call
   ───────────────────────────────────────────────────────────────────────────── */

function printViaIframe(html) {
  return new Promise((resolve, reject) => {
    // Remove any leftover print iframe from a previous call
    const old = document.getElementById('__receipt_print_frame');
    if (old) old.remove();

    const iframe = document.createElement('iframe');
    iframe.id = '__receipt_print_frame';
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;visibility:hidden;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Safety timeout — if print dialog is never shown, clean up after 15s
    const safetyTimer = setTimeout(() => {
      cleanup();
      reject(new Error('Print timeout'));
    }, 15000);

    function cleanup() {
      clearTimeout(safetyTimer);
      // Small delay before removing iframe to let print spooler grab the content
      setTimeout(() => {
        try { iframe.remove(); } catch (_) { /* already removed */ }
      }, 1000);
    }

    // Wait for the iframe content (including base64 image) to fully render
    iframe.contentWindow.addEventListener('load', () => {
      try {
        // Listen for afterprint to know when the dialog closes
        iframe.contentWindow.addEventListener('afterprint', () => {
          cleanup();
          resolve();
        }, { once: true });

        // Trigger print
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        cleanup();
        reject(err);
      }
    });

    // Fallback: if 'load' never fires (edge case), try after a delay
    setTimeout(() => {
      try {
        if (iframe.parentNode) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      } catch (_) { /* already handled */ }
    }, 2000);
  });
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
  const [paymentMethod, setPaymentMethod] = useState('cash');
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
      .map((x) => ({ key: `t-${x.id}`, type: 'treatment', id: x.id, name: x.name, subtitle: x.category || 'Treatment', price: Number(x.discountedPrice ?? x.originalPrice ?? 0), allowQty: true }));
    const d = deals
      .filter((x) => (x.title || '').toLowerCase().includes(debounced))
      .slice(0, 4)
      .map((x) => ({ key: `d-${x.id}`, type: 'deal', id: x.id, name: x.title, subtitle: 'Package Deal', price: Number(x.discountedPrice ?? x.originalPrice ?? 0), allowQty: true }));
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

  const generateBill = useCallback(async () => {
    if (cart.length === 0) return toast('Add at least one item to the bill.', 'error');
    if (!customer.name.trim()) return toast('Please enter the customer name.', 'error');
    if (!customer.phone.trim()) return toast('Please enter the customer phone number.', 'error');

    setSaving(true);
    try {
      const { invoiceNumber } = await createInvoice(
        {
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          paymentMethod,
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

      // Build receipt HTML and print via hidden iframe
      const receiptHTML = buildReceiptHTML(
        invoiceNumber,
        customer,
        cart,
        subtotal,
        discountTotal,
        finalTotal,
        paymentMethod
      );

      try {
        await printViaIframe(receiptHTML);
        toast(`${invoiceNumber} saved & sent to printer.`, 'success');
      } catch (printErr) {
        console.error('Print error:', printErr);
        toast('Invoice saved but printing may have failed. Please check the printer.', 'error');
      }

      setCart([]);
      setCustomer({ name: '', phone: '' });
      setPaymentMethod('cash');
      setManualDiscount(0);
      setSearch('');
    } catch (err) {
      console.error(err);
      toast('Could not save the bill. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  }, [cart, customer, paymentMethod, subtotal, discountTotal, finalTotal, user, toast]);

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

          {/* Payment Method */}
          <div className="mt-4 flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-light">Payment Method</span>
            <div className="flex rounded-xl bg-secondary-bg/50 p-1 border border-brand-dark/5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all duration-300',
                  paymentMethod === 'cash'
                    ? 'bg-white text-brand-dark shadow-sm ring-1 ring-brand-dark/5'
                    : 'text-brand-light/60 hover:text-brand-dark hover:bg-white/50'
                )}
              >
                <Banknote size={16} className={paymentMethod === 'cash' ? 'text-emerald-600' : 'text-brand-light/50'} />
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all duration-300',
                  paymentMethod === 'online'
                    ? 'bg-white text-brand-dark shadow-sm ring-1 ring-brand-dark/5'
                    : 'text-brand-light/60 hover:text-brand-dark hover:bg-white/50'
                )}
              >
                <Smartphone size={16} className={paymentMethod === 'online' ? 'text-blue-600' : 'text-brand-light/50'} />
                Online Transaction
              </button>
            </div>
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
