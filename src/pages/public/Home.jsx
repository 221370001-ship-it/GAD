import { motion } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  CalendarCheck,
  Stethoscope,
  HeartHandshake,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBranding from '../../components/public/HeroBranding';
import SectionHeading from '../../components/common/SectionHeading';
import ReviewMarquee from '../../components/public/ReviewMarquee';
import { BookingSection } from '../../components/public/BookingForms';
import { CLINIC } from '../../utils/helpers';

function Botanical({ className, flip = false }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute text-brand-dark/[0.06] ${className}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M100 180 C 100 120, 70 100, 40 90 C 70 85, 95 95, 100 130 C 105 95, 130 85, 160 90 C 130 100, 100 120, 100 180 Z" />
      <path d="M100 180 C 98 130, 90 110, 60 60 M100 180 C 102 130, 110 110, 140 60" />
      <circle cx="60" cy="60" r="6" />
      <circle cx="140" cy="60" r="6" />
      <circle cx="100" cy="40" r="8" />
      <path d="M100 32 C 96 20, 104 12, 100 4 M60 54 C 52 46, 54 34, 48 30 M140 54 C 148 46, 146 34, 152 30" />
    </svg>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const STEPS = [
  {
    n: '01',
    icon: CalendarCheck,
    title: 'Book Your Appointment',
    text: 'Schedule through our seamless online system — choose your preferred date and time.',
  },
  {
    n: '02',
    icon: Stethoscope,
    title: 'Expert Consultation',
    text: 'Comprehensive skin analysis and a personalised treatment plan tailored to your goals.',
  },
  {
    n: '03',
    icon: Sparkles,
    title: 'Receive Your Treatment',
    text: 'Experience world-class care with advanced, state-of-the-art technology.',
  },
  {
    n: '04',
    icon: HeartHandshake,
    title: 'Ongoing Care & Results',
    text: 'Detailed aftercare guidance and follow-up support to ensure lasting results.',
  },
];

export default function Home() {
  return (
    <div>
      {/* ============ HERO ============ */}
      <HeroBranding />

      {/* ============ BOOKING FUNNEL ============ */}
      <section id="booking" className="relative scroll-mt-20 bg-secondary-bg py-16 sm:py-24">
        <Botanical className="-right-14 top-8 h-64 w-64" flip />
        <div className="container-lux relative">
          <SectionHeading
            eyebrow="Reserve Your Visit"
            title="Book Your"
            highlight="Consultation"
            description="Schedule your in-clinic visit below — or book a video consultation from anywhere in the world. Our team confirms every request personally."
          />
          <motion.div {...fadeUp} className="card-lux mx-auto mt-12 max-w-6xl p-6 sm:p-10">
            <div className="mb-8 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gold-soft text-accent-gold-deep">
                <CalendarCheck size={22} strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="font-heading text-2xl font-semibold text-brand-dark">Book Your Consultation</h3>
                <p className="text-xs uppercase tracking-widest text-brand-light/70">In-Clinic · Gujranwala</p>
              </div>
            </div>
            <BookingSection />
          </motion.div>
        </div>
      </section>

      {/* ============ AI TEASER ============ */}
      <section className="py-16 sm:py-24">
        <div className="container-lux">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-dark via-[#5A463A] to-brand-deep px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20"
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, #C5A059, transparent)' }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, #C5A059, transparent)' }}
            />
            <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-accent-gold/40 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-accent-gold">
              <Sparkles size={13} />
              AI-Powered Analysis
            </span>
            <h2 className="relative z-10 mx-auto mt-6 max-w-2xl font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Discover Your Perfect <span className="italic text-accent-gold">Treatment</span>
            </h2>
            <p className="relative z-10 mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
              Not sure which treatment is right for you? Our AI-powered recommender analyzes your
              skin concerns and goals to suggest personalized treatments. Get expert recommendations
              in minutes!
            </p>
            <Link to="/ai-recommender" className="btn-gold relative z-10 mt-9 animate-pulseGlow">
              <Sparkles size={16} />
              Try AI Recommender
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ DOCTOR ============ */}
      <section className="bg-secondary-bg py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Our Medical Team" title="Meet Our" highlight="Expert" />
          <motion.div {...fadeUp} className="mx-auto mt-12 max-w-md">
            <div className="card-lux overflow-hidden text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative h-72 bg-gradient-to-br from-[#EFE6D8] via-[#F3E9D2] to-[#E7D9BF]">
                <Botanical className="left-2 top-2 h-40 w-40" />
                <Botanical className="bottom-2 right-2 h-40 w-40" flip />
                <span className="absolute inset-0 flex items-center justify-center font-heading text-8xl font-bold text-brand-dark/15">
                  DA
                </span>
              </div>
              <div className="p-7">
                <h3 className="font-heading text-2xl font-semibold text-brand-dark">{CLINIC.doctor}</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
                  {CLINIC.doctorTitle}
                </p>
                <div className="mx-auto mt-4 h-px w-12 bg-accent-gold" />
                <p className="mt-4 text-[13px] leading-relaxed text-brand-light">
                  Leading GAD Aesthetic Clinic with a vision of honest, ethical and world-class
                  aesthetic medicine for Gujranwala.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ REVIEWS MARQUEE ============ */}
      <section className="overflow-hidden py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our"
            highlight="Patients Say"
            description="Real words from real patients who trusted GAD Aesthetic Clinic with their skin and confidence."
          />
        </div>
        <div className="mt-12">
          <ReviewMarquee />
        </div>
        <p className="mt-8 text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-light/60">
          4.9 average rating on Google
        </p>
      </section>

      {/* ============ 4-STEP JOURNEY ============ */}
      <section className="bg-secondary-bg py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Your Journey With Us"
            title="How We"
            highlight="Transform"
            description="From your first consultation to achieving your dream results, we guide you every step of the way with personalised care."
          />
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep font-heading text-sm font-bold text-white shadow-gold">
                  {step.n}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[calc(50%+34px)] top-6 hidden w-[calc(100%-68px)] border-t border-dashed border-accent-gold/40 lg:block" />
                )}
                <span className="mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-accent-gold-deep shadow-card">
                  <step.icon size={24} strokeWidth={1.6} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-brand-dark">{step.title}</h3>
                <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-brand-light">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="py-16 sm:py-24">
        <div className="container-lux">
          <SectionHeading eyebrow="Visit Us" title="Our" highlight="Location" />
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
            <motion.div {...fadeUp} className="card-lux flex flex-col justify-center gap-6 p-8 lg:col-span-2">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-gold-soft text-accent-gold-deep">
                  <MapPin size={22} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-brand-dark">GAD Aesthetic Clinic</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-light">{CLINIC.address}</p>
                </div>
              </div>
              <div className="border-t border-brand-dark/8 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/70">Phone / WhatsApp</p>
                <a
                  href={`tel:${CLINIC.phoneRaw}`}
                  className="mt-1 block font-heading text-2xl font-semibold text-brand-dark transition-colors hover:text-accent-gold-deep"
                >
                  {CLINIC.phone}
                </a>
              </div>
              <div className="border-t border-brand-dark/8 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light/70">Business Hours</p>
                {CLINIC.hours.map((h) => (
                  <p key={h.days} className="mt-1 text-sm text-brand-light">
                    <span className="font-bold text-brand-dark">{h.days}:</span> {h.time}
                  </p>
                ))}
              </div>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <a
                href={CLINIC.directions}
                target="_blank"
                rel="noreferrer"
                title="Get directions to GAD Aesthetic Clinic"
                className="group relative block overflow-hidden rounded-2xl shadow-card"
              >
                <iframe
                  title="GAD Aesthetic Clinic Location"
                  src={CLINIC.mapEmbed}
                  className="pointer-events-none h-[320px] w-full border-0 sm:h-[420px]"
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
          </div>
        </div>
      </section>
    </div>
  );
}
