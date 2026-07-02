# The Vault — Jewelry Storefront (Frontend Shell)

React + Vite + Tailwind + react-three-fiber front end for a 3D, glassmorphic
jewelry storefront. This is phase 1 of the full-stack build — UI only, backed
by mock data in `src/data/products.js`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## What's here

- `src/components/Hero3D.jsx` + `GemModel.jsx` — the 3D hero (react-three-fiber
  + drei, a floating transmissive gem with a rotating gold band)
- `src/components/ProductCard.jsx` — the signature interaction: prices are
  hidden behind a frosted glass panel that slides open ("the loupe") as each
  card scrolls into view
- `src/context/ThemeContext.jsx` — light/dark theme, persisted to
  `localStorage`, toggled via the pill switch in the navbar
- `src/pages/AdminDashboard.jsx` — upload form for new jewelry models +
  listings table (currently updates local state only)
- `src/pages/Login.jsx` / `Signup.jsx` — auth UI shells

## Design tokens

- Colors: ink (`#0B0D14` background), pearl (`#F7F5F0` light bg), gold
  (`#C9A15A` accent) — see `tailwind.config.js`
- Type: Fraunces (display/serif), Inter (body), IBM Plex Mono (labels/prices)

## Wiring to the Spring Boot backend (next phase)

Every place that needs a real API call is marked with a `// TODO` comment:

- `src/pages/Login.jsx` -> `POST /api/auth/login`
- `src/pages/Signup.jsx` -> `POST /api/auth/signup`
- `src/pages/AdminDashboard.jsx` -> `POST /api/admin/products` (multipart,
  for image upload)
- `src/data/products.js` -> replace with `GET /api/products` (public) once
  the backend is live; admin listing/detail routes should read from the
  same table via `GET /api/products/{id}`

Recommended auth approach for the Spring Boot side: JWT issued on
login/signup, stored in memory (not localStorage) on the frontend, attached
as `Authorization: Bearer <token>` on admin-only requests. Role field
(`USER` / `ADMIN`) on the user table gates `/api/admin/**` routes via
Spring Security.

## Next steps

1. Spring Boot backend (Maven, no Lombok, Spring Security + JWT)
2. MySQL schema on Aiven (users, products, product_images)
3. Image upload storage (Aiven doesn't host files — use a bucket, e.g. S3/R2,
   or store images as base64/BLOB only for small thumbnails)
4. Replace mock `products.js` with live API calls (React Query or plain
   fetch + `useEffect`)
