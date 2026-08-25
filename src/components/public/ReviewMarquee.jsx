import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Ayesha K.',
    time: '2 weeks ago',
    text: 'After the treatment, my skin felt refreshed, glowing, and rejuvenated.',
    tag: 'Hydra Facial',
  },
  {
    name: 'Hamza R.',
    time: '1 month ago',
    text: 'Making me feel comfortable throughout the session.',
    tag: 'Laser Hair Removal',
  },
  {
    name: 'Sana M.',
    time: '3 weeks ago',
    text: 'Professional staff and a spotless clinic. My acne has visibly improved after just two sessions.',
    tag: 'Acne Treatment',
  },
  {
    name: 'Bilal A.',
    time: '1 week ago',
    text: 'Dr. Abdullah explains everything honestly — no false promises, only real results. Highly recommended.',
    tag: 'Hair PRP',
  },
  {
    name: 'Fatima Z.',
    time: '2 months ago',
    text: 'The Hollywood peel gave me an instant glow. The whole experience felt premium from start to finish.',
    tag: 'Hollywood Peel',
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-accent-gold text-accent-gold" />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="mx-3 w-[300px] shrink-0 rounded-2xl border border-brand-dark/8 bg-white p-6 shadow-card sm:w-[340px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold-soft font-heading text-base font-bold text-accent-gold-deep">
            {review.name.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-bold text-brand-dark">{review.name}</p>
            <p className="text-[11px] text-brand-light/70">{review.time} · Google Review</p>
          </div>
        </div>
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5.1l-3.9 3C3.3 21.3 7.3 24 12 24z" />
          <path fill="#FBBC05" d="M5.2 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.3l3.9-3z" />
          <path fill="#EA4335" d="M12 4.7c2.3 0 3.8.9 4.7 1.8l3.4-3.3C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.7l3.9 3c.9-2.9 3.6-5 6.8-5z" />
        </svg>
      </div>
      <div className="mt-4">
        <Stars />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-brand-dark/85">"{review.text}"</p>
      <span className="chip-gold mt-4">{review.tag}</span>
    </div>
  );
}

export default function ReviewMarquee() {
  const loop = [...REVIEWS, ...REVIEWS];
  return (
    <div className="marquee-paused relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-primary-bg to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-primary-bg to-transparent sm:w-28" />
      <div className="flex w-max animate-marquee py-2">
        {loop.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>
    </div>
  );
}
