# The Vault — Jewelry Storefront (Frontend)

React + Vite + Tailwind + react-three-fiber front end for a 3D, glassmorphic
jewelry storefront, wired to the Spring Boot backend, with a cart, WhatsApp
checkout, and PWA install support for Android.

## Run it

```bash
npm install
cp .env.example .env   # points at the backend, defaults to http://localhost:8080
npm run dev
```

Open http://localhost:5173. Make sure the backend (see `../jewelry-backend`)
is running first — every page except the hero pulls live data from it.

## Build

```bash
npm run build
```

## How the pieces fit together

- **`src/api/`** — `client.js` (fetch wrapper: JSON/multipart, auth header,
  error normalization matching the backend's `{status, message}` shape),
  `products.js` (catalog CRUD, normalizes backend `imageUrl` into a full,
  browser-loadable `image` URL), `auth.js` (signup/login/me)
- **`src/context/AuthContext.jsx`** — session state (token + user), persisted
  to `localStorage` — see the comment in that file for the tradeoff vs.
  memory-only storage
- **`src/context/CartContext.jsx`** — cart state, persisted to `localStorage`,
  independent of login (you can add to cart without an account)
- **`src/components/ProtectedRoute.jsx`** — guards `/admin`; redirects to
  `/login` if signed out, to `/` if signed in but not an admin
- **Pages that now fetch real data:** `Home`, `Shop`, `ProductDetail`,
  `AdminDashboard` — each has `loading` / `error` / `ready` states
- **`Login` / `Signup`** — call the backend, store the session, redirect
  (admins land on `/admin`, everyone else on `/`)
- **`Cart` / product pages** — "Order via WhatsApp" and "Ask about
  customizing" still work exactly as before; they just now use real product
  IDs and prices from the database instead of the old mock data

## Testing the full loop locally

1. Start the backend (`mvn spring-boot:run` in `jewelry-backend`), pointed at
   your Aiven MySQL
2. Log in as the seeded admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from the
   backend's env, defaults to `admin@thevault-jewelry.com` / `ChangeMe123!`)
   at `/login` — you'll land on `/admin`
3. Add a piece with a real image — it'll appear on `/shop` and `/` immediately
4. Sign up a second, normal account to confirm it lands on `/` and can't
   reach `/admin`
5. Add pieces to the cart, go to `/cart`, hit "Order via WhatsApp" — confirm
   the message and total look right before it opens WhatsApp

## Mobile / PWA

Unchanged from before — see the icons in `public/icons/`, the manifest
config in `vite.config.js`, and the sticky mobile action bars on the product
and cart pages. None of that depends on the backend wiring above.

## Known gaps to close before this is production-ready

- No logout-everywhere on token expiry — if the JWT expires mid-session,
  API calls will just start failing with 401s rather than bouncing you to
  `/login` automatically. Worth adding a response interceptor in
  `api/client.js` that calls `logout()` on a 401.
- No "forgot password" flow.
- Category filter on `/shop` is client-side (fetches everything, filters in
  the browser) — fine at small catalog sizes, switch to
  `getProducts(category)` server-side filtering if the catalog grows.
