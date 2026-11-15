import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  HeartHandshake,
  Gem,
  Users,
  Cpu,
  Send,
  BadgeCheck,
  Zap,
  Wand2,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Star,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import { SuccessModal } from '../../components/public/BookingForms';
import { createMessage, createReview } from '../../firebase/services';
import { CLINIC, isValidPhone } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../../components/common/Spinner';

const CLINIC_HERO_IMAGE = 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794741324/gadaesthetics/clinic/qonu2jrtll4xj5lobnem.jpg';

const ADVANCED_EQUIPMENT = [
  {
    title: 'AI Face Analyzer',
    tag: 'Digital Diagnostics',
    image: 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794743239/gadaesthetics/equipment/g02wxeouofeljbsydw06.jpg',
    fallback: '/equipment/ai-face-analyzer.jpg',
    text: 'Advanced 3D facial imaging and digital dome scanner with multi-spectral analysis. Maps deep-layer pigmentation, hydration levels, pores, UV sun damage, and skin age to guide precision-tailored treatment plans.',
  },
  {
    title: 'Morpheus8',
    tag: 'Subdermal Remodeling',
    image: 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794743240/gadaesthetics/equipment/tr2dgri1trx2croisxtg.jpg',
    fallback: '/equipment/morpheus8.jpg',
    text: 'Premier fractional radiofrequency (RF) microneedling workstation. Penetrates deep into subdermal tissue to stimulate natural collagen, tighten lax skin, refine texture, and contour facial contours.',
  },
  {
    title: 'Laser Hair Removal',
    tag: 'Triple-Wavelength Platform',
    image: 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794743241/gadaesthetics/equipment/yclmlacosgnrayajsdxl.jpg',
    fallback: '/equipment/laser-hair-removal.jpg',
    text: 'Gold-standard Diode, SHR OPT, and Nd:YAG laser workstation equipped with integrated sapphire contact cooling for virtually pain-free, rapid, and permanent hair reduction across all skin tones and body areas.',
  },
  {
    title: 'Advanced HydraFacial Machine',
    tag: 'Vortex Infusion Station',
    image: 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794743242/gadaesthetics/equipment/jdfdreycyvipc054wivu.jpg',
    fallback: '/equipment/hydrafacial-machine.jpg',
    text: 'Multi-step clinical hydra-dermabrasion platform combining painless vortex suction, chemical exfoliation, and concentrated nutrient serum infusion for immediate glow, deep decongestion, and refined skin clarity.',
  },
  {
    title: 'Simple HydraFacial Machine',
    tag: '10-in-1 Skin Station',
    image: 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794743243/gadaesthetics/equipment/isvkjgkn2vorzsk5qhrt.jpg',
    fallback: '/equipment/advanced-hydrafacial-machine.jpg',
    text: 'High-performance multi-functional aesthetic station integrating hydro-peeling, ultrasonic skin scrubbing, bipolar RF skin lifting, cold cryo hammer, and pressurized high-purity oxygen spray for intensive rejuvenation.',
  },
  {
    title: 'Hollywood Peel Machine',
    tag: 'Q-Switched Laser',
    image: 'https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794743242/gadaesthetics/equipment/wgbk5p0wbaspv7fx7rlf.jpg',
    fallback: '/equipment/hollywood-peel-machine.jpg',
    text: 'High-precision Q-switched Nd:YAG laser platform powering our signature Carbon Hollywood Laser Peel, pigmentation correction, melasma toning, and tattoo clearance with maximum clinical safety and zero downtime.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const PHILOSOPHY = [
  {
    icon: HeartHandshake,
    title: 'Patient-First Philosophy',
    text: 'Realistic expectations matter. Aesthetic results require patience and consistency — not overnight miracles. We prioritise honest, ethical consultations from day one, recommending only what truly serves you.',
  },
  {
    icon: Gem,
    title: 'Excellence in Every Detail',
    text: 'From sterilisation protocols to the comfort of our interiors, an uncompromising commitment to safety, hygiene and a premium client experience defines every visit.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    text: 'Highly qualified professionals dedicated to evidence-based aesthetic care — continuously trained in the latest international techniques and standards.',
  },
  {
    icon: Cpu,
    title: 'Technology & Innovation',
    text: 'We invest in advanced, state-of-the-art aesthetic equipment so every treatment is safer, more precise and more effective.',
  },
];

function ContactForm() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: 'Skin',
    message: '',
  });
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
    if (!form.message.trim()) errs.message = 'Please write a short message.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await createMessage(form);
      setSuccess(true);
      setForm({ fullName: '', phone: '', email: '', service: 'Skin', message: '' });
    } catch (err) {
      console.error(err);
      toast('Unable to send your message right now. Please try WhatsApp or call us directly.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="label-lux">Full Name <span className="text-accent-gold-deep">*</span></label>
            <input className="input-line" placeholder="Your name" value={form.fullName} onChange={set('fullName')} />
            {errors.fullName && <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>}
          </div>
          <div>
            <label className="label-lux">Phone Number <span className="text-accent-gold-deep">*</span></label>
            <input className="input-line" placeholder="03XX XXXXXXX" inputMode="tel" value={form.phone} onChange={set('phone')} />
            {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
          </div>
          <div>
            <label className="label-lux">Email Address</label>
            <input className="input-line" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="label-lux">Service Interest</label>
            <select className="input-line" value={form.service} onChange={set('service')}>
              {['Skin', 'Hair', 'Laser', 'Other'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label-lux">Message <span className="text-accent-gold-deep">*</span></label>
          <textarea
            className="input-line min-h-[110px] resize-y"
            placeholder="Tell us about your skin goals or ask us anything…"
            value={form.message}
            onChange={set('message')}
          />
          {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
        </div>
        <button type="submit" disabled={saving} className="btn-gold">
          {saving ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : <Send size={15} />}
          {saving ? 'Sending…' : 'Send Message'}
        </button>
      </form>
      <SuccessModal
        open={success}
        onClose={() => setSuccess(false)}
        message="Your message has been received. Our team will get back to you within 24 hours, Insha'Allah."
      />
    </>
  );
}

/* ================= SHARE YOUR EXPERIENCE ================= */

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

function ShareExperience() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const active = hover || rating;

  async function submit(e) {
    e.preventDefault();
    if (!rating) {
      setError('Please select a star rating.');
      return;
    }
    if (message.trim().length < 4) {
      setError('Please write a few words about your experience.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await createReview({ rating, message: message.trim() });
      setDone(true);
    } catch (err) {
      console.error(err);
      toast('Could not submit your review right now. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Testimonials"
          title="Share Your"
          highlight="Experience"
          description="Loved your visit to GAD? Rate your experience and tell us how we did — your words help others discover confident, cared-for skin."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-4xl bg-gradient-to-br from-brand-dark via-[#5A463A] to-brand-deep px-6 py-12 text-center shadow-lift sm:px-12"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, #C5A059, transparent)' }}
          />
          <Quote size={44} className="relative z-10 mx-auto text-accent-gold/60" strokeWidth={1.2} />

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative z-10 py-8"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold/20"
                >
                  <CheckCircle2 size={40} className="text-accent-gold" strokeWidth={1.6} />
                </motion.span>
                <h3 className="mt-6 font-heading text-2xl font-semibold text-white">Thank You!</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                  Your review means the world to us. It has been shared with the GAD team and helps
                  others discover confident, cared-for skin.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                onSubmit={submit}
                noValidate
                className="relative z-10 pt-6"
              >
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                  How was your experience?
                </p>

                <div className="mt-6 flex items-center justify-center gap-3" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.85 }}
                      animate={star <= active ? { scale: [1, 1.28, 1] } : { scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: star <= active ? (star - 1) * 0.06 : 0,
                        ease: 'easeOut',
                      }}
                      className="focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={42}
                        className={
                          star <= active
                            ? 'fill-accent-gold text-accent-gold drop-shadow-[0_0_12px_rgba(197,160,89,0.65)]'
                            : 'text-white/25'
                        }
                      />
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {active > 0 && (
                    <motion.p
                      key={active}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 font-heading text-lg italic text-accent-gold"
                    >
                      {RATING_LABELS[active]}
                    </motion.p>
                  )}
                </AnimatePresence>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Tell us about your experience at GAD Aesthetic Clinic — the treatment, the care, the results…"
                  className="mt-7 w-full resize-y rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-sm leading-relaxed text-white placeholder-white/40 outline-none backdrop-blur-sm transition-all duration-300 focus:border-accent-gold/60 focus:ring-2 focus:ring-accent-gold/20"
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-xl bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-200"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold relative mt-7 w-full sm:w-auto sm:min-w-[240px]"
                >
                  {saving ? (
                    <GoldSpinner size={16} className="border-white/30 border-t-white" />
                  ) : (
                    <Send size={15} />
                  )}
                  {saving ? 'Sharing…' : 'Share Review'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="pb-24 pt-[85px] sm:pt-[105px]">
      {/* ============ STORY & CLINIC SHOWCASE ============ */}
      <section className="relative overflow-hidden bg-secondary-bg pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(243,233,210,1), transparent)' }}
        />
        <div className="container-lux relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: GAD Story & Narrative */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-7"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <h2 className="font-heading leading-none text-brand-dark">
                  <span className="block text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                    GAD
                  </span>
                  <span className="mt-2 block font-serif text-3xl font-medium italic text-accent-gold-deep sm:text-4xl lg:text-5xl">
                    Story
                  </span>
                </h2>
                <div className="mt-4 h-0.5 w-24 bg-accent-gold" />
              </div>

              <div className="space-y-4 text-[15px] leading-[1.85] text-brand-light sm:text-base">
                <p>
                  GAD Aesthetic Clinic began with a simple conviction — that the people of Gujranwala
                  deserve aesthetic care of international standard, without travelling to Lahore or
                  abroad. Founded by <span className="font-bold text-brand-dark">Dr. Abdullah Asif</span>,
                  the clinic has grown from a modest practice into the region&apos;s trusted destination for
                  medical-grade skin, hair and laser treatments.
                </p>
                <p>
                  Over the years, we have invested relentlessly in advanced technology and continuous
                  training. Every protocol we follow is evidence-based, every device is
                  medical-grade, and every treatment plan is tailored to the individual — because no
                  two skins, and no two stories, are alike.
                </p>
                <p>
                  What truly sets GAD apart is our philosophy of honesty. We believe in realistic
                  expectations, transparent pricing and treatments that respect the natural character
                  of your beauty. Our goal is never to change how you look — it is to help you look
                  like the most refreshed, confident version of yourself.
                </p>
                <p>
                  Today, patients from Gujranwala and beyond trust us for signature HydraFacials,
                  Hollywood peels, laser hair removal, PRP therapy and complete transformation
                  journeys — all delivered with warmth, discretion and clinical excellence.
                </p>
              </div>
            </motion.div>

            {/* Right Column: Tailored Portrait Image Frame with Smooth Hover Zoom */}
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <div className="group relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                {/* Subtle Luxury Outer Glow */}
                <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-accent-gold/40 via-accent-gold/15 to-accent-gold/40 opacity-70 blur-lg transition-all duration-700 group-hover:opacity-100" />

                {/* Snug Frame Matching Exact Image Shape - Zero Letterboxing or Extra Background */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-accent-gold/40 bg-white/50 p-1.5 shadow-2xl backdrop-blur-sm sm:p-2">
                  <div className="overflow-hidden rounded-[14px] sm:rounded-[20px] bg-secondary-bg">
                    <img
                      src={CLINIC_HERO_IMAGE}
                      onError={(e) => { e.currentTarget.src = '/clinic-front.jpg'; }}
                      alt="GAD Aesthetic Clinic - By Dr. Abdullah Asif"
                      className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ ADVANCED EQUIPMENT ============ */}
      <section className="py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Technology & Machinery"
            title="Advanced"
            highlight="Equipment"
            description="Every machine at GAD Aesthetic Clinic is advanced, modern and professional-grade — selected for safety, precision and results, and used across all of our treatments."
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ADVANCED_EQUIPMENT.map((eq, i) => (
              <motion.div
                key={eq.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: 'easeOut' }}
                className="card-lux group p-6 sm:p-7 flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-brand-dark/10 hover:border-accent-gold/50 bg-white"
              >
                {/* Machine Image Frame with Smooth Hover Zoom */}
                <div className="relative overflow-hidden rounded-2xl bg-secondary-bg mb-5 aspect-[4/3] flex items-center justify-center border border-brand-dark/5 shadow-inner">
                  <img
                    src={eq.image}
                    onError={(e) => { e.currentTarget.src = eq.fallback; }}
                    alt={eq.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-black/65 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/15">
                    {eq.tag}
                  </div>
                </div>

                {/* Machine Name */}
                <h3 className="font-heading text-2xl font-bold text-brand-dark group-hover:text-accent-gold-deep transition-colors duration-200">
                  {eq.title}
                </h3>

                {/* Machine Description */}
                <p className="mt-3 text-[14.5px] leading-relaxed text-brand-light flex-1">
                  {eq.text}
                </p>

                {/* Bottom luxury accent */}
                <div className="mt-5 pt-4 border-t border-brand-dark/8 flex items-center justify-between text-xs font-semibold text-accent-gold-deep">
                  <span>Medical-Grade Clinical Platform</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PHILOSOPHY ============ */}
      <section className="py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="What We Stand For" title="Our" highlight="Philosophy" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PHILOSOPHY.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.1, ease: 'easeOut' }}
                className="card-lux group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold-soft text-accent-gold-deep transition-transform duration-300 group-hover:scale-105">
                  <card.icon size={26} strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-brand-dark">{card.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-brand-light">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MANAGEMENT ============ */}
      <section className="bg-secondary-bg py-16 sm:py-24">
        <div className="container-lux grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <div className="relative mx-auto max-w-md">
              <div className="relative h-[420px] overflow-hidden rounded-4xl bg-gradient-to-br from-[#EFE6D8] via-[#F3E9D2] to-[#E7D9BF] shadow-lift">
                <span className="absolute inset-0 flex items-center justify-center font-heading text-9xl font-bold text-brand-dark/10">
                  DA
                </span>
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-brand-deep/50 to-transparent py-6">
                  <span className="rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-dark">
                    CEO & Founder
                  </span>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-4xl border border-accent-gold/30" />
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <span className="section-eyebrow">Our Management</span>
            <h2 className="font-heading text-3xl font-semibold text-brand-dark sm:text-4xl">
              {CLINIC.doctor}
            </h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-light">
              {CLINIC.doctorTitle}
            </p>
            <div className="mt-5 h-px w-16 bg-accent-gold" />
            <p className="mt-6 text-[15px] leading-[1.9] text-brand-light">
              Dr. Abdullah Asif leads GAD Aesthetic Clinic with a rare combination of medical
              rigour and artistic sensibility. With an MBBS and FCPS qualification, he has devoted
              his career to aesthetic medicine — mastering advanced injectable, laser and
              regenerative techniques.
            </p>
            <p className="mt-4 text-[15px] leading-[1.9] text-brand-light">
              His vision for GAD is clear: bring world-class aesthetic treatments to Gujranwala
              with honest counsel, meticulous safety standards and results that speak quietly but
              convincingly. Patients value his straightforward advice — he will always tell you
              what you need, never more than that.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {['Evidence-Based Care', 'Advanced Technology', 'Ethical Practice'].map((tag) => (
                <span key={tag} className="chip-gold">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ SHARE YOUR EXPERIENCE ============ */}
      <ShareExperience />

      {/* ============ CONTACT ============ */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Get In Touch" title="Contact" highlight="Information" />
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div {...fadeUp} className="space-y-6">
              <div className="card-lux space-y-5 p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold-soft text-accent-gold-deep">
                    <MapPin size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/70">Address</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-brand-dark">{CLINIC.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold-soft text-accent-gold-deep">
                    <Phone size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/70">Phone / WhatsApp</p>
                    <a
                      href={`tel:${CLINIC.phoneRaw}`}
                      className="mt-1 block text-sm font-semibold text-brand-dark transition-colors hover:text-accent-gold-deep"
                    >
                      {CLINIC.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold-soft text-accent-gold-deep">
                    <Mail size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/70">Email</p>
                    <a
                      href={`mailto:${CLINIC.email}`}
                      className="mt-1 block text-sm font-semibold text-brand-dark transition-colors hover:text-accent-gold-deep"
                    >
                      {CLINIC.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold-soft text-accent-gold-deep">
                    <Clock size={20} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/70">Business Hours</p>
                    {CLINIC.hours.map((h) => (
                      <p key={h.days} className="mt-1 text-sm text-brand-light">
                        <span className="font-semibold text-brand-dark">{h.days}:</span> {h.time}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href={CLINIC.directions}
                target="_blank"
                rel="noreferrer"
                title="Get directions to GAD Aesthetic Clinic"
                className="group relative block overflow-hidden rounded-2xl shadow-card"
              >
                <iframe
                  title="GAD Aesthetic Clinic Location Map"
                  src={CLINIC.mapEmbed}
                  className="pointer-events-none h-[280px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <span className="absolute inset-0" />
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-brand-dark/90 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-accent-gold shadow-lift backdrop-blur-sm transition-all duration-300 group-hover:bg-brand-dark group-hover:shadow-gold">
                  <MapPin size={13} />
                  Get Directions
                </span>
              </a>
            </motion.div>

            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="card-lux p-8">
              <h3 className="font-heading text-2xl font-semibold text-brand-dark">
                Send a Message
              </h3>
              <div className="mt-3 h-px w-14 bg-accent-gold" />
              <div className="mt-7">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
