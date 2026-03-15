# Salon App — Salon Management Portal

Admin and salon-side application for the Salon Booking platform.

## Overview

- **Salon management** — Profile, staff, services, branches
- **Bookings & calendar** — Appointments, availability
- **Promotions** — Create and manage offers, analytics
- **Customers** — View bookings and history

## Documentation

- **[ENV_AND_API_CONFIG.md](./ENV_AND_API_CONFIG.md)** — Environment variables, API base URL, image URLs, and CSP (env-only configuration).
- [Salon Profile Update](SALON_PROFILE_UPDATE.md) — Profile fields, image optimization, completion requirements

## Stack

- React + Vite, TypeScript
- Redux, MUI
- Backend API: see [backend/docs/](../../backend/docs/)

## Run

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables

Copy `.env.example` to `.env` or `.env.development` and set at least:

```env
VITE_APP_BASE_URL=http://localhost:3000/api
```

All API and image URLs are driven by env only. See **[ENV_AND_API_CONFIG.md](./ENV_AND_API_CONFIG.md)** for full details (CSP, image origins, per-environment examples).

3. Start the development server:

```bash
npm run dev
```

Restart the dev server after changing any env file.
