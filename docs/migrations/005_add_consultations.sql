-- Phase 4: calendar-booking and reminder audit trail.
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS lead_status_check;
ALTER TABLE public.leads ADD CONSTRAINT lead_status_check CHECK (lead_status IN (
  'New', 'Duplicate updated', 'Needs follow-up', 'Nurture', 'Rejected', 'Consultation Booked', 'Consultation Completed'
));

CREATE TABLE IF NOT EXISTS public.consultations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id bigint NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  calendar_event_id text,
  status text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'completed')),
  reminder_24h_sent_at timestamptz,
  reminder_1h_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (calendar_event_id)
);

CREATE INDEX IF NOT EXISTS consultations_due_reminders_idx
  ON public.consultations (starts_at) WHERE status = 'booked';
