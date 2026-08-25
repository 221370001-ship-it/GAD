import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import PlaceholderImage from '../common/PlaceholderImage';
import { formatPrice } from '../../utils/helpers';

export function TreatmentCard({ treatment, index = 0, onBook }) {
  const t = treatment;
  const discounted = t.discountedPrice != null ? Number(t.discountedPrice) : null;
  const original = t.originalPrice != null ? Number(t.originalPrice) : null;
  const hasPrice = discounted != null || original != null;
  const off =
    hasPrice && original && discounted != null && original > discounted
      ? Math.round(((original - discounted) / original) * 100)
      : null;
  const unit = t.priceUnit ? ` ${t.priceUnit}` : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: 'easeOut' }}
      className="card-lux group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-48 overflow-hidden">
        {t.image ? (
          <img
            src={t.image}
            alt={t.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full transition-transform duration-700 group-hover:scale-105">
            <PlaceholderImage name={t.name} seed={index} className="h-full w-full" />
          </div>
        )}
        {off && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-gold">
            {off}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold leading-snug text-brand-dark">{t.name}</h3>
        </div>
        {t.duration && (
          <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary-bg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-light">
            <Clock size={12} />
            {t.duration}
          </span>
        )}

        {hasPrice ? (
          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            {off && <span className="text-sm text-brand-light/60 line-through">{formatPrice(original)}{unit}</span>}
            <span className="font-heading text-2xl font-bold text-brand-dark">
              {formatPrice(discounted || original)}{unit}
            </span>
            {off && <span className="chip-gold">{off}% OFF</span>}
          </div>
        ) : (
          <p className="mt-4 font-heading text-lg font-semibold text-accent-gold-deep">
            Price on Consultation
          </p>
        )}

        {t.description && (
          <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-brand-light">{t.description}</p>
        )}

        <button onClick={() => onBook(t)} className="btn-gold mt-5 w-full py-2.5 text-[12px]">
          <Calendar size={14} />
          Book Slot
        </button>
      </div>
    </motion.article>
  );
}

export function DealCard({ deal, index = 0, onBook }) {
  const d = deal;
  const discounted = Number(d.discountedPrice);
  const original = Number(d.originalPrice);
  const off = original > discounted ? Math.round(((original - discounted) / original) * 100) : null;
  const items = Array.isArray(d.includedTreatments)
    ? d.includedTreatments
    : String(d.includedTreatments || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: 'easeOut' }}
      className="card-lux group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-52 overflow-hidden">
        {d.image ? (
          <img
            src={d.image}
            alt={d.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full transition-transform duration-700 group-hover:scale-105">
            <PlaceholderImage name={d.title} seed={index + 1} className="h-full w-full" />
          </div>
        )}
        {off && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-gold">
            Save {off}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold text-brand-dark">{d.title}</h3>
        {d.duration && (
          <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary-bg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-light">
            <Clock size={12} />
            {d.duration}
          </span>
        )}

        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent-gold-deep">Includes</p>
          <ul className="mt-2 space-y-1.5">
            {items.slice(0, 4).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-brand-light">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                {item}
              </li>
            ))}
          </ul>
          {items.length > 4 && (
            <p className="mt-1 text-[11px] font-semibold text-brand-light/70">+ {items.length - 4} more</p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          {off && <span className="text-sm text-brand-light/60 line-through">{formatPrice(original)}</span>}
          <span className="font-heading text-2xl font-bold text-brand-dark">{formatPrice(discounted || original)}</span>
        </div>

        {d.description && <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-brand-light">{d.description}</p>}

        <button onClick={() => onBook(d)} className="btn-gold mt-5 w-full py-2.5 text-[12px]">
          <Calendar size={14} />
          Book Your Slot
        </button>
      </div>
    </motion.article>
  );
}

export function ProductCard({ product, index = 0, onBuy }) {
  const p = product;
  const discounted = Number(p.discountedPrice);
  const original = Number(p.originalPrice);
  const off = original > discounted ? Math.round(((original - discounted) / original) * 100) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: 'easeOut' }}
      className="card-lux group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative bg-[#FCFBF8]">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="h-56 w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-56 transition-transform duration-700 group-hover:scale-105">
            <PlaceholderImage name={p.name} seed={index + 2} className="h-full w-full" />
          </div>
        )}
        {off && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-accent-gold to-accent-gold-deep px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-gold">
            {off}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 text-center">
        <h3 className="text-sm font-bold text-brand-dark">{p.name}</h3>
        {p.description && <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-brand-light">{p.description}</p>}
        <div className="mt-3 flex items-baseline justify-center gap-2">
          {off && <span className="text-sm text-brand-light/60 line-through">{formatPrice(original)}</span>}
          <span className="font-heading text-xl font-bold text-brand-dark">{formatPrice(discounted || original)}</span>
        </div>
        <button
          onClick={() => onBuy(p)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-dark/30 bg-transparent px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest text-brand-dark transition-all duration-300 hover:border-brand-dark hover:bg-brand-dark hover:text-primary-bg"
        >
          Buy Now
        </button>
      </div>
    </motion.article>
  );
}
