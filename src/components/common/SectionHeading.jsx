import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, highlight, description, align = 'center' }) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`flex max-w-3xl flex-col ${alignCls}`}
    >
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="font-heading text-3xl font-semibold leading-tight text-brand-dark sm:text-4xl lg:text-[2.75rem]">
        {title} {highlight && <span className="italic text-accent-gold-deep">{highlight}</span>}
      </h2>
      <div className="mt-4 h-px w-16 bg-accent-gold" />
      {description && <p className="mt-4 text-[15px] leading-relaxed text-brand-light">{description}</p>}
    </motion.div>
  );
}
