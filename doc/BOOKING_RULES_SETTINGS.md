# Booking Rules Settings (Salon-App)

This document describes the **Booking Rules** that salon owners can configure in the Salon-App. These settings control how customers book appointments, when they must pay, how far in advance they can book, and policies for cancellation, reschedule, late arrival, and no-shows.

---

## Overview

| # | Rule | Purpose |
|---|------|---------|
| 1 | Advance Payment Rule | Whether customers must pay before booking |
| 2 | Advance Booking Time | How early customers must book before an appointment |
| 3 | Maximum Future Booking | How far in advance customers can book |
| 4 | Service Buffer Time | Extra time before/after a service for preparation |
| 5 | Slot Capacity | How many customers can book the same time slot |
| 6 | Cancellation Policy | When customers can cancel a booking |
| 7 | Reschedule Rule | When customers can change booking time |
| 8 | Late Arrival Rule | What happens if a customer arrives late |
| 9 | No-Show Policy | Rule applied if customer does not show up |

---

## Implementation status (schema & logic)

Status of each rule in backend schema and booking logic:

| Status | Meaning |
|--------|---------|
| ● Schema + logic covered | Implemented in schema and enforced in booking/cancel flows. |
| ◐ Partial | Schema field(s) exist; logic not yet wired (or needs one more field). |
| ○ Missing | Not in schema; must add fields and implement enforcement. |

| # | Rule | Status | Schema fields | Notes |
|---|------|--------|---------------|--------|
| 1 | Advance Payment | ○ Missing | `salons.advance_payment_rule` (String? enum: `MUST`, `OPTIONAL`, `NONE`), `advance_payment_type` (String? enum: `FIXED`, `PERCENTAGE`), `advance_payment_value` (Decimal?) | No payment requirement at booking today. Need fields on `salons` (or `salon_settings`) and enforcement in `createBooking`: block confirmation if `MUST` until payment recorded in `payments`. |
| 2 | Advance Booking Time | ◐ Partial | `salons.min_notice_minutes` (Int?, default 30) | Field added; logic **not yet wired** in `createBooking` (Task 9). UI presets 30 min / 1 hr / 2 hr; field stores minutes. |
| 3 | Maximum Future Booking | ◐ Partial | `salons.max_advance_days` (Int?, default 30) | Field added; logic **not yet wired** (Task 9). UI presets 7 / 30 / 90 days; field stores integer days. |
| 4 | Service Buffer Time | ◐ Partial | `services.buffer_minutes` (Int, default 0) | Field added; used in slot generation (Task 2). Buffer is applied **after** the service (gap to next slot). |
| 5 | Slot Capacity / Same Slot Booking Limit | ● Schema + logic covered | `salon_settings.max_bookings_per_slot` (Int?, default 1), `services.capacity` (Int, default 1) | Salon-level **max bookings per slot** caps how many customers can book the same time slot; effective capacity = min(max_bookings_per_slot, service.capacity). Enforced in getAvailableSlots and createBooking. |
| 6 | Cancellation Policy | ○ Missing | `salons.cancellation_hours` (Int?, default 3), `late_cancel_fee_type` (String? enum: `NONE`, `FIXED`, `PERCENTAGE`), `late_cancel_fee_value` (Decimal?) | `cancelBooking` has no policy check. Need fields + enforcement: if `hours_until_appointment < cancellation_hours` apply late cancel fee or block. |
| 7 | Reschedule Rule | ○ Missing | `salons.reschedule_hours` (Int?, default 2) | No reschedule endpoint. Need field + `PATCH /api/bookings/:id/reschedule` (check window, re-run availability, new slot hold, swap time). UI in salon-app and user-app. |
| 8 | Late Arrival Rule | ○ Missing | `salons.late_arrival_action` (String? enum: `GRACE`, `AUTO_CANCEL`, `SHORTEN`), `late_arrival_grace_minutes` (Int?, default 10) | Not in schema or logic. AUTO_CANCEL needs cron: `now > start_time + grace_minutes` and still CONFIRMED → auto-cancel. SHORTEN is mainly staff display in salon-app. |
| 9 | No-Show Policy | ○ Missing | `salons.noshow_block_count` (Int?, default 3), `salons.noshow_action` (String? enum: `BLOCK`, `CHARGE`, `RESTRICT`), **new table** `salon_customer_flags` | Not in schema. Need: (1) salon fields, (2) table to track per-customer no-show count and blocked status per salon, (3) `createBooking` check to reject if customer blocked at salon, (4) staff action in salon-app to mark NO_SHOW and trigger policy. |

---

## 1. Advance Payment Rule

Controls whether customers must pay before a booking is confirmed.

| Option | Meaning |
|--------|---------|
| **Must Pay** | Booking confirmed only after advance payment. |
| **Optional** | Customer may pay now or at the salon. |
| **No Need** | No advance payment required. |

