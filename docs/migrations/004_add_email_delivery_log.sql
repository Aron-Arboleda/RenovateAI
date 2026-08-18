-- Phase 3: one immutable delivery log entry for every generated email.
CREATE TABLE IF NOT EXISTS public.lead_emails (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id bigint NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  classification varchar(10) NOT NULL CHECK (classification IN ('HOT', 'WARM', 'COLD')),
  subject text NOT NULL,
  body_html text NOT NULL,
  delivery_status text NOT NULL CHECK (delivery_status IN ('sent', 'failed')),
  provider_message_id text,
  sent_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_emails_lead_id_sent_at_idx
  ON public.lead_emails (lead_id, sent_at DESC);
