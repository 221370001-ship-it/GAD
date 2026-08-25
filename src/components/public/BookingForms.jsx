import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, Video } from 'lucide-react';
import { createAppointment } from '../../firebase/services';
import { uploadToCloudinary, validateImage } from '../../utils/cloudinaryUploader';
import { CLINIC, isValidPhone, todayISO } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../common/Spinner';
import Modal from '../common/Modal';

const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Not sure'];

const INITIAL = {
  fullName: '',
  phone: '',
  age: '',
  gender: 'Female',
  skinType: 'Not sure',
  primaryConcern: '',
  date: '',
  time: '',
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fieldV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* Premium field styles:
   - "stacked" (main form): bold label above a soft rounded input box
   - "inline" (video form): bold label directly in front of the input */
function Field({ label, required = true, error, className = '', variant = 'inline', children }) {
  if (variant === 'stacked') {
    return (
      <motion.div variants={fieldV} className={className}>
        <label className="mb-2 block text-[13px] font-bold text-brand-dark">{label}</label>
        {children}
        {error && <p className="mt-1.5 text-[11px] font-semibold text-rose-500">{error}</p>}
      </motion.div>
    );
  }
  return (
    <motion.div variants={fieldV} className={className}>
      <div className="flex items-center gap-3 rounded-2xl border border-brand-dark/10 bg-white px-4 py-3.5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card focus-within:border-accent-gold/60 focus-within:shadow-gold">
        <label className="shrink-0 text-[11px] font-extrabold uppercase tracking-[0.13em] text-brand-dark">
          {label}
          {required && <span className="ml-0.5 text-accent-gold-deep">*</span>}
        </label>
        <div className="relative min-w-0 flex-1">
          {children}
          <span className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-accent-gold to-accent-gold-deep transition-transform duration-500 ease-out peer-focus:scale-x-100" />
        </div>
      </div>
      {error && <p className="mt-1.5 pl-1 text-[11px] font-semibold text-rose-500">{error}</p>}
    </motion.div>
  );
}

const inputCls =
  'peer w-full bg-transparent text-sm font-semibold text-brand-dark placeholder-brand-light/45 outline-none';

const boxedCls =
  'w-full rounded-xl border border-brand-dark/10 bg-white px-4 py-3.5 text-sm font-semibold text-brand-dark placeholder-brand-light/45 outline-none transition-all duration-300 hover:border-brand-dark/25 focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20';

export function SuccessModal({ open, onClose, title = 'Request Received', message }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center py-6 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold-soft"
        >
          <CheckCircle2 size={40} className="text-accent-gold-deep" strokeWidth={1.6} />
        </motion.span>
        <h3 className="mt-6 font-heading text-2xl font-semibold text-brand-dark">{title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-light">{message}</p>
        <button onClick={onClose} className="btn-gold mt-8">
          Done
        </button>
      </div>
    </Modal>
  );
}

/* ================= IN-CLINIC (3 FIELDS PER ROW) + VIDEO CONSULTATION FLOW ================= */

export function BookingSection() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div>
      <PhysicalConsultationForm />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mt-10 flex flex-col gap-5 rounded-2xl border border-brand-dark/8 bg-secondary-bg/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-gold-soft text-accent-gold-deep">
            <Video size={22} strokeWidth={1.7} />
          </span>
          <div>
            <h4 className="font-heading text-xl font-semibold text-brand-dark">Video Consultation</h4>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-brand-light">
              If you are out of the city or country and wish to have a proper consultation with
              the doctor, you can book your video consultation here.
            </p>
          </div>
        </div>
        <button onClick={() => setVideoOpen(true)} className="btn-outline shrink-0">
          <Video size={15} />
          Book Video Consultation
        </button>
      </motion.div>

      <Modal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="Video Consultation"
        subtitle="Consult with Dr. Abdullah Asif from anywhere in the world."
        maxWidth="max-w-2xl"
      >
        <VideoConsultationForm />
      </Modal>
    </div>
  );
}

