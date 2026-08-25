import { useState } from 'react';
import { Tag, Phone } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import SectionHeading from '../../components/common/SectionHeading';
import { DealCard } from '../../components/public/Cards';
import BookingModal from '../../components/public/BookingModal';
import { SkeletonGrid } from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { CLINIC } from '../../utils/helpers';

export default function Deals() {
  const { data: deals, loading } = useCollection('deals');
  const [booking, setBooking] = useState(null);

  return (
    <div className="pb-24 pt-[120px] sm:pt-[150px]">
      <section className="relative overflow-hidden bg-secondary-bg py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(243,233,210,1), transparent)' }}
        />
        <div className="container-lux relative">
          <SectionHeading
            eyebrow="Limited Time"
            title="Exclusive Offers &"
            highlight="Packages"
            description="Carefully curated treatment bundles at exceptional value — combining our most-loved procedures into one luxurious experience."
          />
        </div>
      </section>

      <div className="container-lux mt-12">
        {loading && <SkeletonGrid count={3} />}

        {!loading && deals.length === 0 && (
          <EmptyState
            icon={Tag}
            title="No active offers right now"
            message="There are no active offers at the moment. Please check back soon or contact GAD Aesthetic Clinic."
            action={
              <a href={`tel:${CLINIC.phoneRaw}`} className="btn-gold">
                <Phone size={15} />
                {CLINIC.phone}
              </a>
            }
          />
        )}

        {!loading && deals.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((d, i) => (
              <DealCard key={d.id} deal={d} index={i} onBook={setBooking} />
            ))}
          </div>
        )}
      </div>

      <BookingModal open={!!booking} onClose={() => setBooking(null)} booking={booking} />
    </div>
  );
}
