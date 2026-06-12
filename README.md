# Frontend — Thangavel Textile

Next.js 15 storefront + admin panel for **Thangavel Textile**.

This is one half of a two-app project. See the **top-level [README.md](../README.md)** for the full guide covering both apps, environment variables, MongoDB Atlas setup, Cloudinary, deployment, and API surface.

## TL;DR

```bash
cp .env.example .env.local           # then edit
npm install
npm run dev                          # → http://localhost:3000
```

The backend (NestJS) needs to be running at the URL set in `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api/v1`). If it isn't, public pages fall back to the static seed data in `src/data/` so the site stays functional, but the admin panel and contact form won't work.
