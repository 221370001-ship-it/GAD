import CrudManager from '../../components/common/CrudManager';

const FIELDS = [
  { name: 'image', label: 'Product Image', type: 'image' },
  { name: 'name', label: 'Product Name', required: true, placeholder: 'e.g. GAD Vitamin C 15% Serum', colSpan: 2 },
  { name: 'originalPrice', label: 'Original Price (Rs)', type: 'number', required: true, placeholder: '4500' },
  { name: 'discountedPrice', label: 'Discounted Price (Rs)', type: 'number', required: true, placeholder: '3500' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short product description…', colSpan: 2 },
];

export default function AdminProducts() {
  return (
    <CrudManager
      collectionName="products"
      entityLabel="Product"
      fields={FIELDS}
      defaults={{ name: '', originalPrice: '', discountedPrice: '', description: '', image: '' }}
      searchKeys={['name']}
      previewSeed={2}
      tableHead={['Product', 'THEN', 'NOW']}
      renderRow={(p, { formatPrice }) => (
        <>
          <td className="px-5 py-3">
            <div className="flex items-center gap-3">
              {p.image ? (
                <img src={p.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold-soft font-heading text-sm font-bold text-accent-gold-deep">
                  {(p.name || '?').charAt(0)}
                </span>
              )}
              <span className="max-w-[240px] truncate font-bold text-brand-dark">{p.name}</span>
            </div>
          </td>
          <td className="px-5 py-3 text-brand-light/70 line-through">{formatPrice(p.originalPrice)}</td>
          <td className="px-5 py-3 font-bold text-brand-dark">{formatPrice(p.discountedPrice)}</td>
        </>
      )}
    />
  );
}
