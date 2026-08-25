import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import { SuccessModal } from './BookingForms';
import { createAppointment } from '../../firebase/services';
import { formatPrice, isValidPhone, todayISO } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../common/Spinner';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const fieldV = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function MField({ label, required = true, error, className = '', children }) {
  return (
    <motion.div variants={fieldV} className={className}>
      <label className="mb-2 block text-[13px] font-bold text-brand-dark">
        {label}
        {required && <span className="ml-0.5 text-accent-gold-deep">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{error}</p>}
    </motion.div>
  );
}

const boxedCls =
  'w-full rounded-xl border border-brand-dark/10 bg-white px-4 py-3.5 text-sm font-semibold text-brand-dark placeholder-brand-light/45 outline-none transition-all duration-300 hover:border-brand-dark/25 focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20';

/**
 * Treatment booking modal — same design language as the consultation form.
 * Saves a `treatment-booking` document into the `appointments` collection.
 */
export default function BookingModal({ open, onClose, booking = null, prefill = {} }) {
  const [form, setForm] = useState({
    fullName: prefill.fullName || '',
    phone: prefill.phone || '',
    gender: prefill.gender || 'Female',
    age: prefill.age || '',
    skinType: 'Not sure',
    primaryConcern: '',
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!isValidPhone(form.phone)) errs.phone = 'Enter a valid phone number';
    if (!form.age || Number(form.age) < 10 || Number(form.age) > 90)
      errs.age = 'Age must be between 10 and 90';
    if (!form.date) errs.date = 'Choose a date';
    else if (form.date < todayISO()) errs.date = 'Date cannot be in the past';
    if (!form.time) errs.time = 'Choose a time';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await createAppointment({
        type: 'treatment-booking',
        treatmentName: booking?.name || booking?.title || 'Selected treatment',
        treatmentId: booking?.id || null,
        categorySlug: booking?.categorySlug || null,
        ...form,
        age: Number(form.age),
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      toast('Unable to process your booking at this moment. Please try again or contact us via WhatsApp.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function closeAll() {
    setSuccess(false);
    onClose();
  }

  const name = booking?.name || booking?.title || '';

  return (
    <>
      <Modal
        open={open && !success}
        onClose={onClose}
        title={name ? 'Book Your Session' : 'Book Your Session'}
        subtitle={name ? `${name}${booking?.discountedPrice != null ? ` — ${formatPrice(booking.discountedPrice)}` : ''}` : 'Reserve your slot at GAD Aesthetic Clinic'}
        maxWidth="max-w-3xl"
      >
        <motion.form
          variants={stagger}
          initial="hidden"
          animate="show"
          onSubmit={submit}
          noValidate
          className="space-y-5"
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <MField label="Full Name" error={errors.fullName}>
              <input className={boxedCls} placeholder="Your name" value={form.fullName} onChange={set('fullName')} />
            </MField>
            <MField label="Phone Number" error={errors.phone}>
              <input className={boxedCls} placeholder="03XX XXXXXXX" inputMode="tel" value={form.phone} onChange={set('phone')} />
            </MField>
            <MField label="Age" error={errors.age}>
              <input className={boxedCls} type="number" min="10" max="90" placeholder="e.g. 25" value={form.age} onChange={set('age')} />
            </MField>
            <MField label="Gender">
              <select className={boxedCls} value={form.gender} onChange={set('gender')}>
                {['Female', 'Male', 'Other'].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </MField>
            <MField label="Skin Type" required={false}>
              <select className={boxedCls} value={form.skinType} onChange={set('skinType')}>
                {['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Not sure'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </MField>
            <MField label="Primary Concern" required={false}>
              <input className={boxedCls} placeholder="e.g. Acne, dullness" value={form.primaryConcern} onChange={set('primaryConcern')} />
            </MField>
            <MField label="Date" error={errors.date}>
              <input className={boxedCls} type="date" min={todayISO()} value={form.date} onChange={set('date')} />
            </MField>
            <MField label="Time" error={errors.time}>
              <input className={boxedCls} type="time" value={form.time} onChange={set('time')} />
            </MField>
          </div>

          <motion.div variants={fieldV} className="flex justify-center pt-2">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.03 }}
              whileTap={{ scale: saving ? 1 : 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-14 py-3.5 shadow-gold transition-shadow duration-300 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[300px]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[110%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[110%]" />
              <span className="relative inline-flex items-center justify-center gap-2 font-heading text-lg font-semibold tracking-wide text-white">
                {saving ? <GoldSpinner size={18} className="border-white/30 border-t-white" /> : null}
                {saving ? 'Booking…' : 'Book Treatment'}
              </span>
            </motion.button>
          </motion.div>
        </motion.form>
      </Modal>

      <SuccessModal
        open={success}
        onClose={closeAll}
        message={`Your request for ${name || 'the treatment'} has been received. Our team will contact you shortly to confirm your slot.`}
      />
    </>
  );
}
