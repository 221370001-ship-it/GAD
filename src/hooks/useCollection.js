import { useEffect, useState } from 'react';
import { collection, onSnapshot, query as fsQuery } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Real-time Firestore subscription hook.
 * Usage:
 *   useCollection('treatments')                          // all docs
 *   useCollection('treatments', fsQuery(ref, where(...))) // custom query
 * Returns { data, loading, error } — stays in sync with Firestore.
 */
export default function useCollection(collectionName, buildQuery) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return undefined;
    setLoading(true);

    const baseRef = collection(db, collectionName);
    const ref = typeof buildQuery === 'function' ? buildQuery(baseRef, fsQuery) : baseRef;

    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn(`Firestore listener error on "${collectionName}":`, err.message);
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}
