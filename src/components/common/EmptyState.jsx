import { Flower2 } from 'lucide-react';

export default function EmptyState({ icon: Icon = Flower2, title, message, action }) {
  return (
    <div className="card-lux flex flex-col items-center px-8 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold-soft text-accent-gold-deep">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-xl font-semibold text-brand-dark">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-light">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
