# Phase 1 Step 5 - Supabase Database Write

## What changed

Workflow now writes validated leads into Supabase before returning success.

Flow:

1. Webhook
2. Validate Payload
3. If valid -> Prepare Lead Record -> Insert Lead (Supabase)
4. Build DB Result Response -> Respond Result
5. If invalid -> Build Validation Error Response -> Respond Result

## Required Supabase setup

Create a table named leads in your Supabase project:

```sql
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget text not null,
  location text not null,
  timeline text not null,
  description text not null,
  source text not null default 'form',
  created_at timestamptz not null default now()
);
```

## Required n8n environment variables

Set these on your n8n host (local or Azure):

- SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
- SUPABASE_SECRET_KEY=YOUR_SECRET_KEY

Compatibility fallback:

- SUPABASE_SERVICE_ROLE_KEY is still accepted by the workflow if you are using older key naming.

Security note:

- Keep SUPABASE_SECRET_KEY only on n8n server side.
- Never expose it in frontend env files.

## Test checklist

1. Re-import workflow file n8n/workflows/01-lead-intake-mvp.json.
2. Activate test mode in n8n workflow.
3. Submit one valid payload to webhook-test URL.
4. Expect 200 response with message Lead payload accepted and saved.
5. Confirm one row appears in Supabase table public.leads.
6. Submit invalid email payload.
7. Expect 400 response and no new Supabase row.

## Troubleshooting

If you get this error:

- Could not find the '' column of 'leads' in the schema cache

Use this checklist:

1. Re-import the latest workflow JSON so the HTTP node uses explicit JSON body mode.
2. Verify table columns exist exactly as named in this workflow:
   - name
   - email
   - phone
   - project_type
   - budget
   - location
   - timeline
   - description
   - source
   - created_at
3. Run this SQL in Supabase SQL Editor to confirm:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'leads'
order by ordinal_position;
```

4. If the schema was just changed, retry after a short delay so PostgREST schema cache refreshes.

## Azure note

If n8n is hosted in Azure, set SUPABASE_URL and SUPABASE_SECRET_KEY in the Container App (or VM) environment settings and restart the n8n service.
