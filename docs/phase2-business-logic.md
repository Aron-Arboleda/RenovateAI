# Phase 2 — Business Logic Layer

## What is included

- The form has a hidden `website` honeypot field. Humans never see it; bots that fill it are rejected.
- The workflow uses `upsert_recent_lead` instead of inserting directly. Matching email or phone values from the previous 30 days update one record and increment `submission_count`.
- HOT and WARM Slack routes already exist in the workflow; COLD records are saved with the `Nurture` status and follow the no-alert route. This makes all three tiers visible in an n8n execution.
- `/leads` is a live, read-only dashboard using Supabase's REST API.

## Deploy checklist

1. In Supabase SQL Editor, run [`003_phase2_business_logic.sql`](migrations/003_phase2_business_logic.sql) after migration 002.
2. Re-import [`01-Lead-Intake-MVP.json`](../n8n/workflows/01-Lead-Intake-MVP.json) into Azure n8n and activate it. It retains the same webhook path and environment-variable setup, but its Supabase write node now calls the RPC function.
3. In Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy. The dashboard is available at `https://YOUR_VERCEL_DOMAIN/leads`.
4. The included SELECT policy exposes lead data to anyone who knows the dashboard URL. Keep that URL private for this portfolio demo. For a production app, replace it with Supabase Auth and an authenticated policy.

## Verify

1. Submit the same lead twice. The dashboard should show one row with `Duplicate updated` and a submission count of 2.
2. Submit a valid-looking lead using a disposable domain such as `mailinator.com`; the workflow must return a visible rejection and create no row.
3. Test one HOT, one WARM, and one COLD lead. HOT goes to the hot Slack route, WARM to the warm Slack route, and COLD is saved as `Nurture` without a Slack alert.
