# 🛒 verdeback Ecommerce

Ultra-fast browsing experience built with Next.js App Router and DummyJSON.

## 🚀 Quick start

- Dev: `npm run dev`
- Preview (prod): `npm run preview` (builds and starts)

App URLs
- Home: `/`
- Product detail: `/product/[id]`

## 📦 Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Zod (validation)

## ⚡ Performance choices
- Server fetches with `revalidate: 3600` for product list/details
- Minimal, static loaders (no shimmer) for instant feedback
- First visible images use `priority` and responsive `sizes`
- `next/image` configured via `images.remotePatterns`

## 🧪 Snappiness metrics
Open the browser console for [VITALS] logs:
- LCP / INP / CLS via Web Vitals
- navStart → loadingShown → contentPaint timestamps and deltas

Targets
- Cold LCP: ≤ ~2s (preview/prod)
- Cached nav perceived delay: ≤ 200ms

## 🔧 Scripts
- `npm run dev` – start dev server
- `npm run build` – build production assets
- `npm run preview` – build and start production server

## 📝 Notes
- Loaders avoid animations to reduce jank on low‑end devices
- Background prefetch is conservative to prevent server thrash

Enjoy the snappy browsing! ✨