function PhysicalConsultationForm() {
  const [form, setForm] = useState(INITIAL);
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
    if (!form.primaryConcern.trim()) errs.primaryConcern = 'Please tell us your concern';
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
      await createAppointment({ type: 'physical', ...form, age: Number(form.age) });
      setSuccess(true);
      setForm(INITIAL);
    } catch (err) {
      console.error(err);
      toast('Unable to process your request at this moment. Please try again or contact us via WhatsApp.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <motion.form
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        onSubmit={submit}
        noValidate
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Full Name" variant="stacked" error={errors.fullName}>
            <input className={boxedCls} placeholder="Your name" value={form.fullName} onChange={set('fullName')} />
          </Field>
          <Field label="Phone Number" variant="stacked" error={errors.phone}>
            <input className={boxedCls} placeholder="03XX XXXXXXX" inputMode="tel" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Age" variant="stacked" error={errors.age}>
            <input className={boxedCls} type="number" min="10" max="90" placeholder="e.g. 25" value={form.age} onChange={set('age')} />
          </Field>
          <Field label="Gender" variant="stacked">
            <select className={boxedCls} value={form.gender} onChange={set('gender')}>
              {['Female', 'Male', 'Other'].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Skin Type" variant="stacked" required={false}>
            <select className={boxedCls} value={form.skinType} onChange={set('skinType')}>
              {SKIN_TYPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Primary Concern" variant="stacked" error={errors.primaryConcern}>
            <input className={boxedCls} placeholder="e.g. Acne, dullness" value={form.primaryConcern} onChange={set('primaryConcern')} />
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:justify-center">
          <Field label="Date" variant="stacked" className="w-full sm:w-72" error={errors.date}>
            <input className={boxedCls} type="date" min={todayISO()} value={form.date} onChange={set('date')} />
          </Field>
          <Field label="Time" variant="stacked" className="w-full sm:w-72" error={errors.time}>
            <input className={boxedCls} type="time" value={form.time} onChange={set('time')} />
          </Field>
        </div>

        <motion.div variants={fieldV} className="mt-10 flex justify-center">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.03 }}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-16 py-4 shadow-gold transition-shadow duration-300 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[340px]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-[110%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[110%]" />
            <span className="relative inline-flex items-center justify-center gap-2 font-heading text-lg font-semibold tracking-wide text-white">
              {saving ? <GoldSpinner size={18} className="border-white/30 border-t-white" /> : null}
              {saving ? 'Booking…' : 'Book Consultation'}
            </span>
          </motion.button>
        </motion.div>
      </motion.form>

      <SuccessModal
        open={success}
        onClose={() => setSuccess(false)}
        message="Your consultation request has been received. Our team will contact you shortly to confirm your appointment."
      />
    </>
  );
}

/* ================= VIDEO CONSULTATION (opens in modal) ================= */

export function VideoConsultationForm() {
  const [form, setForm] = useState({ ...INITIAL });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function pickFile(e) {
    const f = e.target.files?.[0];
    setFileError(null);
    if (!f) return setFile(null);
    const err = validateImage(f, 8);
    if (err) {
      setFileError(err);
      setFile(null);
      return;
    }
    setFile(f);
  }

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!isValidPhone(form.phone)) errs.phone = 'Enter a valid phone number';
    if (!form.age || Number(form.age) <= 0) errs.age = 'Enter a valid age';
    if (!form.primaryConcern.trim()) errs.primaryConcern = 'Please tell us your concern';
    if (!form.date) errs.date = 'Choose a date';
    else if (form.date < todayISO()) errs.date = 'Date cannot be in the past';
    if (!form.time) errs.time = 'Choose a time';
    if (!file) errs.file = 'Payment screenshot is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const upload = await uploadToCloudinary(file, { folder: 'gadaesthetics/payments' });
      await createAppointment({
        type: 'video',
        ...form,
        age: Number(form.age),
        fee: CLINIC.videoConsultFee,
        paymentScreenshotUrl: upload.secureUrl,
      });
      setSuccess(true);
      setForm({ ...INITIAL });
      setFile(null);
    } catch (err) {
      console.error(err);
      toast('Unable to process your request at this moment. Please try again or contact us via WhatsApp.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-800">
          Consultation Fee: Rs. {CLINIC.videoConsultFee.toLocaleString()}
        </span>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Field label="Full Name" error={errors.fullName}>
            <input className={inputCls} placeholder="Your Name" value={form.fullName} onChange={set('fullName')} />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <input className={inputCls} placeholder="03XXXXXXXXX" inputMode="tel" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Age" error={errors.age}>
            <input className={inputCls} type="number" min="1" max="120" placeholder="e.g. 25" value={form.age} onChange={set('age')} />
          </Field>
          <Field label="Gender">
            <select className={inputCls} value={form.gender} onChange={set('gender')}>
              {['Female', 'Male', 'Other'].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Primary Concern" error={errors.primaryConcern}>
            <input className={inputCls} placeholder="e.g. Pigmentation, scars" value={form.primaryConcern} onChange={set('primaryConcern')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" error={errors.date}>
              <input className={inputCls} type="date" min={todayISO()} value={form.date} onChange={set('date')} />
            </Field>
            <Field label="Time" error={errors.time}>
              <input className={inputCls} type="time" value={form.time} onChange={set('time')} />
            </Field>
          </div>
        </motion.div>

        <div>
          <label className="label-lux">Upload Payment Screenshot <span className="text-accent-gold-deep">*</span></label>
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors duration-300 ${
              fileError ? 'border-rose-300 bg-rose-50/40' : 'border-accent-gold/40 bg-accent-gold-soft/30 hover:border-accent-gold hover:bg-accent-gold-soft/60'
            }`}
          >
            <UploadCloud size={22} className="text-accent-gold-deep" />
            <span className="text-xs font-semibold text-brand-dark">
              {file ? file.name : 'Tap to upload your payment screenshot (JPG / PNG)'}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={pickFile} />
          </label>
          {fileError && <p className="mt-1 text-xs text-rose-500">{fileError}</p>}
          {errors.file && !fileError && <p className="mt-1 text-xs text-rose-500">{errors.file}</p>}
        </div>

        <button type="submit" disabled={saving} className="btn-gold w-full">
          {saving ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : null}
          {saving ? 'Submitting…' : 'Request Video Consultation'}
        </button>
      </form>

      <SuccessModal
        open={success}
        onClose={() => setSuccess(false)}
        title="Video Request Received"
        message="Thank you! Your video consultation request and payment screenshot have been received. Our team will verify and contact you shortly on WhatsApp."
      />
    </>
  );
}
