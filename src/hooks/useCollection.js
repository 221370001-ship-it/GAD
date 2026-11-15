import { useEffect, useState } from 'react';
import { collection, onSnapshot, query as fsQuery } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { seedCategories, seedTreatments, seedDeals, seedProducts } from '../utils/seedData';

const FALLBACK_DATA = {
  categories: seedCategories.map((c) => ({ id: `cat-${c.slug}`, ...c })),
  treatments: seedTreatments.map((t) => ({ id: `trt-${t.name.toLowerCase().replace(/\s+/g, '-')}`, ...t })),
  deals: seedDeals.map((d) => ({ id: `deal-${d.title.toLowerCase().replace(/\s+/g, '-')}`, ...d })),
  products: seedProducts.map((p) => ({ id: `prod-${p.name.toLowerCase().replace(/\s+/g, '-')}`, ...p })),
};

/**
 * Real-time Firestore subscription hook.
 * Usage:
 *   useCollection('treatments')                          // all docs
 *   useCollection('treatments', fsQuery(ref, where(...))) // custom query
 * Returns { data, loading, error, isLive } — stays in sync with Firestore.
 * isLive = true  → data is coming from Firestore (real-time)
 * isLive = false → data is static seed fallback (Firestore unavailable)
 */
export default function useCollection(collectionName, buildQuery) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!collectionName) return undefined;
    setLoading(true);
    setIsLive(true);

    const baseRef = collection(db, collectionName);
    const ref = typeof buildQuery === 'function' ? buildQuery(baseRef, fsQuery) : baseRef;

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const fallback = FALLBACK_DATA[collectionName] || [];
        const fallbackMap = new Map(fallback.map((f) => [f.slug || f.name, f]));

        const docs = snap.docs.map((d) => {
          const item = { id: d.id, ...d.data() };
          // Only fill missing image from seedData — do NOT override an existing Firestore image
          if (!item.image) {
            const matched = fallbackMap.get(item.slug || item.name);
            if (matched && matched.image) {
              item.image = matched.image;
            }
          }
          return item;
        });

        // If collection exists in Firestore but is completely empty (0 docs), use fallback
        if (docs.length === 0 && fallback.length > 0) {
          setData(fallback);
          setIsLive(false); // collection empty — showing static data
        } else {
          setData(docs);
          setIsLive(true); // real Firestore data
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn(`[GAD] Firestore listener error on "${collectionName}":`, err.code, err.message);

        // Graceful degradation: use static seed data when Firestore is unreachable
        if (
          err.code === 'permission-denied' ||
          err.message?.includes('Missing or insufficient permissions') ||
          err.code === 'unavailable'
        ) {
          console.info(`[GAD] Falling back to local static data for "${collectionName}". Reason: ${err.code}`);
          if (FALLBACK_DATA[collectionName]) {
            setData(FALLBACK_DATA[collectionName]);
            setIsLive(false); // explicitly mark as not live
            setError(err); // keep error available for diagnostics
          } else {
            setIsLive(false);
            setError(err);
          }
        } else {
          setIsLive(false);
          setError(err);
        }

        setLoading(false);
      }
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error, isLive };
}
