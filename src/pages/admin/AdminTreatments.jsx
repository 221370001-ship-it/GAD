import { useMemo } from 'react';
import CrudManager from '../../components/common/CrudManager';
import useCollection from '../../hooks/useCollection';

export default function AdminTreatments() {
  const { data: categories } = useCollection('categories');

  const catOptions = useMemo(
    () =>
      [...categories]
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map((c) => ({ value: c.slug, label: c.name })),
    [categories]
  );

  const catName = (slug) => categories.find((c) => c.slug === slug)?.name || slug || '—';

  const fields = useMemo(
    () => [
      { name: 'image', label: 'Treatment Image', type: 'image' },
      {
        name: 'categorySlug',
        label: 'Category',
        type: 'select',
        required: true,
        options: catOptions,
      },
      { name: 'name', label: 'Treatment Name', required: true, placeholder: 'e.g. 12-Step Hydra Facial', colSpan: 2 },
      { name: 'duration', label: 'Duration', placeholder: 'e.g. 45–60 mins' },
      { name: 'originalPrice', label: 'Original Price (Rs) — THEN', type: 'number', placeholder: '7500' },
      { name: 'discountedPrice', label: 'Discounted Price (Rs) — NOW', type: 'number', placeholder: '3000' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: '1–2 paragraphs describing the procedure…', colSpan: 2 },
    ],
    [catOptions]
  );

  return (
    <CrudManager
      collectionName="treatments"
      entityLabel="Treatment"
      fields={fields}
      defaults={{ categorySlug: '', name: '', duration: '', originalPrice: '', discountedPrice: '', description: '', image: '' }}
      searchKeys={['name']}
      previewSeed={0}
      tableHead={['Treatment', 'Category', 'THEN', 'NOW', 'Duration']}
      renderRow={(t, { formatPrice }) => (
        <>
          <td className="px-5 py-3">
            <div className="flex items-center gap-3">
              {t.image ? (
                <img src={t.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold-soft font-heading text-sm font-bold text-accent-gold-deep">
                  {(t.name || '?').charAt(0)}
                </span>
              )}
              <span className="max-w-[220px] truncate font-bold text-brand-dark">{t.name}</span>
            </div>
          </td>
          <td className="px-5 py-3 text-brand-light">{catName(t.categorySlug)}</td>
          <td className="px-5 py-3 text-brand-light/70 line-through">
            {t.originalPrice != null ? formatPrice(t.originalPrice) : '—'}
          </td>
          <td className="px-5 py-3 font-bold text-brand-dark">
            {t.discountedPrice != null || t.originalPrice != null
              ? formatPrice(t.discountedPrice ?? t.originalPrice)
              : 'On Consultation'}
          </td>
          <td className="px-5 py-3 text-brand-light">{t.duration || '—'}</td>
        </>
      )}
    />
  );
}
