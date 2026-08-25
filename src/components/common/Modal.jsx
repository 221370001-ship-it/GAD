import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-brand-deep/50 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-4xl bg-primary-bg p-6 shadow-lift sm:rounded-4xl sm:p-8`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-brand-light transition-colors hover:bg-secondary-bg hover:text-brand-dark"
            >
              <X size={18} />
            </button>
            {title && (
              <div className="mb-6 pr-8">
                <h3 className="font-heading text-2xl font-semibold text-brand-dark">{title}</h3>
                {subtitle && <p className="mt-1 text-sm text-brand-light">{subtitle}</p>}
                <div className="mt-3 h-px w-14 bg-accent-gold" />
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
