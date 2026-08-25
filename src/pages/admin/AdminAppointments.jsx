import { useState } from 'react';
import { CalendarCheck, ExternalLink, Search } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { updateDocument } from '../../firebase/services';
import { formatDate, STATUS_STYLES, cn } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const TYPES = ['all', 'physical', 'video', 'treatment-booking'];

export default function AdminAppointments() {
  const { data, loading } = useCollection('appointments');
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = data
    .filter((a) => (typeFilter === 'all' ? true : a.type === typeFilter))
    .filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return [a.fullName, a.phone, a.primaryConcern, a.treatmentName].some((v) =>
        String(v || '').toLowerCase().includes(q)
      );
    });

  async function setStatus(a, status) {
    try {
      await updateDocument('appointments', a.id, { status });
      toast(`Request marked as ${status}.`, 'success');
    } catch (err) {
      console.error(err);
      toast('Could not update status.', 'error');
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-light/50" />
          <input
            className="input-lux pl-10"
            placeholder="Search name, phone, concern…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all',
                typeFilter === t
                  ? 'bg-accent-gold-soft text-accent-gold-deep shadow-soft'
                  : 'bg-white text-brand-light hover:text-brand-dark'
              )}
            >
              {t === 'all' ? 'All' : t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="py-16 text-center text-sm text-brand-light">Loading requests…</p>}

      {!loading && filtered.length === 0 && (
        <div className="card-lux flex flex-col items-center py-16 text-center">
          <CalendarCheck size={36} className="text-brand-light/40" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-brand-light">No consultation requests found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((a) => (
          <div key={a.id} className="card-lux p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-brand-dark">{a.fullName}</h3>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest', STATUS_STYLES[a.status] || 'bg-secondary-bg text-brand-light')}>
                    {a.status}
                  </span>
                  <span className="chip-gold">{a.type === 'video' ? 'Video' : a.type === 'treatment-booking' ? 'Treatment' : 'In-Clinic'}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-brand-light">{a.phone}</p>
              </div>
              <p className="shrink-0 text-[11px] text-brand-light/60">{formatDate(a.createdAt)}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Age</p>
                <p className="font-semibold text-brand-dark">{a.age || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Gender</p>
                <p className="font-semibold text-brand-dark">{a.gender || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Date</p>
                <p className="font-semibold text-brand-dark">{a.date || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Time</p>
                <p className="font-semibold text-brand-dark">{a.time || '—'}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              {a.treatmentName && (
                <p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Treatment: </span>
                  <span className="font-semibold text-brand-dark">{a.treatmentName}</span>
                </p>
              )}
              {a.skinType && a.skinType !== 'Not sure' && (
                <p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Skin Type: </span>
                  <span className="text-brand-light">{a.skinType}</span>
                </p>
              )}
              {a.primaryConcern && (
                <p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Concern: </span>
                  <span className="text-brand-light">{a.primaryConcern}</span>
                </p>
              )}
              {a.type === 'video' && (
                <p className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Fee: </span>
                  <span className="chip-gold">Rs. 1,500</span>
                  {a.paymentScreenshotUrl && (
                    <a
                      href={a.paymentScreenshotUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent-gold-deep underline underline-offset-2"
                    >
                      <ExternalLink size={12} />
                      View Payment Screenshot
                    </a>
                  )}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-dark/8 pt-4">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-brand-light/60">Set status:</span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(a, s)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all',
                    a.status === s
                      ? 'bg-brand-dark text-primary-bg'
                      : 'bg-secondary-bg text-brand-light hover:text-brand-dark'
                  )}
                >
                  {s}
                </button>
              ))}
              <a
                href={`https://wa.me/${String(a.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '92')}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-xs font-bold text-accent-gold-deep underline underline-offset-2"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
