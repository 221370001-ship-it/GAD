import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Flower2 } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { TreatmentCard } from '../../components/public/Cards';
import BookingModal from '../../components/public/BookingModal';
import { SkeletonGrid } from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { CLINIC } from '../../utils/helpers';

export default function CategoryPage() {
  const { slug } = useParams();
  const [booking, setBooking] = useState(null);
  const { data: categories, loading: catLoading } = useCollection('categories');
  const { data: treatments, loading: treatLoading } = useCollection('treatments');

  const category = useMemo(() => categories.find((c) => c.slug === slug), [categories, slug]);
  const catTreatments = useMemo(
    () => treatments.filter((t) => t.categorySlug === slug),
    [treatments, slug]
  );

  const loading = catLoading || treatLoading;

  return (
    <div className="pb-24">
      {/* Category banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        {category?.image ? (
          <img src={category.image} alt={category?.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#EFE6D8] via-[#F3E9D2] to-[#E7D9BF]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/75 via-brand-deep/25 to-transparent" />
        <div className="container-lux absolute inset-x-0 bottom-0 pb-8">
          <Link
            to="/treatments"
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-brand-dark backdrop-blur-sm transition-colors duration-300 hover:bg-white"
          >
            <ArrowLeft size={13} />
            All Treatments
          </Link>
          {loading ? (
            <div className="h-10 w-64 animate-pulse rounded-lg bg-white/20" />
          ) : (
            <h1 className="font-heading text-4xl font-bold text-white drop-shadow-sm sm:text-5xl">
              {category?.name || 'Treatments'}
            </h1>
          )}
          {!loading && category && (
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-gold">
              {catTreatments.length} {catTreatments.length === 1 ? 'Treatment' : 'Treatments'} · Special launch pricing
            </p>
          )}
        </div>
      </section>

      {/* Treatments grid */}
      <div className="container-lux mt-12">
        {loading && <SkeletonGrid count={6} />}

        {!loading && !category && (
          <EmptyState
            icon={Flower2}
            title="Category not found"
            message="This treatment category does not exist or has been removed."
            action={
              <Link to="/treatments" className="btn-gold">
                <ArrowLeft size={15} />
                Back to All Treatments
              </Link>
            }
          />
        )}

        {!loading && category && catTreatments.length === 0 && (
          <EmptyState
            icon={Flower2}
            title="Treatments coming soon"
            message={`Treatments for ${category.name} are being added right now. Please check back soon or contact us on ${CLINIC.phone}.`}
          />
        )}

        {!loading && catTreatments.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catTreatments.map((t, i) => (
              <TreatmentCard key={t.id} treatment={t} index={i} onBook={setBooking} />
            ))}
          </div>
        )}
      </div>

      <BookingModal open={!!booking} onClose={() => setBooking(null)} booking={booking} />
    </div>
  );
}
