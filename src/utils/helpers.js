export const CLINIC = {
  name: 'GAD Aesthetic Clinic',
  short: 'GAD',
  tagline: 'AESTHETIC CLINIC',
  founder: 'By Dr. Abdullah Asif',
  doctor: 'Dr. Abdullah Asif',
  doctorTitle: 'CEO & Founder | MBBS, FCPS',
  phone: '0328 6005559',
  phoneRaw: '03286005559',
  whatsapp: '923286005559',
  email: 'gadaesthetics@gmail.com',
  instagram: 'https://instagram.com/gad.aesthetic',
  instagramHandle: 'gad.aesthetic',
  facebook: 'https://facebook.com/gadaesthetics',
  facebookHandle: 'gadaesthetics',
  website: 'www.gadaesthetics.com',
  address: 'Shop#480, B block, Billa Chowk, Satellite Town, Gujranwala',
  hours: [{ days: 'Monday — Sunday', time: '12:00 PM – 9:00 PM' }],
  mapEmbed:
    'https://www.google.com/maps?q=GAD%20Aesthetic%20Clinic%2C%20Billa%20Chowk%2C%20Satellite%20Town%2C%20Gujranwala&z=19&output=embed',
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=GAD%20Aesthetic%20Clinic%2C%20Shop%23480%2C%20B%20block%2C%20Billa%20Chowk%2C%20Satellite%20Town%2C%20Gujranwala',
  videoConsultFee: 1500,
};

export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `Rs ${num.toLocaleString('en-PK')}`;
}

export function discountPercent(original, discounted) {
  const o = Number(original);
  const d = Number(discounted);
  if (!o || Number.isNaN(o) || Number.isNaN(d) || d >= o) return null;
  return `${Math.round(((o - d) / o) * 100)}% OFF`;
}

export function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function isValidPhone(phone) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-sky-100 text-sky-800',
  cancelled: 'bg-rose-100 text-rose-700',
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-emerald-100 text-emerald-800',
};
