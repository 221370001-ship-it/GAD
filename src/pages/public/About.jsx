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
    <div className="pb-24 pt-[120px] sm:pt-[150px]">
      {/* ============ STORY ============ */}
      <section className="relative overflow-hidden bg-secondary-bg py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(243,233,210,1), transparent)' }}
        />
        <div className="container-lux relative">
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="font-heading leading-none text-brand-dark">
              <span className="block text-[4.75rem] font-bold tracking-tight sm:text-[6.5rem] lg:text-[8rem]">
                GAD
              </span>
              <span className="mt-3 block font-medium italic text-accent-gold-deep text-3xl sm:text-4xl lg:text-[3.4rem]">
                Story
              </span>
            </h2>
            <div className="mt-7 h-px w-28 bg-accent-gold" />
          </motion.div>
          <motion.div {...fadeUp} className="mx-auto mt-6 max-w-3xl text-center">
            <span className="chip-gold mx-auto">
              <BadgeCheck size={13} />
              10+ Years of Excellence
            </span>
            <div className="mt-8 space-y-5 text-[15px] leading-[1.9] text-brand-light">
              <p>
                GAD Aesthetic Clinic began with a simple conviction — that the people of Gujranwala
                deserve aesthetic care of international standard, without travelling to Lahore or
                abroad. Founded by <span className="font-bold text-brand-dark">Dr. Abdullah Asif</span>,
                the clinic has grown from a modest practice into the region's trusted destination for
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
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Laser Hair Removal',
                text: 'Advanced diode and IPL platforms for safe, precise and comfortable permanent hair reduction across face and body.',
              },
              {
                icon: Wand2,
                title: 'Advanced Laser Treatments',
                text: 'Modern laser systems powering Hollywood peels, pigmentation correction, tattoo removal and full skin resurfacing.',
              },
              {
                icon: Cpu,
                title: 'Morpheus8',
                text: 'State-of-the-art radio-frequency micro-needling platform that remodels skin and contour at a deeper, fractional level.',
              },
              {
                icon: ScanFace,
                title: 'Face Analysis',
                text: 'Digital face and skin analysis that maps your skin’s condition in detail for precise, data-driven treatment planning.',
              },
              {
                icon: Sparkles,
                title: 'Skin Treatments',
                text: 'Medical-grade devices behind our HydraFacials, boosters, peels and regenerative skin therapies.',
              },
              {
                icon: ShieldCheck,
                title: 'Every Procedure, Professional-Grade',
                text: 'Whatever the treatment, the machinery behind it at GAD is always advanced, modern and professional-level.',
              },
            ].map((eq, i) => (
              <motion.div
                key={eq.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: 'easeOut' }}
                className="card-lux group p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold-soft text-accent-gold-deep transition-transform duration-300 group-hover:scale-105">
                  <eq.icon size={26} strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-brand-dark">{eq.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-brand-light">{eq.text}</p>
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
