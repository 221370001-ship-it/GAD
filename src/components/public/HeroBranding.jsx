import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import lockup from '../../assets/footer-logo.png';

const EASE = [0.22, 1, 0.36, 1];

export default function HeroBranding() {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#F7F7EE]">
      {/* Ambient depth — slow-drifting light orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-44 -top-44 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(197,160,89,0.12), transparent)' }}
        animate={{ x: [0, 26, 0], y: [0, 22, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-52 top-1/4 h-[540px] w-[540px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.95), transparent)' }}
        animate={{ x: [0, -20, 0], y: [0, 26, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(closest-side, rgba(197,160,89,0.07), transparent)' }}
        animate={{ x: [0, 18, 0], y: [0, -18, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Twinkling gold sparkles around the lockup */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[14%] top-[34%] hidden text-accent-gold lg:block"
        animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1, 0.5], rotate: [0, 25, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1.2, ease: 'easeInOut' }}
      >
        <Sparkles size={20} />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[16%] top-[26%] hidden text-accent-gold lg:block"
        animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5], rotate: [0, -20, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, delay: 2.6, ease: 'easeInOut' }}
      >
        <Sparkles size={16} />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[26%] top-[58%] hidden text-accent-gold/80 lg:block"
        animate={{ opacity: [0, 0.6, 0], scale: [0.4, 0.9, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, delay: 4, ease: 'easeInOut' }}
      >
        <Sparkles size={13} />
      </motion.div>

      <div className="relative flex flex-col pb-8 pt-[72px]">
        {/* Brand Lockup — completely static, tucked beneath the navbar */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.965 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="relative"
          >
            <h1 className="sr-only">GAD Aesthetic Clinic — By Dr. Abdullah Asif</h1>
            <img
              src={lockup}
              alt="GAD Aesthetic Clinic — By Dr. Abdullah Asif"
              className="blend-mask mx-auto h-auto w-full max-w-[1200px] object-contain"
            />

            {/* Twinkle accents pinned beside the lockup */}
            <motion.div
              aria-hidden
              className="absolute -left-2 top-[18%] hidden text-accent-gold lg:block"
              animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.1, 0.5] }}
              transition={{ duration: 3.8, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
            >
              <Sparkles size={22} />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute -right-3 top-[12%] hidden text-accent-gold lg:block"
              animate={{ opacity: [0, 0.75, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 4.6, repeat: Infinity, delay: 2.2, ease: 'easeInOut' }}
            >
              <Sparkles size={17} />
            </motion.div>
          </motion.div>
        </div>

        {/* Gold hairline — draws itself on load */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.55, ease: 'easeOut' }}
          className="mx-auto mt-3 h-px w-56 origin-center bg-gradient-to-r from-transparent via-accent-gold to-transparent"
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
          className="mx-auto mt-7 max-w-2xl text-center text-sm font-bold leading-relaxed text-[#6E5A4C] sm:mt-9 sm:text-base lg:leading-[1.9]"
        >
          Experience premium aesthetic care at GAD Aesthetic Clinic. Our certified dermatologists
          and cosmetologists utilize state-of-the-art technologies for HydraFacials, Laser Hair
          Removal, PRP therapies, and advanced skin solutions. Proudly serving the Gujranwala
          community with unparalleled clinical excellence.
        </motion.p>

        {/* CTAs — staggered entrance, shimmer sweep on hover */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.6 } } }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
            <motion.button
              onClick={scrollToBooking}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-9 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-gold transition-shadow duration-300 hover:shadow-lift"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[110%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[110%]" />
              <span className="relative">Book Your Consultation</span>
            </motion.button>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}>
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="group relative overflow-hidden rounded-full border border-brand-dark/25 bg-transparent px-9 py-4 text-sm font-bold uppercase tracking-widest text-brand-dark transition-colors duration-300 hover:border-brand-dark hover:text-primary-bg"
            >
              <span className="absolute inset-0 -translate-x-[110%] bg-brand-dark transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-primary-bg">
                <Link to="/treatments" className="inline-block">
                  Explore Treatments
                </Link>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-light/60">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={17} className="text-accent-gold-deep" />
          </motion.div>
        </motion.div>
      </div>

      {/* Soft transition into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F3EFEA]" />
    </section>
  );
}
