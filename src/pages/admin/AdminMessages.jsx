import { useState } from 'react';
import { MessageSquare, Mail, Phone, Tag } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { updateDocument } from '../../firebase/services';
import { formatDate, cn } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function AdminMessages() {
  const { data, loading } = useCollection('messages');
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  const filtered = data.filter((m) => (filter === 'unread' ? !m.read : true));

  async function markRead(m) {
    if (m.read) return;
    try {
      await updateDocument('messages', m.id, { read: true });
    } catch (err) {
      console.error(err);
      toast('Could not mark as read.', 'error');
    }
  }

  if (loading) return <p className="py-16 text-center text-sm text-brand-light">Loading messages…</p>;

  return (
    <div>
      <div className="mb-6 flex gap-2">
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all',
              filter === f ? 'bg-accent-gold-soft text-accent-gold-deep shadow-soft' : 'bg-white text-brand-light hover:text-brand-dark'
            )}
          >
            {f} {f === 'unread' ? `(${data.filter((m) => !m.read).length})` : `(${data.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card-lux flex flex-col items-center py-20 text-center">
          <MessageSquare size={40} className="text-brand-light/40" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-brand-light">No messages here yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => markRead(m)}
            className={cn('card-lux p-6 text-left transition-all', !m.read && 'border-accent-gold/40 shadow-gold')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg font-semibold text-brand-dark">{m.fullName}</h3>
                <p className="text-[11px] text-brand-light/60">{formatDate(m.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip-gold">
                  <Tag size={11} />
                  {m.service || 'General'}
                </span>
                {!m.read && <span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />}
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm text-brand-light">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-accent-gold-deep" />
                {m.phone}
              </p>
              {m.email && (
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-accent-gold-deep" />
                  {m.email}
                </p>
              )}
            </div>
            <p className="mt-3 rounded-xl bg-secondary-bg/60 px-4 py-3 text-sm leading-relaxed text-brand-dark/85">
              {m.message}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
