import CrudManager from '../../components/common/CrudManager';

const FIELDS = [
  { name: 'image', label: 'Category Image', type: 'image' },
  { name: 'name', label: 'Category Name', required: true, placeholder: 'e.g. Glam Facials', colSpan: 2 },
  { name: 'slug', label: 'URL Slug', required: true, placeholder: 'e.g. glam-facials', colSpan: 2 },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: 'e.g. 1' },
];

export default function AdminCategories() {
  return (
    <CrudManager
      collectionName="categories"
      entityLabel="Category"
      fields={FIELDS}
      defaults={{ name: '', slug: '', order: '', image: '' }}
      searchKeys={['name', 'slug']}
      previewSeed={0}
      tableHead={['Category', 'Slug', 'Order']}
      renderRow={(c) => (
        <>
          <td className="px-5 py-3">
            <div className="flex items-center gap-3">
              {c.image ? (
                <img src={c.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold-soft font-heading text-sm font-bold text-accent-gold-deep">
                  {(c.name || '?').charAt(0)}
                </span>
              )}
              <span className="max-w-[220px] truncate font-bold text-brand-dark">{c.name}</span>
            </div>
          </td>
          <td className="px-5 py-3 font-mono text-xs text-brand-light">{c.slug}</td>
          <td className="px-5 py-3 text-brand-light">{c.order ?? '—'}</td>
        </>
      )}
    />
  );
}
