# Salonique — Client

**Salonique** is a full-stack salon appointment booking platform. This repository contains the **Next.js 16 frontend**: a responsive, production-grade web app where customers discover salon services, book appointments, and pay securely, while administrators manage the entire catalog, schedule, and transaction ledger.

> **Related repositories**
> - Backend API (Express + MongoDB): [`Nafiz-365/Salonique-Server`](https://github.com/Nafiz-365/Salonique-Server) — live at https://salonique-server.onrender.com/
> - Frontend (this repo): [`Nafiz-365/Salonique-Client`](https://github.com/Nafiz-365/Salonique-Client) — live at https://salonique-client.vercel.app/

---

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Security Model](#security-model)
- [Payment Flow](#payment-flow)
- [Features](#features)
- [Verification](#verification)
- [Links](#links)

---

## Highlights

- **Server-side route protection** — Next.js 16 `proxy.ts` (formerly middleware) verifies the session and role on every protected navigation; changing the URL by hand never grants access to another role's dashboard.
- **BFF proxy pattern** — authenticated requests flow through `/api/backend/*`, which attaches the Better Auth JWT automatically; the browser never holds API secrets.
- **Webhook-only payments** — Stripe Checkout for confirmed appointments; `paid` status is written exclusively by verified Stripe webhooks on the server. The client never marks an appointment as paid.
- **Role-based portals** — separate Customer (`/dashboard`) and Admin (`/admin`) dashboards with independent layouts and menus.
- **No native dialogs** — every confirmation uses the design-system `Dialog` + `sonner` toasts; no `alert()` / `confirm()` anywhere.
- **Type-safe, lint-clean, build-verified** — TypeScript + ESLint pass as gates before every build.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16.4.6** (App Router, Turbopack, React Compiler) |
| UI | **React 19.3**, **TypeScript 5**, **Tailwind CSS 4** |
| Components | **Base UI** primitives in shadcn-style wrappers (`src/components/ui/*`), `lucide-react` icons, `sonner` toasts, `embla-carousel` |
| Authentication | **Better Auth** (MongoDB adapter, JWT plugin, optional Google sign-in) |
| Data access | Server-side `fetch` to the Express API — public reads direct, authenticated calls via BFF proxy |
| Payments | **Stripe Checkout** (session created server-side, confirmed by webhook) |
| Images | **ImgBB** uploads through a server route (`/api/upload-image`) |

---

## Architecture

Two distinct API paths keep secrets on the server and public reads fast:

```
                       ┌──────────────────────────────────────────────┐
   Browser ──────────► │  Next.js 16 (this repo)                      │
                       │                                              │
                       │  proxy.ts ── session + role check per route  │
                       │                                              │
                       │  Public reads          Authenticated calls   │
                       │  fetchServices()  │    bffGet/Post/Patch/Delete│
                       └───────┬──────────────────────┬───────────────┘
                               │ direct, no-store     │ /api/backend/*
                               ▼                      ▼  (attaches JWT)
                       ┌──────────────────────────────────────────────┐
                       │  Express API  (Salonique-Server repo)        │
                       │  verifyToken → JWKS JWT + status checks      │
                       │  verifyAdmin → role gate on admin routes     │
                       └───────┬──────────────────────┬───────────────┘
                               │                      │
                               ▼                      ▼
                          MongoDB               Stripe Checkout
                        (services,            (webhook → appointment
                         appointments,          paymentStatus + ledger)
                         users, transactions)
```

**Request flow**

1. **Public data** (`/services`, `/featured-services`, `/service/:id`) — fetched server-side directly from Express with `cache: "no-store"` (or 60 s revalidation for featured items).
2. **Authenticated actions** (booking, appointments, admin operations) — go through the BFF route `src/app/api/backend/[...path]/route.ts`, which resolves the session, injects `Authorization: Bearer <JWT>` (plus an `x-user-email` fallback), and forwards to Express. A small allowlist lets the same route serve public GETs without a session.
3. **Every protected Express endpoint re-verifies** the JWT signature via Better Auth's JWKS endpoint and re-checks role/status — the frontend guards are UX, the backend guards are authoritative.

---

## Project Structure

```
src/
├── app/                       # App Router
│   ├── page.tsx               # Home — HeroSearch, categories, featured, trust
│   ├── services/              # Catalog (search, category, sort, pagination)
│   │   └── [id]/              # Service details + booking form (auth required)
│   ├── sign-in/  sign-up/     # Auth pages (role-based redirect after login)
│   ├── dashboard/             # Customer portal
│   │   ├── appointments/      # My Appointments + Details dialog
│   │   └── profile/           # Customer profile editor
│   ├── admin/                 # Admin portal
│   │   ├── appointments/  services/  users/  transactions/  profile/
│   ├── checkout/              # success / cancel return pages
│   ├── help/  privacy/  terms/
│   └── api/
│       ├── auth/[...all]/     # Better Auth handler
│       ├── backend/[...path]/ # BFF proxy → Express (JWT injection)
│       ├── checkout-sessions/ # Origin-checked Stripe session bootstrap
│       └── upload-image/      # ImgBB upload (5 MB limit)
├── components/
│   ├── home/  services/       # Page sections & cards
│   ├── common/                # Navbar, Footer, SaloniqueMark
│   ├── dashboard/  admin/     # Role-specific layouts
│   ├── checkout/              # CheckoutButton
│   └── ui/                    # Base UI primitives (dialog, table, select, …)
├── context/AuthContext.tsx    # Single client-side auth store
├── lib/
│   ├── auth.ts                # Better Auth server config (password hooks)
│   ├── auth-client.ts         # Better Auth React client
│   ├── server-api.ts          # fetchServices + bffGet/Post/Patch/Delete
│   ├── types.ts  utils.ts  upload-image.ts
└── proxy.ts                   # Route guard (Next 16 middleware replacement)
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- A running **Salonique-Server** instance (see the server repo) with its own `.env`
- MongoDB (Atlas or local) — used by Better Auth in this app

### Installation

```bash
git clone https://github.com/Nafiz-365/Salonique-Client.git
cd Salonique-Client
npm install
```

### Configure environment

Create `.env.local` with the variable **names** listed in the next section and fill in your own values. Never commit `.env` / `.env.local` — they are (and must remain) git-ignored.

### Run

```bash
# 1. Start the Express server first (separate repo)
#    cd ../Salonique-Server && npm run dev

# 2. Start the frontend
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

Set these names locally or in your deployment environment. **Never commit actual credentials.**

| Variable | Scope | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | server | MongoDB connection for the Better Auth adapter |
| `BETTER_AUTH_SECRET` | server | Better Auth signing secret |
| `BETTER_AUTH_URL` | server | Canonical app URL used by Better Auth |
| `NEXT_PUBLIC_APP_URL` | client | Public app origin (auth client base URL) |
| `API_BASE_URL` | server | Express API base for BFF proxy & checkout routes |
| `NEXT_PUBLIC_API_BASE_URL` | client/server | Express API base for public data fetches |
| `GOOGLE_CLIENT_ID` | server | *Optional* — enables Google sign-in |
| `GOOGLE_CLIENT_SECRET` | server | *Optional* — enables Google sign-in |
| `IMGBB_API_KEY` | server | ImgBB image uploads (legacy `NEXT_PUBLIC_IMGBB_API_KEY` also read) |
| `NODE_ENV` | server | `development` / `production` |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload (Turbopack) |
| `npm run build` | Production build (runs lint + type checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over the project |
| `npx tsc --noEmit` | Standalone TypeScript type check |

---

## Security Model

Protection is layered — the frontend guards are never the only line of defense:

| Layer | Where | What it enforces |
| --- | --- | --- |
| 1. Route guard | `src/proxy.ts` | Unauthenticated → `/sign-in?callbackUrl=…`; customers blocked from `/admin`; admins redirected away from `/dashboard`; blocked/suspended users → `/?blocked=1` |
| 2. BFF proxy | `src/app/api/backend/[...path]` | Resolves session server-side, attaches JWT, rejects unauthenticated protected calls with 401, validates request origin for mutations |
| 3. API middleware | Express `verifyToken` / `verifyAdmin` | JWKS signature verification, active-status check, and role enforcement on **every** protected endpoint |

Additional hardening:

- **Password policy** enforced server-side in Better Auth `hooks.before` (≥ 6 chars, one uppercase, one lowercase) and mirrored on the sign-up form.
- **Input validation & mass-assignment allow-lists** on the Express side.
- **Origin checks** on checkout-session creation to block cross-site request forgery.
- **Image uploads** validated (type + 5 MB cap) before forwarding to ImgBB.

---

## Payment Flow

1. Customer requests an appointment → status `pending`, `paymentStatus: unpaid`.
2. Admin confirms it → the customer may pay.
3. `CheckoutButton` → `POST /api/checkout-sessions` (origin + session + role checked) → Express creates a **Stripe Checkout session** → redirect.
4. Success/cancel pages return to `/checkout/success` or `/checkout/cancel`. The success page explicitly states that payment is pending webhook confirmation.
5. Stripe delivers `checkout.session.completed` to the server's signed **`POST /webhook`** — only then are `paymentStatus: paid` and the immutable transaction record written.

No client-side path can mark a payment as complete.

---

## Features

**Customers**
- Browse services with search, category filters, price/duration/rating sorting, and pagination
- Service details with gallery, specialist info, and booking form (date + time-slot picker with double-booking prevention)
- Appointment history with a **Details** dialog, plus self-service cancellation
- Stripe Checkout for confirmed appointments
- Profile editing (name, phone, avatar)

**Administrators**
- Overview dashboard
- Appointment oversight: confirm / cancel across all customers
- Service catalog management (create, edit, activate/deactivate, delete)
- Customer directory with block/unblock controls
- Immutable transaction ledger fed by webhooks

**Platform**
- Email/password auth with optional Google sign-in
- Role-based redirect after sign-in (customer → `/dashboard`, admin → `/admin`)
- Blocked-user handling at login and at the route guard
- Responsive layouts verified at 390 / 768 / 1440 px
- Skeleton loading states, empty states, and toast feedback throughout

---

## Verification

Quality gates run in this order before any submission:

```bash
npm run lint        # ESLint clean
npx tsc --noEmit    # TypeScript clean
npm run build       # Production build succeeds
```

> No unit-test suite is configured yet; correctness is verified through the gates above plus manual end-to-end flows (auth → booking → admin confirm → Stripe test-mode checkout → webhook).

---

## Links

- **Live website**: https://salonique-client.vercel.app/
- **Client repository**: https://github.com/Nafiz-365/Salonique-Client
- **Server repository**: https://github.com/Nafiz-365/Salonique-Server
- **Live API**: https://salonique-server.onrender.com/

---

## License

This project is created for evaluation purposes. All rights reserved.
