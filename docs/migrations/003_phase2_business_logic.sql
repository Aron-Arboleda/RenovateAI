-- Phase 2: duplicate-aware lead records and dashboard-safe read access.
-- Run this after 002_add_ai_qualification_columns.sql.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_status text NOT NULL DEFAULT 'New',
  ADD COLUMN IF NOT EXISTS submission_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_submitted_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS lead_status_check;
ALTER TABLE public.leads ADD CONSTRAINT lead_status_check
  CHECK (lead_status IN ('New', 'Duplicate updated', 'Needs follow-up', 'Nurture', 'Rejected'));

CREATE INDEX IF NOT EXISTS leads_email_recent_idx ON public.leads (lower(email), last_submitted_at DESC);
CREATE INDEX IF NOT EXISTS leads_phone_recent_idx ON public.leads (phone, last_submitted_at DESC);

-- Called by the n8n workflow using its service-role key. A matching email OR
-- phone submitted in the last 30 days refreshes a single record; all other
-- submissions create a new record.
CREATE OR REPLACE FUNCTION public.upsert_recent_lead(p_lead jsonb)
RETURNS SETOF public.leads
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id bigint;
BEGIN
  SELECT id INTO existing_id
  FROM public.leads
  WHERE last_submitted_at >= now() - interval '30 days'
    AND (lower(email) = lower(p_lead->>'email') OR phone = p_lead->>'phone')
  ORDER BY last_submitted_at DESC
  LIMIT 1;

  IF existing_id IS NOT NULL THEN
    UPDATE public.leads SET
      name = p_lead->>'name', email = lower(p_lead->>'email'), phone = p_lead->>'phone',
      project_type = p_lead->>'project_type', budget = p_lead->>'budget',
      location = p_lead->>'location', timeline = p_lead->>'timeline',
      description = p_lead->>'description', source = COALESCE(p_lead->>'source', source),
      lead_score = (p_lead->>'lead_score')::integer, classification = p_lead->>'classification',
      estimated_value = (p_lead->>'estimated_value')::numeric, urgency = p_lead->>'urgency',
      ai_summary = p_lead->>'ai_summary', recommended_action = p_lead->>'recommended_action',
      ai_scored_at = (p_lead->>'ai_scored_at')::timestamptz, lead_status = 'Duplicate updated',
      submission_count = submission_count + 1, last_submitted_at = now(), updated_at = now()
    WHERE id = existing_id;
  ELSE
    INSERT INTO public.leads (
      name, email, phone, project_type, budget, location, timeline, description, source,
      lead_score, classification, estimated_value, urgency, ai_summary, recommended_action,
      ai_scored_at, lead_status, submission_count, last_submitted_at, updated_at
    ) VALUES (
      p_lead->>'name', lower(p_lead->>'email'), p_lead->>'phone', p_lead->>'project_type',
      p_lead->>'budget', p_lead->>'location', p_lead->>'timeline', p_lead->>'description',
      COALESCE(p_lead->>'source', 'form'), (p_lead->>'lead_score')::integer,
      p_lead->>'classification', (p_lead->>'estimated_value')::numeric, p_lead->>'urgency',
      p_lead->>'ai_summary', p_lead->>'recommended_action', (p_lead->>'ai_scored_at')::timestamptz,
      CASE p_lead->>'classification' WHEN 'WARM' THEN 'Needs follow-up' WHEN 'COLD' THEN 'Nurture' ELSE 'New' END,
      1, now(), now()
    );
    existing_id := currval(pg_get_serial_sequence('public.leads', 'id'));
  END IF;

  RETURN QUERY SELECT * FROM public.leads WHERE id = existing_id;
END;
$$;

-- The public dashboard uses only the publishable/anon key. Keep this policy
-- restricted to authenticated staff in a production app; this is suitable only
-- for a private, unlinked portfolio dashboard.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portfolio dashboard can read leads" ON public.leads;
CREATE POLICY "portfolio dashboard can read leads"
  ON public.leads FOR SELECT TO anon
  USING (true);
