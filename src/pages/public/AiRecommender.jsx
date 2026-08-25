import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  UserRound,
  ShieldCheck,
  BadgeCheck,
  Star,
  Clock,
  Check,
} from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import BookingModal from '../../components/public/BookingModal';
import PlaceholderImage from '../../components/common/PlaceholderImage';
import { createAiLead } from '../../firebase/services';
import { calculateBestTreatment, buildProfileSummary } from '../../utils/recommendationEngine';
import { formatPrice, isValidPhone, cn } from '../../utils/helpers';
import { GoldSpinner } from '../../components/common/Spinner';

const TOTAL_STEPS = 8;

const AGE_RANGES = ['18–25', '26–35', '36–45', '46–55', '55+'];
const GENDERS = ['Female', 'Male', 'Prefer not to say'];
const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
const CONCERNS = [
  'Acne & Breakouts',
  'Acne Scars',
  'Hyperpigmentation',
  'Melasma',
  'Fine Lines & Wrinkles',
  'Dull Skin',
  'Uneven Skin Tone',
  'Dark Circles',
  'Large Pores',
  'Unwanted Hair',
  'Hair Fall',
  'Skin Brightening',
  'Other',
];
const GOALS = [
  'Clear Skin',
  'Anti-Aging',
  'Deep Hydration',
  'Hair Restoration',
  'Skin Brightening',
  'Scar Removal',
  'Smooth Hair-Free Skin',
  'Bridal Glow',
];
const BUDGETS = ['PKR 5,000 – 15,000', 'PKR 15,000 – 30,000', 'PKR 30,000 – 50,000', 'PKR 50,000+'];

const ANALYSIS_LINES = [
  'Analyzing skin type & concerns…',
  'Matching with treatments…',
  'Calculating compatibility scores…',
];

const slide = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

function OptionPill({ label, selected, onClick, multi = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition-all duration-300',
        selected
          ? 'border-accent-gold bg-accent-gold-soft text-accent-gold-deep shadow-gold'
          : 'border-brand-dark/15 bg-white text-brand-dark hover:border-accent-gold/50 hover:bg-accent-gold-soft/30'
      )}
    >
      {selected && multi && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      {label}
    </button>
  );
}

