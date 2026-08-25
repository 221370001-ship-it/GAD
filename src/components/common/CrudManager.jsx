import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Search, ImageIcon } from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { createDocument, updateDocument, deleteDocument } from '../../firebase/services';
import { uploadToCloudinary, validateImage } from '../../utils/cloudinaryUploader';
import { useToast } from '../../context/ToastContext';
import { GoldSpinner } from '../common/Spinner';
import PlaceholderImage from '../common/PlaceholderImage';
import { formatPrice, cn } from '../../utils/helpers';

function FieldRenderer({ field, value, onChange }) {
  const common = { className: 'input-lux', value: value ?? '', onChange: (e) => onChange(e.target.value) };
  return (
    <div className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className="label-lux">
        {field.label} {field.required && <span className="text-accent-gold-deep">*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea className="input-lux min-h-[100px] resize-y" placeholder={field.placeholder} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'select' ? (
        <select {...common}>
          <option value="">Select…</option>
          {field.options.map((o) => {
            const val = typeof o === 'object' ? o.value : o;
            const lbl = typeof o === 'object' ? o.label : o;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      ) : (
        <input type={field.type || 'text'} placeholder={field.placeholder} {...common} />
      )}
    </div>
  );
}

/**
 * Reusable admin CRUD module: live Firestore list + add/edit modal with
 * Cloudinary image upload + delete confirmation.
 */
export default function CrudManager({ collectionName, entityLabel, fields, defaults, renderRow, tableHead, searchKeys, previewSeed = 0 }) {
  const { data, loading } = useCollection(collectionName);
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // doc being edited or null for new
  const [form, setForm] = useState(defaults);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      (searchKeys || []).some((k) => String(item[k] || '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  useEffect(() => {
    if (modalOpen) return;
    setEditing(null);
    setForm(defaults);
    setFile(null);
    setImagePreview(null);
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  function openAdd() {
    setEditing(null);
    setForm(defaults);
    setImagePreview(null);
    setFile(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ ...defaults, ...item });
    setImagePreview(item.image || null);
    setFile(null);
    setModalOpen(true);
  }

  function pickImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateImage(f, 8);
    if (err) {
      toast(err, 'error');
      return;
    }
    setFile(f);
    setImagePreview(URL.createObjectURL(f));
  }

  async function save(e) {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => {
      if (f.required && !String(form[f.name] ?? '').trim()) errs[f.name] = `${f.label} is required.`;
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      let payload = { ...form };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;

      if (file) {
        const upload = await uploadToCloudinary(file, { folder: `gadaesthetics/${collectionName}` });
        payload.image = upload.secureUrl;
      }

      // numeric coercion
      fields.forEach((f) => {
        if (f.type === 'number' && payload[f.name] !== '' && payload[f.name] !== undefined) {
          payload[f.name] = Number(payload[f.name]);
        }
      });

      if (editing) {
        await updateDocument(collectionName, editing.id, payload);
        toast(`${entityLabel} updated successfully!`, 'success');
      } else {
        await createDocument(collectionName, payload);
        toast(`${entityLabel} added successfully!`, 'success');
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast(err.message || `Could not save ${entityLabel.toLowerCase()}. Please try again.`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteDocument(collectionName, deleting.id);
      toast(`${entityLabel} deleted.`, 'success');
      setDeleting(null);
    } catch (err) {
      console.error(err);
      toast('Could not delete. Please try again.', 'error');
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-light/50" />
          <input
            className="input-lux pl-10"
            placeholder={`Search ${entityLabel.toLowerCase()}s…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={openAdd} className="btn-gold shrink-0">
          <Plus size={16} />
          Add New {entityLabel}
        </button>
      </div>

      {/* Table */}
      <div className="card-lux overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-dark/8 bg-secondary-bg/70 text-[11px] font-bold uppercase tracking-widest text-brand-light">
                {tableHead.map((h) => (
                  <th key={h} className="px-5 py-4">
                    {h}
                  </th>
                ))}
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={tableHead.length + 1} className="px-5 py-14 text-center">
                    <GoldSpinner size={24} className="mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={tableHead.length + 1} className="px-5 py-14 text-center text-brand-light">
                    No {entityLabel.toLowerCase()}s found. Click "Add New {entityLabel}" to create the first one.
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-brand-dark/5 transition-colors last:border-0 hover:bg-secondary-bg/40">
                  {renderRow(item, { formatPrice })}
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/15 text-brand-light transition-all hover:border-accent-gold hover:text-accent-gold-deep"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleting(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/15 text-rose-500/80 transition-all hover:border-rose-400 hover:bg-rose-50"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-brand-deep/50 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => !saving && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-4xl bg-primary-bg p-6 shadow-lift sm:rounded-4xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-heading text-2xl font-semibold text-brand-dark">
                  {editing ? `Edit ${entityLabel}` : `Add New ${entityLabel}`}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 text-brand-light transition-colors hover:bg-secondary-bg hover:text-brand-dark"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={save} className="space-y-5">
                {/* Image upload */}
                <div>
                  <label className="label-lux">
                    Image <span className="normal-case tracking-normal text-brand-light/60">(uploads to Cloudinary)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-brand-dark/10">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <PlaceholderImage className="h-full w-full" seed={previewSeed} />
                      )}
                    </div>
                    <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-accent-gold/40 bg-accent-gold-soft/30 px-4 py-5 text-center transition-colors hover:border-accent-gold hover:bg-accent-gold-soft/60">
                      <ImageIcon size={20} className="text-accent-gold-deep" />
                      <span className="text-xs font-semibold text-brand-dark">
                        {file ? file.name : 'Click to select an image (JPG / PNG / WebP)'}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={pickImage} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {fields.map((f) => (
                    <FieldRenderer
                      key={f.name}
                      field={f}
                      value={form[f.name]}
                      onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
                    />
                  ))}
                </div>
                {Object.keys(errors).length > 0 && (
                  <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                    Please fill all required fields.
                  </p>
                )}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn-gold min-w-[160px]">
                    {saving ? <GoldSpinner size={16} className="border-white/30 border-t-white" /> : null}
                    {saving ? (file ? 'Uploading & saving…' : 'Saving…') : editing ? 'Save Changes' : `Add ${entityLabel}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-brand-deep/50 p-6 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-4xl bg-primary-bg p-8 text-center shadow-lift"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <Trash2 size={22} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-brand-dark">Are you sure?</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-light">
                This will permanently delete{' '}
                <span className="font-bold text-brand-dark">
                  {deleting.name || deleting.title || 'this item'}
                </span>{' '}
                from {collectionName}. This action cannot be undone.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <button onClick={() => setDeleting(null)} className="btn-ghost" disabled={deletingBusy}>
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingBusy}
                  className={cn(
                    'inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-rose-600 disabled:opacity-60'
                  )}
                >
                  {deletingBusy ? <GoldSpinner size={15} className="border-white/40 border-t-white" /> : null}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
