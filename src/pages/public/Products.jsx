import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import SectionHeading from '../../components/common/SectionHeading';
import { ProductCard } from '../../components/public/Cards';
import Modal from '../../components/common/Modal';
import { SuccessModal } from '../../components/public/BookingForms';
import { SkeletonGrid } from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { createOrder } from '../../firebase/services';
import { isValidPhone } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../../components/common/Spinner';
import { formatPrice } from '../../utils/helpers';

function BuyNowModal({ open, onClose, product }) {
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!isValidPhone(form.phone)) errs.phone = 'Please enter a valid phone number.';
    if (form.address.trim().length < 10) errs.address = 'Please enter a complete delivery address.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await createOrder({
        productId: product.id,
        productName: product.name,
        price: Number(product.discountedPrice || product.originalPrice),
        ...form,
      });
      setSuccess(true);
      setForm({ fullName: '', phone: '', address: '' });
    } catch (err) {
      console.error(err);
      toast('Unable to submit your order at this moment. Please try again or contact us via WhatsApp.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        open={open && !success}
        onClose={onClose}
        title={product ? `Order ${product.name}` : 'Place Your Order'}
        subtitle="Cash on delivery available across Gujranwala. Our team will call to confirm."
      >
        <form onSubmit={submit} className="space-y-4">
          {product && (
            <div className="flex items-center justify-between rounded-xl bg-accent-gold-soft/50 px-4 py-3">
              <span className="text-sm font-bold text-brand-dark">{product.name}</span>
              <span className="font-heading text-lg font-bold text-brand-dark">
                {formatPrice(product.discountedPrice || product.originalPrice)}
              </span>
            </div>
          )}
          <div>
            <label className="label-lux">Full Name <span className="text-accent-gold-deep">*</span></label>
            <input className="input-lux" placeholder="Your name" value={form.fullName} onChange={set('fullName')} />
            {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>}
          </div>
          <div>
            <label className="label-lux">Phone Number <span className="text-accent-gold-deep">*</span></label>
            <input className="input-lux" placeholder="03XX XXXXXXX" inputMode="tel" value={form.phone} onChange={set('phone')} />
            {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
          </div>
          <div>
            <label className="label-lux">Delivery Address <span className="text-accent-gold-deep">*</span></label>
            <textarea
              className="input-lux min-h-[90px] resize-y"
              placeholder="House, street, area, city"
              value={form.address}
              onChange={set('address')}
            />
            {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
          </div>
          <button type="submit" disabled={saving} className="btn-gold w-full">
            {saving ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : null}
            {saving ? 'Submitting…' : 'Submit Order Request'}
          </button>
        </form>
      </Modal>
      <SuccessModal
        open={success}
        onClose={() => {
          setSuccess(false);
          onClose();
        }}
        title="Order Received"
        message="Your order request has been received. Our team will call you shortly to confirm delivery details."
      />
    </>
  );
}

export default function Products() {
  const { data: products, loading } = useCollection('products');
  const [buying, setBuying] = useState(null);

  return (
    <div className="pb-24 pt-[120px] sm:pt-[150px]">
      <section className="relative overflow-hidden bg-secondary-bg py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(243,233,210,1), transparent)' }}
        />
        <div className="container-lux relative">
          <SectionHeading
            eyebrow="Clinical Skincare"
            title="Curated Skincare"
            highlight="Collection"
            description="Medical-grade products hand-picked by Dr. Abdullah to extend and protect your in-clinic results at home."
          />
        </div>
      </section>

      <div className="container-lux mt-12">
        {loading && <SkeletonGrid count={6} />}

        {!loading && products.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title="Collection restocking soon"
            message="Our skincare collection is being updated. Please check back shortly or visit the clinic to explore products in person."
          />
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onBuy={setBuying} />
            ))}
          </div>
        )}
      </div>

      <BuyNowModal open={!!buying} onClose={() => setBuying(null)} product={buying} />
    </div>
  );
}
