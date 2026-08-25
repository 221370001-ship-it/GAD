# GAD Aesthetic Clinic — Full Platform

Luxury, mobile-first medical-aesthetic platform for **GAD Aesthetic Clinic (by Dr. Abdullah Asif)**.

**Stack:** React 18 (Vite) · Tailwind CSS · Framer Motion · Firebase (Auth + Firestore) · Cloudinary

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

## One-Time Setup (important)

### 1. Create the admin user in Firebase
Firebase Console → **Authentication → Sign-in method → enable Email/Password**, then
**Users → Add user**:

| Field | Value |
|---|---|
| Email | `admin@gadaesthetics.com` (must match `VITE_ADMIN_EMAIL` in `.env`) |
| Password | anything you choose, e.g. `admingad` |

On the login page (`/admin`) you can then sign in with **username `admingad`** (auto-mapped to
that email) or with the full email address.

### 2. Seed the catalogue
Log in → **Admin Dashboard → "Seed Starter Data"**. This fills the empty
`treatments`, `deals`, `products` collections with the official GAD price list
(THEN/NOW pricing). Existing documents are never overwritten.

### 3. Cloudinary
The `.env` already contains cloud `frbrngr7` + unsigned preset `GADaesthetics`.
Make sure the preset is **Unsigned** in Cloudinary → Settings → Upload presets.
The **API secret stays server-side only** (no `VITE_` prefix ⇒ never bundled into the client).

### 4. (Optional) Email notifications
Install the Firebase **"Trigger Email"** extension. Every booking/order writes a formatted
message to the `mail` collection, which the extension delivers to `VITE_ADMIN_EMAIL`.

### 5. Firestore Rules (recommended starting point)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // public can read catalogue + create leads/orders/messages/appointments
    match /treatments/{id}   { allow read: if true; allow write: if request.auth != null; }
    match /deals/{id}        { allow read: if true; allow write: if request.auth != null; }
    match /products/{id}     { allow read: if true; allow write: if request.auth != null; }
    match /appointments/{id} { allow create: if true; allow read, update, delete: if request.auth != null; }
    match /orders/{id}       { allow create: if true; allow read, update, delete: if request.auth != null; }
    match /messages/{id}     { allow create: if true; allow read, update, delete: if request.auth != null; }
    match /aiRecommendations/{id} { allow create: if true; allow read: if request.auth != null; }
    match /reviews/{id}      { allow create: if true; allow read: if request.auth != null; }
    match /invoices/{id}     { allow read, create: if request.auth != null; }
    match /counters/{id}     { allow read, write: if request.auth != null; }
    match /mail/{id}         { allow create: if true; allow read: if false; }
  }
}
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Home — hero, booking funnel (physical + video), AI teaser, doctor, Google-review marquee, 4-step journey, map |
| `/treatments` | Category grid → treatment cards (THEN / NOW pricing) → booking modal |
| `/deals` | Package deals + booking modal |
| `/products` | Skincare collection + order form (saved to `orders`) |
| `/about` | Brand story, philosophy, management, contact form + Google Map |
| `/ai-recommender` | 8-step AI funnel → 3s analysis animation → scored recommendations from the live Firestore catalogue |
| `/admin` | Admin login (Firebase Auth) |
| `/admin-dashboard` | Stats, recent activity, one-click catalogue seeding |
| `/admin/appointments` | Consultation requests — status workflow, payment-screenshot links, WhatsApp shortcut |
| `/admin/treatments` `/deals` `/products` | Full CRUD — image uploads go **directly to Cloudinary**, returned URL is stored in Firestore |
| `/admin/orders` `/messages` `/invoices` | Order fulfilment, inbox, invoice history |
| `/soft` | Billing POS — live catalogue search, cart, discounts, immutable invoice snapshots (`INV-YYYY-0001`) |

## Data Flow (images)

```
Admin form (file input)
      │  POST (unsigned, cloud name + preset only)
      ▼
   Cloudinary  ──returns secure_url──▶  saved into Firestore document
```

## Notes
- All credentials live in `.env` (git-ignored). `.env.example` documents every variable.
- The Cloudinary API secret is intentionally **not** prefixed with `VITE_` so Vite never
  exposes it to the browser bundle.
- Firestore listeners keep the public site in real-time sync with admin changes.
