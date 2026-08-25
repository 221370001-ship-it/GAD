import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { CLINIC, cn } from '../../utils/helpers';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/treatments', label: 'Treatments' },
  { to: '/deals', label: 'Deals' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const lastY = useRef(0);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 120) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waHref = `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(
    'Hello GAD Aesthetic Clinic! I would like to book a consultation.'
  )}`;

  const contactBtn = (extra) => (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-accent-gold px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[#332720] shadow-gold transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lift',
        extra
      )}
    >
      <WhatsAppIcon size={15} />
      Contact Us
    </a>
  );

  return (
    <motion.header
      animate={{ y: hidden && !open ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed inset-x-0 top-0 z-50 border-b border-accent-gold/20 bg-[#332720]/95 shadow-lg shadow-black/20 backdrop-blur-sm"
    >
      <div className="container-lux flex h-[72px] items-center justify-between">
        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group relative py-2 text-[13px] font-bold uppercase tracking-[0.14em] transition-all duration-300 hover:-translate-y-0.5',
                  isActive ? 'text-accent-gold' : 'text-primary-bg/85 hover:text-accent-gold'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-accent-gold transition-all duration-300 ease-out',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">{contactBtn('')}</div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-gold/40 text-accent-gold transition-all duration-300 hover:bg-accent-gold hover:text-[#332720] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-accent-gold/15 bg-[#332720] lg:hidden"
          >
            <div className="container-lux flex flex-col gap-1 py-4">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors duration-200',
                        isActive
                          ? 'bg-accent-gold/15 text-accent-gold'
                          : 'text-primary-bg/85 hover:bg-white/5 hover:text-accent-gold'
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.25 }}
                className="mt-2"
              >
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-accent-gold px-5 py-3 text-sm font-bold uppercase tracking-widest text-[#332720] shadow-gold transition-all duration-300 hover:brightness-110"
                >
                  <WhatsAppIcon size={16} />
                  Contact Us
                </a>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
