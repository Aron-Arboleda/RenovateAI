# Phase 4 — Booking & Reminders

## Included workflow

- `/book` is a consultation-request page. The Phase 3 email workflow appends a pre-filled booking link using `BOOKING_URL`.
- `02-consultation-booking.json` looks up the submitted lead, creates a 30-minute Google Calendar event, saves it to `consultations`, and sets the lead status to `Consultation Booked`.
- `03-consultation-reminders.json` runs every 15 minutes. It sends a 24-hour or one-hour reminder using Resend and records the send time to prevent duplicate reminders.

## Deployment

1. Run [`005_add_consultations.sql`](migrations/005_add_consultations.sql) in Supabase.
2. In Vercel, set `VITE_N8N_BOOKING_WEBHOOK_URL` to the production webhook URL for `02 Consultation Booking`, then redeploy.
3. In Azure n8n, set `BOOKING_URL=https://YOUR_VERCEL_DOMAIN/book`, `GOOGLE_CALENDAR_ID`, and `GOOGLE_CALENDAR_ACCESS_TOKEN`. The access token is deliberately an environment-variable stub because no Google OAuth credential was supplied. For production, replace the **Create Google Calendar Event** HTTP node with n8n’s Google Calendar node and a connected OAuth2 credential; keep the node’s input/output contract unchanged.
4. Import and activate [02-consultation-booking.json](../n8n/workflows/02-consultation-booking.json) and [03-consultation-reminders.json](../n8n/workflows/03-consultation-reminders.json). The reminder workflow also uses the existing Resend variables from Phase 3.

## Test

Book a consultation through `/book` using an existing lead email. Confirm one Google Calendar event, one `consultations` row, and the lead status update. Create test consultations 24 hours and one hour ahead to verify that reminders fire and their timestamp columns are populated.
