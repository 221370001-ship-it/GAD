import { motion } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  CalendarCheck,
  Stethoscope,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Award,
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
          <motion.div {...fadeUp} className="card-lux relative mx-auto mt-12 max-w-6xl overflow-hidden p-6 sm:p-10">
            {/* ── Background: blurred aesthetic image ── */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'url(https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794943475/gadaesthetics/consultation/z2lppybcmx9gb0izxwzw.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                filter: 'blur(6px)',
                transform: 'scale(1.08)',
              }}
            />
            {/* ── Soft warm-white overlay so form stays perfectly readable ── */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,252,248,0.82) 0%, rgba(255,245,230,0.78) 50%, rgba(255,252,248,0.82) 100%)',
              }}
            />
            {/* ── Form content ── */}
            <div className="relative z-10">
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
            </div>
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
            {/* ── Background: blurred AI face analysis image ── */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'url(https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794945198/gadaesthetics/ai/rsshmh6suhqfigf8yxru.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 35%',
                filter: 'blur(5px)',
                transform: 'scale(1.08)',
                opacity: 0.32,
              }}
            />
            {/* ── Soft dark brown gradient overlay ensuring luxury brown tone & clear typography ── */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(74,59,50,0.72) 0%, rgba(90,70,58,0.55) 50%, rgba(51,39,32,0.80) 100%)',
              }}
            />
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

      {/* ============ MEET OUR EXPERT ============ */}
      <section className="bg-secondary-bg py-10 sm:py-14">
        <div className="container-lux">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-semibold text-brand-dark sm:text-4xl">
              Meet Our <span className="italic text-accent-gold">Expert</span>
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Dr. Abdullah Asif Photo */}
            <motion.div {...fadeUp}>
              <div className="relative mx-auto max-w-sm lg:max-w-md">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-accent-gold/40 shadow-lift">
                  <img
                    src="https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794943476/gadaesthetics/doctor/kqh6w9pmts3yuvmlvaud.jpg"
                    alt="Dr. Abdullah Asif – CEO & Founder, GAD Aesthetic Clinic"
                    className="h-full w-full object-cover object-top"
                    onError={e => { e.currentTarget.src = '/doctor/dr-abdullah-asif.jpg'; }}
                  />
                </div>
                <div className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-3xl border border-accent-gold/30" />
              </div>
            </motion.div>

            {/* Right: Doctor Information & Leadership Narrative */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <span className="section-eyebrow">Clinical Leadership</span>
              <h3 className="font-heading text-3xl font-semibold text-brand-dark sm:text-4xl lg:text-5xl">
                {CLINIC.doctor}
              </h3>
              <p className="mt-2 text-sm font-semibold tracking-wider text-accent-gold sm:text-base">
                CEO & Founder
              </p>
              <p className="mt-1 text-xs tracking-wide text-brand-light/70">
                CEO & Founder of GAD Aesthetic Clinic
              </p>
              <div className="mt-4 h-px w-16 bg-accent-gold" />
              <p className="mt-5 text-[15px] leading-relaxed text-brand-light">
                Dr. Abdullah Asif leads GAD Aesthetic Clinic with a rare combination of medical
                rigour and artistic sensibility. Devoted to aesthetic medicine, he has mastered
                advanced injectable, laser, and regenerative techniques.
              </p>
              <p className="mt-3.5 text-[15px] leading-relaxed text-brand-light">
                His vision for GAD is clear: bring world-class aesthetic treatments to Gujranwala
                with honest counsel, meticulous safety standards, and results that speak quietly but
                convincingly. Patients value his straightforward advice — he will always tell you
                what you need, never more than that.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {['Evidence-Based Care', 'Advanced Technology', 'Ethical Practice'].map((tag) => (
                  <span key={tag} className="chip-gold text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link to="/contact" className="btn-gold">
                  Book a Consultation
                  <ArrowRight size={15} />
                </Link>
                <Link to="/about" className="btn-outline-gold">
                  Learn About Our Clinic
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ OUR LUXURY AMBIENCE ============ */}
      <section className="py-10 sm:py-14">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Sanctuary of Luxury"
            title="Our Luxury"
            highlight="Ambience"
            description="Designed for serene comfort, clinical discretion, and uncompromising medical hygiene."
          />

          <div className="mt-10 space-y-12 sm:space-y-14 lg:space-y-16">
            {/* ROW 1: Reception Desk (Paragraph Left, Image Right) */}
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <motion.div {...fadeUp} className="order-2 lg:order-1">
                <span className="section-eyebrow">Warm Welcome & Elegance</span>
                <h3 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                  Grand Reception Desk
                </h3>
                <div className="mt-3 h-px w-14 bg-accent-gold" />
                <p className="mt-4 text-[15px] leading-relaxed text-brand-light">
                  Your journey begins at our grand reception desk, featuring polished marble, bespoke
                  gold motifs, and ambient backlit geometry. Our dedicated concierge team ensures
                  prompt, discreet check-in and seamless coordination from the moment you arrive.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="chip-gold text-xs">Discreet Registration</span>
                  <span className="chip-gold text-xs">Dedicated Concierge</span>
                  <span className="chip-gold text-xs">Seamless Check-in</span>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="group order-1 lg:order-2"
              >
                <div className="relative overflow-hidden rounded-3xl border border-accent-gold/30 bg-primary-bg shadow-lift">
                  <div className="aspect-[16/11] w-full overflow-hidden bg-secondary-bg">
                    <img
                      src="https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794744204/gadaesthetics/ambience/mrxtwbnls8o7ldst5scm.jpg"
                      alt="GAD Aesthetic Clinic Grand Reception Desk"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/ambience/reception-desk.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-brand-deep/80 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-accent-gold backdrop-blur-md">
                    Grand Reception Desk
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ROW 2: Executive Waiting Lounge (Image Left, Paragraph Right) */}
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <motion.div {...fadeUp} className="group">
                <div className="relative overflow-hidden rounded-3xl border border-accent-gold/30 bg-primary-bg shadow-lift">
                  <div className="aspect-[16/11] w-full overflow-hidden bg-secondary-bg">
                    <img
                      src="https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794744203/gadaesthetics/ambience/hrtcqatx5dbepacsjvk2.jpg"
                      alt="GAD Aesthetic Clinic Executive Waiting Lounge"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/ambience/waiting-lounge.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-brand-deep/80 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-accent-gold backdrop-blur-md">
                    Executive Waiting Lounge
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
              >
                <span className="section-eyebrow">Tranquil Comfort</span>
                <h3 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                  Executive Waiting Lounge
                </h3>
                <div className="mt-3 h-px w-14 bg-accent-gold" />
                <p className="mt-4 text-[15px] leading-relaxed text-brand-light">
                  Relax in our air-purified, climate-controlled lounge appointed with plush cream leather
                  couches and modern lattice ceilings. Designed to provide a serene sanctuary where you
                  can unwind in complete comfort before your session.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="chip-gold text-xs">Bespoke Leather Seating</span>
                  <span className="chip-gold text-xs">Air-Purified Sanctuary</span>
                  <span className="chip-gold text-xs">Serene Atmosphere</span>
                </div>
              </motion.div>
            </div>

            {/* ROW 3: Consultation Room (Paragraph Left, Image Right) */}
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <motion.div {...fadeUp} className="order-2 lg:order-1">
                <span className="section-eyebrow">Personalized Diagnostics & Care</span>
                <h3 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                  Private Doctor’s Consultation Suite
                </h3>
                <div className="mt-3 h-px w-14 bg-accent-gold" />
                <p className="mt-4 text-[15px] leading-relaxed text-brand-light">
                  A confidential space dedicated to thorough, one-on-one medical evaluation.
                  Equipped with our advanced AI 3D Face Analyzer to assess skin layers and establish
                  evidence-based, personalized treatment roadmaps.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="chip-gold text-xs">AI 3D Digital Skin Mapping</span>
                  <span className="chip-gold text-xs">Confidential Dialogue</span>
                  <span className="chip-gold text-xs">Ethical Guidance</span>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="group order-1 lg:order-2"
              >
                <div className="relative overflow-hidden rounded-3xl border border-accent-gold/30 bg-primary-bg shadow-lift">
                  <div className="aspect-[16/11] w-full overflow-hidden bg-secondary-bg">
                    <img
                      src="https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794744205/gadaesthetics/ambience/upxtdjfsdfopkz4asrhb.jpg"
                      alt="GAD Aesthetic Clinic Doctor Consultation Room"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/ambience/consultation-room.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-brand-deep/80 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-accent-gold backdrop-blur-md">
                    Doctor Consultation Suite
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ROW 4: Clinical Procedure & Surgery Suites (Image Left, Paragraph Right) */}
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
              <motion.div {...fadeUp} className="group">
                <div className="relative overflow-hidden rounded-3xl border border-accent-gold/30 bg-primary-bg shadow-lift">
                  <div className="aspect-[16/11] w-full overflow-hidden bg-secondary-bg">
                    <img
                      src="https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794744205/gadaesthetics/ambience/kr6m4or849i2hzh1whnl.jpg"
                      alt="GAD Aesthetic Clinic Clinical Procedure and Treatment Suite"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/ambience/procedure-room.jpg';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-brand-deep/80 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-accent-gold backdrop-blur-md">
                    Procedure & Surgery Suite
                  </div>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
              >
                <span className="section-eyebrow">Sterile Excellence & Advanced Tech</span>
                <h3 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                  Clinical Procedure & Surgery Suites
                </h3>
                <div className="mt-3 h-px w-14 bg-accent-gold" />
                <p className="mt-4 text-[15px] leading-relaxed text-brand-light">
                  Engineered to hospital-grade sterilization protocols with ergonomic treatment beds,
                  shadowless medical lighting, and single-use sterile consumables. Housing our
                  Morpheus8, Diode Laser, and Advanced HydraFacial workstations for ultimate safety.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="chip-gold text-xs">Hospital-Grade Sterilization</span>
                  <span className="chip-gold text-xs">Ergonomic Medical Beds</span>
                  <span className="chip-gold text-xs">Zero-Compromise Safety</span>
                </div>
              </motion.div>
            </div>
          </div>
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
      <section className="relative overflow-hidden bg-secondary-bg py-16 sm:py-24">
        {/* ── Background: blurred transformation visual ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/frbrngr7/image/upload/q_auto:best,f_auto/v1794945808/gadaesthetics/transform/cw9zixoe5gnegh6fiig1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 28%',
            filter: 'blur(6px)',
            transform: 'scale(1.08)',
          }}
        />
        {/* ── Soft luxury warm-cream overlay so steps and text stay perfectly readable ── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,252,248,0.85) 0%, rgba(246,241,232,0.80) 50%, rgba(255,252,248,0.87) 100%)',
          }}
        />
        <div className="container-lux relative z-10">
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
