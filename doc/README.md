# Salon App — Salon Management Portal

Admin and salon-side application for the Salon Booking platform.

## Overview

- **Salon management** — Profile, staff, services, branches
- **Bookings & calendar** — Appointments, availability
- **Promotions** — Create and manage offers, analytics
- **Customers** — View bookings and history

## Documentation

- [Salon Profile Update](SALON_PROFILE_UPDATE.md) — Profile fields, image optimization, completion requirements

## Stack

- React + Vite, TypeScript
- Redux, MUI
- Backend API: see [backend/docs/](../../backend/docs/)

## Run

```bash
npm install
npm run dev
```

API base URL is configured via environment (e.g. `VITE_APP_BASE_URL`).
