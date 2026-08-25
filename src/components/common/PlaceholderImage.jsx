import { Flower2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Elegant branded placeholder used whenever an item has no Cloudinary image yet.
 * Renders a soft botanical gradient with a leaf motif and the item name.
 */
export default function PlaceholderImage({ name, className, seed = 0 }) {
  const gradients = [
    'from-[#EFE6D8] via-[#F3E9D2] to-[#E7D9BF]',
    'from-[#F0E8DE] via-[#EAD9C6] to-[#DEC9A8]',
    'from-[#F3EFEA] via-[#E9DFD0] to-[#D9C6A6]',
    'from-[#EDE4D3] via-[#F0E6D2] to-[#E2D3B4]',
  ];
  const g = gradients[seed % gradients.length];

  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden bg-gradient-to-br', g, className)}>
      <Flower2
        className="absolute -left-4 -top-4 h-24 w-24 rotate-12 text-brand-dark/5"
        strokeWidth={1}
      />
      <Flower2
        className="absolute -bottom-6 -right-6 h-32 w-32 -rotate-12 text-brand-dark/5"
        strokeWidth={1}
      />
      {name && (
        <span className="max-w-[85%] text-center font-heading text-sm font-medium italic leading-snug text-brand-dark/40 sm:text-base">
          {name}
        </span>
      )}
    </div>
  );
}
