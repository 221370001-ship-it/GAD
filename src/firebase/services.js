import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const COLLECTIONS = {
  treatments: 'treatments',
  deals: 'deals',
  products: 'products',
  appointments: 'appointments',
  messages: 'messages',
  orders: 'orders',
  invoices: 'invoices',
  reviews: 'reviews',
  aiLeads: 'aiRecommendations',
  mail: 'mail',
  counters: 'counters',
};

/* ---------------- Generic CRUD ---------------- */

export async function fetchCollection(name, { orderByField = 'createdAt', direction = 'desc' } = {}) {
  const ref = collection(db, name);
  let q;
  try {
    q = query(ref, orderBy(orderByField, direction));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    const snap = await getDocs(ref);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

export async function createDocument(name, data) {
  const ref = collection(db, name);
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function updateDocument(name, id, data) {
  const ref = doc(db, name, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(name, id) {
  const ref = doc(db, name, id);
  await deleteDoc(ref);
}

/* ---------------- Appointments ---------------- */

export async function createAppointment(appointmentData) {
  const payload = { ...appointmentData, status: 'pending', createdAt: serverTimestamp() };
  const ref = collection(db, COLLECTIONS.appointments);
  const docRef = await addDoc(ref, payload);
  await sendAdminNotification(appointmentData);
  return docRef.id;
}

/* ---------------- Orders (Products) ---------------- */

export async function createOrder(orderData) {
  const payload = { ...orderData, status: 'new', createdAt: serverTimestamp() };
  const ref = collection(db, COLLECTIONS.orders);
  const docRef = await addDoc(ref, payload);
  await sendAdminNotification({
    type: 'product-order',
    fullName: orderData.fullName,
    phone: orderData.phone,
    detail: `Order: ${orderData.productName} — Rs ${orderData.price}`,
    address: orderData.address,
  });
  return docRef.id;
}

/* ---------------- Contact messages ---------------- */

export async function createMessage(messageData) {
  const payload = { ...messageData, read: false, createdAt: serverTimestamp() };
  const ref = collection(db, COLLECTIONS.messages);
  return (await addDoc(ref, payload)).id;
}

/* ---------------- Client reviews ---------------- */

export async function createReview(reviewData) {
  const payload = { ...reviewData, status: 'new', createdAt: serverTimestamp() };
  const ref = collection(db, COLLECTIONS.reviews);
  return (await addDoc(ref, payload)).id;
}

/* ---------------- Invoices (immutable snapshot + counter) ---------------- */

export async function generateInvoiceNumber() {
  const counterRef = doc(db, COLLECTIONS.counters, 'invoices');
  const year = new Date().getFullYear();
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const next = ((snap.exists() && snap.data().count) || 0) + 1;
    tx.set(counterRef, { count: next }, { merge: true });
    return `INV-${year}-${String(next).padStart(4, '0')}`;
  });
}

export async function createInvoice(invoiceData, billedBy) {
  const invoiceNumber = await generateInvoiceNumber();
  const payload = {
    ...invoiceData,
    invoiceNumber,
    status: 'completed',
    billedBy: billedBy || 'staff',
    createdAt: serverTimestamp(),
  };
  const ref = collection(db, COLLECTIONS.invoices);
  const docRef = await addDoc(ref, payload);
  return { id: docRef.id, invoiceNumber };
}

/* ---------------- AI recommender lead ---------------- */

export async function createAiLead(leadData) {
  const ref = collection(db, COLLECTIONS.aiLeads);
  return (await addDoc(ref, { ...leadData, createdAt: serverTimestamp() })).id;
}

/* ---------------- Email notification (Firebase "Trigger Email" extension) ----------------
   Writes to the `mail` collection; the extension picks it up and delivers.
   If the extension is not installed, documents simply accumulate harmlessly. */
export async function sendAdminNotification(data) {
  try {
    const to = import.meta.env.VITE_ADMIN_EMAIL || 'admin@gadaesthetics.com';
    const lines =
      data.type === 'video'
        ? [
            `New VIDEO consultation request.`,
            `Name: ${data.fullName}`,
            `Phone: ${data.phone}`,
            `Age/Gender: ${data.age || '-'} / ${data.gender || '-'}`,
            `Concern: ${data.primaryConcern || '-'}`,
            `Preferred: ${data.date || '-'} ${data.time || '-'}`,
            `Fee: Rs. 1500`,
            data.paymentScreenshotUrl ? `Payment screenshot: ${data.paymentScreenshotUrl}` : null,
          ]
        : data.type === 'product-order'
          ? [`New product order.`, `Name: ${data.fullName}`, `Phone: ${data.phone}`, data.detail || '', `Address: ${data.address || '-'}`]
          : [
              `New ${data.type || 'physical'} consultation request.`,
              `Name: ${data.fullName}`,
              `Phone: ${data.phone}`,
              `Age/Gender: ${data.age || '-'} / ${data.gender || '-'}`,
              `Concern: ${data.primaryConcern || '-'}`,
              `Preferred: ${data.date || '-'} ${data.time || '-'}`,
            ];
    const ref = collection(db, COLLECTIONS.mail);
    await addDoc(ref, {
      to,
      message: {
        subject: `GAD Clinic — New ${data.type === 'video' ? 'Video Consultation' : data.type === 'product-order' ? 'Product Order' : 'Consultation'} Request`,
        text: lines.filter(Boolean).join('\n'),
        html: lines.filter(Boolean).map((l) => `<p>${l}</p>`).join(''),
      },
    });
  } catch {
    /* notification is best-effort; booking already saved */
  }
}

/* ---------------- Seed starter data (one click from admin dashboard) ----------------
   Categories + Treatments are OVERWRITTEN with the official price list (source of truth).
   Deals + Products are only seeded when their collections are empty. */

const slugId = (prefix, text) =>
  `${prefix}-${String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`.slice(0, 90);

export async function seedStarterData(seed) {
  const results = { categories: 0, treatments: 0, deals: 0, products: 0 };

  for (const key of ['categories', 'treatments']) {
    const ref = collection(db, COLLECTIONS[key]);
    const existing = await getDocs(query(ref));
    for (const d of existing.docs) {
      await deleteDoc(d.ref);
    }
    for (const item of seed[key]) {
      const id =
        key === 'categories'
          ? slugId('cat', item.slug)
          : slugId(item.categorySlug, item.name);
      const { slug, ...rest } = item;
      await setDoc(doc(db, COLLECTIONS[key], id), { ...rest, createdAt: serverTimestamp() });
      results[key] += 1;
    }
  }

  for (const key of ['deals', 'products']) {
    const ref = collection(db, COLLECTIONS[key]);
    const existing = await getDocs(query(ref));
    if (!existing.empty) continue;
    for (const item of seed[key]) {
      const id = slugId(key.slice(0, 1), item.id || item.name || item.title);
      const { id: _omit, ...rest } = item;
      await setDoc(doc(db, COLLECTIONS[key], id), { ...rest, createdAt: serverTimestamp() });
      results[key] += 1;
    }
  }

  return results;
}

export async function isCollectionEmpty(name) {
  const snap = await getDocs(query(collection(db, name)));
  return snap.empty;
}

export { collection, doc, query, where, orderBy, getDocs, serverTimestamp };
