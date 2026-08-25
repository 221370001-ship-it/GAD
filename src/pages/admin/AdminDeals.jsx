import CrudManager from '../../components/common/CrudManager';

const FIELDS = [
  { name: 'image', label: 'Deal Image', type: 'image' },
  { name: 'title', label: 'Deal Title', required: true, placeholder: 'e.g. Bridal Glow Package', colSpan: 2 },
  {
    name: 'includedTreatments',
    label: 'Included Treatments',
    required: true,
    placeholder: 'Comma separated: 12-Step Hydra Facial, Hollywood Peel Face',
    colSpan: 2,
  },
  { name: 'duration', label: 'Duration', placeholder: 'e.g. 2 sessions · ~3 hrs' },
  { name: 'originalPrice', label: 'Original Price (Rs)', type: 'number', required: true, placeholder: '55000' },
  { name: 'discountedPrice', label: 'Discounted Price (Rs)', type: 'number', required: true, placeholder: '35000' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short elegant description…', colSpan: 2 },
];

export default function AdminDeals() {
  return (
    <CrudManager
      collectionName="deals"
      entityLabel="Deal"
      fields={FIELDS}
      defaults={{ title: '', includedTreatments: '', duration: '', originalPrice: '', discountedPrice: '', description: '', image: '' }}
      searchKeys={['title']}
      previewSeed={1}
      tableHead={['Deal', 'Includes', 'THEN', 'NOW']}
      renderRow={(d, { formatPrice }) => (
        <>
          <td className="px-5 py-3">
            <div className="flex items-center gap-3">
              {d.image ? (
                <img src={d.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-gold-soft font-heading text-sm font-bold text-accent-gold-deep">
                  {(d.title || '?').charAt(0)}
                </span>
              )}
              <span className="max-w-[200px] truncate font-bold text-brand-dark">{d.title}</span>
            </div>
          </td>
          <td className="max-w-[260px] px-5 py-3 text-brand-light">
            {Array.isArray(d.includedTreatments) ? d.includedTreatments.join(', ') : d.includedTreatments}
          </td>
          <td className="px-5 py-3 text-brand-light/70 line-through">{formatPrice(d.originalPrice)}</td>
          <td className="px-5 py-3 font-bold text-brand-dark">{formatPrice(d.discountedPrice)}</td>
        </>
      )}
    />
  );
}
