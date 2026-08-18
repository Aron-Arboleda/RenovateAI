# Phase 3 — Personalized Communication

The lead-intake workflow now generates a classification-aware email with Gemini, sends it through Resend, and stores the subject, rendered HTML, delivery status, provider ID, and timestamp in `lead_emails`.

## Required setup

1. Run [`004_add_email_delivery_log.sql`](migrations/004_add_email_delivery_log.sql) in Supabase.
2. Add these Azure n8n environment variables, then restart n8n:
   - `RESEND_API_KEY` — a Resend API key.
   - `RESEND_FROM_EMAIL` — a verified sender, for example `RenovateAI <leads@yourdomain.com>`.
3. Import the updated workflow and activate it.

`RESEND_API_KEY` is intentionally an environment variable, never a committed workflow credential. Until those variables are configured, email delivery will log a `failed` event while the lead itself continues through the existing qualification and Slack paths.

## Test matrix

Submit one lead in each tier. HOT replies are prompt and consultation-focused, WARM replies are helpful with a softer follow-up, and COLD replies are low-pressure and educational. In Supabase, inspect `lead_emails` to confirm the submitted project details, email body, and `sent_at` timestamp.