**Optional fields** (when advance payment is required or optional):

| Field | Description |
|-------|-------------|
| Advance payment type | **Fixed Amount** or **Percentage** |
| Advance payment value | Numeric value (e.g. amount in currency or %). |

**Example**

- Advance Payment: **Must**
- Amount: **30%**

---

## 2. Advance Booking Time

Defines how **early** customers must book before an appointment (minimum notice).

| Setting | Meaning |
|---------|---------|
| 30 minutes | Must book at least 30 minutes before |
| 1 hour | Must book at least 1 hour before |
| 2 hours | Must book at least 2 hours before |

**Example**

- Minimum Advance Booking: **1 hour**

---

## 3. Maximum Future Booking

Controls how **far in advance** customers can book (maximum future date).

| Setting | Meaning |
|---------|---------|
| 7 days | Customers can book up to 7 days ahead |
| 30 days | Customers can book up to 1 month ahead |
| 90 days | Customers can book up to 3 months ahead |

**Example**

- Maximum Future Booking: **30 days**

---

## 4. Service Buffer Time

Extra time **after** a service for cleanup or preparation before the next slot (slot engine uses duration + buffer as block size).

| Service | Duration | Buffer |
|---------|----------|--------|
| Haircut | 30 min | 5 min |
| Facial | 60 min | 10 min |

**Example setting**

- Buffer Time: **10 minutes**

---

## 5. Slot Capacity / Same Slot Booking Limit (IMPORTANT)

Controls how many customers can book the **same time slot**. This is a **salon-level** setting that applies to each time slot (e.g. 10:00).

| Slot Time | Capacity | Allowed Bookings |
|-----------|----------|------------------|
| 10:00 | 1 | Only one booking |
| 10:00 | 2 | Two bookings allowed |
| 10:00 | 5 | Five bookings allowed |

**Salon setting**

- **Maximum bookings per slot:** 1, 2, 3, 5, or custom (e.g. 2).

**Example scenario**

- Service: Haircut  
- Slot: 10:00  
- Capacity = 2  

**Bookings**

- Customer A → 10:00  
- Customer B → 10:00  

**Next booking**

- Customer C → 10:00 ❌ Slot full  

The effective limit per slot is the **minimum** of:

1. **Salon setting:** Maximum bookings per slot (e.g. 2)  
2. **Service setting:** Per-service capacity (e.g. `services.capacity` = 3 for a group service)  

So if the salon sets “max 2 per slot” and a service has capacity 3, only 2 customers can book that slot for that service.

---

## 6. Cancellation Policy

Controls **when** customers can cancel a booking (deadline before appointment).

| Setting | Meaning |
|---------|---------|
| 1 hour before | Cancel allowed up to 1 hour before |
| 3 hours before | Cancel allowed up to 3 hours before |
| 24 hours before | Cancel allowed up to 1 day before |

**Example**

- Cancellation allowed: **3 hours before appointment**

---

## 7. Reschedule Rule

Controls **when** customers can change their booking time (deadline before appointment).

**Example**

- Reschedule allowed until: **2 hours before appointment**

---

## 8. Late Arrival Rule

Defines what happens if a customer **arrives late**.

| Option | Meaning |
|--------|---------|
| Allow X minute grace period | Booking still valid if customer arrives within grace time |
| Automatically cancel booking | Late arrival triggers cancellation |
| Shorten service time | Service is shortened to fit remaining slot |

**Example**

- Late arrival grace time: **10 minutes**

---

## 9. No-Show Policy

Rule applied when a customer **does not show up** for their appointment.

| Option | Meaning |
|--------|---------|
| Block customer after X no-shows | After a set number of no-shows, block future bookings |
| Charge advance payment | Retain or charge advance payment on no-show |
| Restrict future bookings | Apply restrictions (e.g. must pay in advance) |

**Example**

- Block customer after: **3 no-shows**

---

## Example: Complete Salon Booking Settings

A full set of booking rules might look like this:

| Rule | Value |
|------|--------|
| **Advance Payment** | Optional |
| **Advance Amount** | 20% |
| **Minimum Advance Booking** | 1 hour |
| **Maximum Future Booking** | 30 days |
| **Buffer Time** | 10 minutes |
| **Maximum bookings per slot** | 2 |
| **Slot Capacity (per service)** | 1 |
| **Cancellation Policy** | 3 hours before |
| **Reschedule Policy** | 2 hours before |
| **Late Arrival Grace Time** | 10 minutes |
| **No-show limit** | 3 |

---

## Related documentation

- Backend booking logic and slot generation: `salon-backed/docs/BOOKING_LOGIC_FLOW.md`
- User-facing booking flow: see user-app booking components and API usage.
