# Salonique Client

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Better_Auth-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

Salonique Client is the Next.js web application for the Salonique salon-booking platform. Customers can discover services, request appointments, manage their profiles, and pay for confirmed bookings. Administrators can manage services, appointments, users, and transactions.

The Express API is maintained separately in [Nafiz-365/Salonique-Server](https://github.com/Nafiz-365/Salonique-Server).

## Features

- Responsive service discovery with category, search, price, location, and availability filters.
- Public service detail pages with appointment date and time selection; signing in is required only to request an appointment.
- Customer dashboard for appointments and profile settings.
- Admin dashboard for services, appointments, users, and the transaction ledger.
- Email/password authentication, with optional Google sign-in.
- Stripe Checkout integration for confirmed appointments.
- Server-side upload endpoint for service and profile images through ImgBB.

## Technology

| Area           | Tools                                                  |
| -------------- | ------------------------------------------------------ |
| Framework      | Next.js 16 App Router                                  |
| UI             | React 19, TypeScript, Tailwind CSS 4                   |
| Components     | Base UI primitives, Lucide icons, Sonner notifications |
| Authentication | Better Auth with MongoDB and JWT plugins               |
| Backend access | Next.js BFF routes forwarding to the Express API       |
| Payments       | Stripe Checkout, initiated by the backend              |

Turbopack and the React Compiler are enabled in `next.config.ts`.

## Architecture

```text
Browser
  ├─ Public service pages ──► Express API (server-side fetch)
  ├─ Authenticated actions ─► Next.js BFF ──► Express API
  │                              └─ attaches the Better Auth JWT
  ├─ Sign-in/session ────────► Better Auth ──► MongoDB
  └─ Checkout ───────────────► Next.js checkout route ──► Express / Stripe
                                                        ▲
Stripe webhook ─────────────────────────────────────────┘
```

- Public catalog requests use server-side helpers in `src/lib/server-api.ts`. Service lists and details are fetched without caching; featured services use a 60-second revalidation interval.
- API-backed customer and admin operations use `/api/backend/*`. The BFF checks the Better Auth session, attaches a JWT, and forwards the request to Express.
- Checkout starts through `/api/checkout-sessions`, which verifies the session, customer role, and request origin before forwarding the request.
- The client does not connect to MongoDB for application data. MongoDB is used here by Better Auth; service, appointment, and transaction data are managed by the Express API.

## Routes

| Route                         | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `/`                           | Home and featured services                       |
| `/services`                   | Public service catalog                           |
| `/services/[id]`              | Public service details and authenticated booking |
| `/sign-in`, `/sign-up`        | Authentication                                   |
| `/dashboard`                  | Customer overview                                |
| `/dashboard/appointments`     | Customer appointment history and details         |
| `/dashboard/profile`          | Customer profile and settings                    |
| `/admin`                      | Admin overview                                   |
| `/admin/services`             | Service management                               |
| `/admin/appointments`         | Appointment management                           |
| `/admin/users`                | User management                                  |
| `/admin/transactions`         | Transaction ledger                               |
| `/admin/profile`              | Admin profile                                    |
| `/help`, `/privacy`, `/terms` | Support and policy pages                         |

Admin and customer dashboard pages are checked in `src/proxy.ts`. Service details are public; booking requires a customer session and is independently authorized by the Express API. Frontend route checks are not a replacement for backend authorization.

## Getting Started

### Prerequisites

- Node.js 20.9 or newer and npm.
- MongoDB access for Better Auth.
- A running Salonique Server instance for catalog and booking features.

### Install

```bash
git clone https://github.com/Nafiz-365/Salonique-Client.git
cd Salonique-Client
npm ci
```

Create a `.env.local` file in the project root and configure the variables below. Keep all credentials out of source control.

Start the Express API in its repository, then start the client:

```bash
# In the Salonique-Server repository
npm run dev

# In this repository
npm run dev
```

The client is available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable                   | Required   | Purpose                                                                                                                                                                                  |
| -------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`              | Yes        | MongoDB connection used by Better Auth. Both applications should use the same `salonique` database.                                                                                      |
| `BETTER_AUTH_SECRET`       | Production | Better Auth signing secret. Set a strong, private value in production; development has a local fallback.                                                                                 |
| `BETTER_AUTH_URL`          | No         | Canonical server-side Better Auth URL; defaults to `http://localhost:3000`.                                                                                                              |
| `NEXT_PUBLIC_APP_URL`      | No         | Public app origin used by client auth and canonical SEO URLs, `robots.txt`, and the sitemap; defaults to `http://localhost:3000`. Set this to the deployed website origin in production. |
| `API_BASE_URL`             | No         | Server-only Express API URL for BFF and checkout requests; defaults to `http://localhost:8000`.                                                                                          |
| `NEXT_PUBLIC_API_BASE_URL` | No         | Express API URL for public catalog fetches; defaults to `http://localhost:8000`. This is a public URL, not a secret.                                                                     |
| `GOOGLE_CLIENT_ID`         | Optional   | Enables Google sign-in when configured together with `GOOGLE_CLIENT_SECRET`.                                                                                                             |
| `GOOGLE_CLIENT_SECRET`     | Optional   | Google OAuth client secret. Keep it server-side.                                                                                                                                         |
| `IMGBB_API_KEY`            | Optional   | Enables image uploads through `/api/upload-image`.                                                                                                                                       |

`NEXT_PUBLIC_IMGBB_API_KEY` is recognized for legacy configurations, but a server-only `IMGBB_API_KEY` is recommended. `NODE_ENV` is managed by Next.js.

## Scripts and Checks

```bash
npm run dev           # Start the development server
npm run lint          # Run ESLint
npx tsc --noEmit      # Run the TypeScript checker
npm run build         # Create the production build
npm run start         # Serve the production build
```

Run lint, type-check, and build separately before submitting changes. The `build` script runs `next build`; it does not invoke ESLint. No automated test script is currently defined in `package.json`.

## Security Notes

- Keep `.env`, `.env.local`, OAuth credentials, and other secrets out of Git.
- Better Auth sessions and JWTs are handled server-side by the BFF; do not put private tokens in `NEXT_PUBLIC_*` variables.
- `src/proxy.ts` provides page-level redirects for missing sessions and incorrect roles. Express remains the authority for protected API requests.
- The checkout route checks the request origin and customer session. The server verifies payment through signed Stripe webhook events; a browser redirect alone does not confirm payment.
- Configure Google OAuth callback URLs and production origins to match the deployed application.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/          # Better Auth handler
│   │   ├── backend/[...path]/      # BFF proxy to Express
│   │   ├── checkout-sessions/      # Authenticated checkout bootstrap
│   │   └── upload-image/           # ImgBB upload endpoint
│   ├── admin/                      # Admin pages
│   ├── dashboard/                  # Customer pages
│   ├── services/                   # Catalog and service details
│   └── ...                         # Home, auth, checkout, help, legal
├── components/
│   ├── admin/                      # Admin layout and components
│   ├── common/                     # Shared site components
│   ├── dashboard/                  # Customer layout and components
│   ├── home/                       # Home page sections
│   ├── services/                   # Service UI
│   └── ui/                         # Shared Base UI wrappers
├── context/AuthContext.tsx         # Client-side auth state
├── lib/
│   ├── auth.ts                     # Better Auth server configuration
│   ├── auth-client.ts              # Better Auth client
│   └── server-api.ts               # Public API and BFF helpers
└── proxy.ts                        # Protected page routing
```

## Related Repository

- [Salonique Server (Express API)](https://github.com/Nafiz-365/Salonique-Server)
