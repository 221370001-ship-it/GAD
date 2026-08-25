import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flower2 } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import SectionHeading from '../../components/common/SectionHeading';
import PlaceholderImage from '../../components/common/PlaceholderImage';
import { SkeletonGrid } from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { CLINIC } from '../../utils/helpers';

export default function Treatments() {
  const navigate = useNavigate();
  const { data: categories, loading: catLoading } = useCollection('categories');
  const { data: treatments, loading: treatLoading } = useCollection('treatments');

  const loading = catLoading || treatLoading;

  const cards = useMemo(() => {
    const sorted = [...categories].sort((a, b) => (a.order || 99) - (b.order || 99));
    return sorted.map((c) => ({
      ...c,
      count: treatments.filter((t) => t.categorySlug === c.slug).length,
    }));
  }, [categories, treatments]);

  return (
    <div className="pb-24 pt-[120px] sm:pt-[150px]">
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-secondary-bg py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(243,233,210,1), transparent)' }}
        />
        <div className="container-lux relative">
          <SectionHeading
            eyebrow="The GAD Menu"
            title="Our Premium"
            highlight="Treatments"
            description="Explore our treatment categories — every procedure is performed by certified professionals using medical-grade technology, at special launch pricing."
          />
        </div>
      </section>

      <div className="container-lux mt-12">
        {loading && <SkeletonGrid count={6} />}

        {!loading && cards.length === 0 && (
          <EmptyState
            icon={Flower2}
            title="Categories are being curated"
            message={`Our treatment menu is being updated right now. Please check back soon, or contact us on ${CLINIC.phone} for the latest price list.`}
          />
        )}

        {!loading && cards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: 'easeOut' }}
                onClick={() => navigate(`/treatments/${cat.slug}`)}
                className="card-lux group overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full transition-transform duration-700 group-hover:scale-110">
                      <PlaceholderImage name={cat.name} seed={i} className="h-full w-full" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/55 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark backdrop-blur-sm">
                    {cat.count} {cat.count === 1 ? 'Treatment' : 'Treatments'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-5">
                  <h3 className="font-heading text-xl font-bold text-brand-dark transition-colors duration-300 group-hover:text-accent-gold-deep sm:text-[1.35rem]">
                    {cat.name}
                  </h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-gold-soft text-accent-gold-deep transition-all duration-300 group-hover:bg-accent-gold group-hover:text-white">
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
