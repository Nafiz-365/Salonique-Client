# Salonique Client

Salonique is a responsive salon appointment booking platform. Customers can browse services, request appointments, and pay for confirmed bookings. Administrators manage the service catalog, appointments, customers, and transactions.

## Features

- Public service browsing with search, category filters, and price sorting
- Better Auth email/password and optional Google sign-in
- Separate customer and admin dashboards
- Appointment requests, status management, and customer profiles
- Stripe-hosted Checkout with webhook-confirmed payments
- Admin service, customer, appointment, and transaction management

## Technology

- Next.js 16 and React
- TypeScript and Tailwind CSS
- Better Auth with MongoDB
- Express API (separate server repository)
- Stripe Checkout and ImgBB image hosting

## Local Development

1. Install dependencies with `npm install`.
2. Configure the environment variable names below in `.env.local`.
3. Start the Express server in the separate server repository.
4. Run `npm run dev` and open `http://localhost:3000`.

## Environment Variables

Set values locally or in the deployment environment. Never commit actual credentials.

- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `API_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `GOOGLE_CLIENT_ID` (optional)
- `GOOGLE_CLIENT_SECRET` (optional)
- `IMGBB_API_KEY` (recommended; the legacy `NEXT_PUBLIC_IMGBB_API_KEY` is also read only by the server upload route)

## Links

- Live website: Not verified; add the deployed URL before submission
- Client repository: https://github.com/Nafiz-365/Salonique-Client
- Server repository: https://github.com/Nafiz-365/Salonique-Server