function TextField({ label, hint, error, children }) {
  return (
    <div>
      <label className="label-lux">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-brand-light/60">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

export default function AiRecommender() {
  const { data: treatments, loading: treatmentsLoading } = useCollection('treatments');
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState('funnel'); // funnel | analyzing | results
  const [analysisIdx, setAnalysisIdx] = useState(0);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const leadSaved = useRef(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    ageRange: '',
    gender: '',
    skinType: '',
    primaryConcern: '',
    otherConcerns: [],
    goals: [],
    budget: '',
  });

  const result = useMemo(
    () => (phase === 'results' ? calculateBestTreatment(form, treatments) : null),
    [phase, form, treatments]
  );

  useEffect(() => {
    if (phase !== 'analyzing') return undefined;
    setAnalysisIdx(0);
    const timers = [];
    ANALYSIS_LINES.forEach((_, i) => {
      if (i > 0) timers.push(setTimeout(() => setAnalysisIdx(i), i * 1000));
    });
    timers.push(setTimeout(() => setPhase('results'), 3000));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase === 'results' && !leadSaved.current) {
      leadSaved.current = true;
      createAiLead({ ...form, topMatch: result?.top?.treatment?.name || null }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function next() {
    setError('');
    if (step === 1) {
      if (!form.fullName.trim()) return setError('Please enter your name to continue.');
      if (!isValidPhone(form.phone)) return setError('Please enter a valid contact number.');
    }
    if (step === 2 && !form.ageRange) return setError('Please select your age range.');
    if (step === 3 && !form.gender) return setError('Please select an option.');
    if (step === 4 && !form.skinType) return setError('Please select your skin type.');
    if (step === 5 && !form.primaryConcern) return setError('Please select your primary concern.');
    if (step === 8 && !form.budget) return setError('Please select a budget range.');
    if (step === TOTAL_STEPS) {
      setPhase('analyzing');
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function back() {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  }

  const toggleMulti = (key, value, max = 3) => {
    setForm((f) => {
      const list = f[key];
      if (list.includes(value)) return { ...f, [key]: list.filter((v) => v !== value) };
      if (list.length >= max) return f;
      return { ...f, [key]: [...list, value] };
    });
  };

  const progress = phase === 'funnel' ? Math.round((step / TOTAL_STEPS) * 100) : 100;

  return (
    <div className="min-h-screen pb-24 pt-[120px] sm:pt-[150px]">
      {/* Header */}
      <section className="container-lux text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="chip-gold mx-auto">
            <Sparkles size={13} />
            AI-Powered Analysis
          </span>
          <h1 className="mt-5 font-heading text-4xl font-semibold text-brand-dark sm:text-5xl">
            AI Treatment <span className="italic text-accent-gold-deep">Recommender</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-light sm:text-[15px]">
            Answer a few questions and our AI will recommend personalized treatments tailored to
            your unique skin profile.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: BrainCircuit, title: 'AI Skin Analysis', text: 'Advanced algorithms analyze your unique profile' },
              { icon: BadgeCheck, title: 'Expert Verified', text: 'Recommendations use our real treatment menu' },
              { icon: ShieldCheck, title: 'Privacy First', text: 'Your answers are used only to recommend care' },
            ].map((f) => (
              <div key={f.title} className="card-lux flex items-start gap-3 p-4 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold-soft text-accent-gold-deep">
                  <f.icon size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-dark">{f.title}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-brand-light">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Funnel / Analyzing / Results */}
      <section className="container-lux mt-12">
        <div className="mx-auto max-w-3xl">
          {phase !== 'results' && (
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-brand-light">
                <span>{phase === 'analyzing' ? 'Analysis in progress' : `Step ${step} of ${TOTAL_STEPS}`}</span>
                <span className="text-accent-gold-deep">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary-bg">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ---------- FUNNEL ---------- */}
            {phase === 'funnel' && (
              <motion.div key={`step-${step}`} {...slide} className="card-lux p-6 sm:p-10">
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      Let's start with your details
                    </h2>
                    <TextField label="Your Name">
                      <input
                        className="input-lux"
                        placeholder="Enter your name"
                        value={form.fullName}
                        onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                      />
                    </TextField>
                    <TextField label="Contact Number" hint="We may contact you on WhatsApp with your plan.">
                      <input
                        className="input-lux"
                        placeholder="03XX XXXXXXX"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </TextField>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      What is your age range?
                    </h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {AGE_RANGES.map((a) => (
                        <OptionPill
                          key={a}
                          label={a}
                          selected={form.ageRange === a}
                          onClick={() => setForm((f) => ({ ...f, ageRange: a }))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      What is your gender?
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {GENDERS.map((g) => (
                        <OptionPill
                          key={g}
                          label={g}
                          selected={form.gender === g}
                          onClick={() => setForm((f) => ({ ...f, gender: g }))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      What is your skin type?
                    </h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {SKIN_TYPES.map((s) => (
                        <OptionPill
                          key={s}
                          label={s}
                          selected={form.skinType === s}
                          onClick={() => setForm((f) => ({ ...f, skinType: s }))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      What is your primary concern?
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {CONCERNS.map((c) => (
                        <OptionPill
                          key={c}
                          label={c}
                          selected={form.primaryConcern === c}
                          onClick={() => setForm((f) => ({ ...f, primaryConcern: c }))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      Any other concerns?
                    </h2>
                    <p className="mt-1 text-sm text-brand-light">Select up to 3 — optional.</p>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {CONCERNS.filter((c) => c !== form.primaryConcern).map((c) => (
                        <OptionPill
                          key={c}
                          label={c}
                          multi
                          selected={form.otherConcerns.includes(c)}
                          onClick={() => toggleMulti('otherConcerns', c)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      What are your treatment goals?
                    </h2>
                    <p className="mt-1 text-sm text-brand-light">Select up to 3.</p>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {GOALS.map((g) => (
                        <OptionPill
                          key={g}
                          label={g}
                          multi
                          selected={form.goals.includes(g)}
                          onClick={() => toggleMulti('goals', g)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                      What is your budget range?
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {BUDGETS.map((b) => (
                        <OptionPill
                          key={b}
                          label={b}
                          selected={form.budget === b}
                          onClick={() => setForm((f) => ({ ...f, budget: b }))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="mt-8 flex items-center justify-between">
                  {step > 1 ? (
                    <button onClick={back} className="btn-ghost">
                      <ArrowLeft size={15} />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  <button onClick={next} className="btn-gold">
                    {step === TOTAL_STEPS ? 'Analyze My Profile' : 'Continue'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ---------- ANALYZING ---------- */}
            {phase === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="card-lux flex flex-col items-center px-6 py-20 text-center"
              >
                <div className="relative flex h-36 w-36 items-center justify-center">
                  <span className="absolute inset-0 animate-pulseGlow rounded-full bg-gradient-to-br from-accent-gold/50 to-brand-dark/30 blur-xl" />
                  <span className="absolute inset-2 rounded-full border border-accent-gold/40" />
                  <span className="absolute inset-5 rounded-full border border-accent-gold/25" />
                  <UserRound size={52} className="relative text-accent-gold-deep" strokeWidth={1.2} />
                </div>
                <h2 className="mt-10 font-heading text-2xl font-semibold text-brand-dark sm:text-3xl">
                  Analyzing Your Skin Profile
                </h2>
                <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-brand-light">
                  <GoldSpinner size={16} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={analysisIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      {ANALYSIS_LINES[analysisIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ---------- RESULTS ---------- */}
            {phase === 'results' && result && result.top && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="chip-gold mx-auto">
                    <Sparkles size={13} />
                    Analysis Complete
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-semibold text-brand-dark sm:text-4xl">
                    Hi {form.fullName.split(' ')[0]}! Your AI analysis is complete.
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-light">
                    {buildProfileSummary(form)}
                  </p>
                </div>

                {/* Top match */}
                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="relative overflow-hidden rounded-4xl border-2 border-accent-gold/60 bg-white shadow-gold"
                >
                  <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-gold">
                    <Star size={12} className="fill-white" />
                    Match Score: {result.top.score}%
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="relative h-56 sm:h-full">
                      {result.top.treatment.image ? (
                        <img
                          src={result.top.treatment.image}
                          alt={result.top.treatment.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <PlaceholderImage
                          name={result.top.treatment.name}
                          className="h-full w-full"
                        />
                      )}
                    </div>
                    <div className="p-7 sm:p-8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent-gold-deep">
                        Your #1 Recommendation
                      </p>
                      <h3 className="mt-2 font-heading text-2xl font-semibold text-brand-dark">
                        {result.top.treatment.name}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {result.top.treatment.duration && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-bg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-light">
                            <Clock size={12} />
                            {result.top.treatment.duration}
                          </span>
                        )}
                        <span className="font-heading text-2xl font-bold text-brand-dark">
                          {formatPrice(result.top.treatment.discountedPrice || result.top.treatment.originalPrice)}
                        </span>
                        {Number(result.top.treatment.discountedPrice) < Number(result.top.treatment.originalPrice) && (
                          <span className="text-sm text-brand-light/60 line-through">
                            {formatPrice(result.top.treatment.originalPrice)}
                          </span>
                        )}
                      </div>
                      <ul className="mt-4 space-y-2">
                        {(result.top.reasons.length
                          ? result.top.reasons
                          : ['Personalised to your profile', 'Performed by certified specialists', 'Visible, natural-looking results']
                        ).map((r) => (
                          <li key={r} className="flex items-start gap-2 text-[13px] text-brand-light">
                            <Check size={14} className="mt-0.5 shrink-0 text-accent-gold-deep" strokeWidth={3} />
                            {r}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setBooking(result.top.treatment)}
                        className="btn-gold mt-6 w-full"
                      >
                        <Sparkles size={15} />
                        Book This Treatment Now
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Alternatives */}
                {result.alternatives.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-brand-light">
                      Also Compatible With Your Profile
                    </h3>
                    <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
                      {result.alternatives.map((alt, i) => (
                        <motion.div
                          key={alt.treatment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + i * 0.1 }}
                          className="card-lux flex w-[270px] shrink-0 flex-col overflow-hidden sm:w-auto"
                        >
                          <div className="relative h-32">
                            {alt.treatment.image ? (
                              <img src={alt.treatment.image} alt={alt.treatment.name} className="h-full w-full object-cover" />
                            ) : (
                              <PlaceholderImage name={alt.treatment.name} seed={i + 1} className="h-full w-full" />
                            )}
                            <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-accent-gold-deep shadow-soft">
                              {alt.score}% match
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <h4 className="font-heading text-base font-semibold text-brand-dark">
                              {alt.treatment.name}
                            </h4>
                            <p className="mt-1 font-heading text-lg font-bold text-brand-dark">
                              {formatPrice(alt.treatment.discountedPrice || alt.treatment.originalPrice)}
                            </p>
                            <button
                              onClick={() => setBooking(alt.treatment)}
                              className="btn-outline mt-4 w-full py-2 text-[11px]"
                            >
                              Book This Instead
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => {
                      setPhase('funnel');
                      setStep(1);
                      leadSaved.current = false;
                    }}
                    className="btn-ghost"
                  >
                    <ArrowLeft size={15} />
                    Restart Analysis
                  </button>
                  <p className="max-w-md text-center text-[11px] leading-relaxed text-brand-light/60">
                    AI recommendations are advisory. Final suitability is always confirmed by our
                    doctors during consultation.
                  </p>
                </div>
              </motion.div>
            )}

            {phase === 'results' && treatmentsLoading && (
              <div className="card-lux flex items-center justify-center gap-3 py-20 text-sm text-brand-light">
                <GoldSpinner size={18} />
                Loading our treatment menu…
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <BookingModal open={!!booking} onClose={() => setBooking(null)} booking={booking} prefill={{ fullName: form.fullName, phone: form.phone, gender: form.gender === 'Prefer not to say' ? 'Female' : form.gender }} />
    </div>
  );
}
