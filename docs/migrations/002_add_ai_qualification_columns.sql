-- Migration: Add AI Qualification Columns to Leads Table
-- Phase 1 Step 6: AI Qualification Node
-- Run this in Supabase SQL Editor

-- Add AI qualification columns
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_score INTEGER,
ADD COLUMN IF NOT EXISTS classification VARCHAR(10),
ADD COLUMN IF NOT EXISTS estimated_value NUMERIC,
ADD COLUMN IF NOT EXISTS urgency VARCHAR(10),
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS recommended_action TEXT,
ADD COLUMN IF NOT EXISTS ai_scored_at TIMESTAMPTZ;

-- Add check constraints for data integrity
ALTER TABLE leads
DROP CONSTRAINT IF EXISTS classification_check;

ALTER TABLE leads
ADD CONSTRAINT classification_check 
CHECK (classification IN ('HOT', 'WARM', 'COLD', 'UNSCORED'));

ALTER TABLE leads
DROP CONSTRAINT IF EXISTS urgency_check;

ALTER TABLE leads
ADD CONSTRAINT urgency_check 
CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', NULL));

-- Add comment for documentation
COMMENT ON COLUMN leads.lead_score IS 'AI-generated score 0-100 based on budget, timeline, and project specificity';
COMMENT ON COLUMN leads.classification IS 'AI classification: HOT (70+), WARM (40-69), COLD (<40), or UNSCORED (AI failed)';
COMMENT ON COLUMN leads.estimated_value IS 'Estimated project value in dollars based on budget range';
COMMENT ON COLUMN leads.urgency IS 'Timeline urgency: HIGH (ASAP/1mo), MEDIUM (1-3mo), LOW (3mo+)';
COMMENT ON COLUMN leads.ai_summary IS 'AI-generated 1-2 sentence summary of the lead';
COMMENT ON COLUMN leads.recommended_action IS 'AI-recommended next action for sales team';
COMMENT ON COLUMN leads.ai_scored_at IS 'Timestamp when AI scoring was performed';

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'leads' 
  AND column_name IN (
    'lead_score', 
    'classification', 
    'estimated_value', 
    'urgency', 
    'ai_summary', 
    'recommended_action',
    'ai_scored_at'
  )
ORDER BY ordinal_position;
