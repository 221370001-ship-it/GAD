export function SkeletonCard({ lines = 4, className = '' }) {
  return (
    <div className={`card-lux overflow-hidden ${className}`}>
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton h-3.5 w-full rounded-lg" style={{ opacity: 1 - i * 0.15 }} />
        ))}
        <div className="skeleton mt-4 h-9 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
