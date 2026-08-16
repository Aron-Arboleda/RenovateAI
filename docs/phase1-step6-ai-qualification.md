# Phase 1 Step 6: AI Qualification Node

## Overview

Add AI-powered lead scoring and classification to the workflow. For MVP, we're using a **mock AI node** with realistic scoring logic that can be replaced with real OpenAI/Claude later.

## Database Schema Update

Run this SQL in Supabase to add AI qualification columns:

```sql
-- Add AI qualification columns to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_score INTEGER,
ADD COLUMN IF NOT EXISTS classification VARCHAR(10),
ADD COLUMN IF NOT EXISTS estimated_value NUMERIC,
ADD COLUMN IF NOT EXISTS urgency VARCHAR(10),
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS recommended_action TEXT,
ADD COLUMN IF NOT EXISTS ai_scored_at TIMESTAMPTZ;

-- Add a check constraint for classification values
ALTER TABLE leads
ADD CONSTRAINT classification_check
CHECK (classification IN ('HOT', 'WARM', 'COLD', 'UNSCORED'));

-- Add a check constraint for urgency values
ALTER TABLE leads
ADD CONSTRAINT urgency_check
CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', NULL));

-- Verify columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
```

## Mock AI Scoring Logic

The mock node uses this business logic (same rules a real AI would apply):

### Score Calculation (0-100):

- **Budget scoring** (40 points max):
  - "$50k+": 40 points
  - "$25k-$50k": 30 points
  - "$10k-$25k": 20 points
  - "Under $10k": 10 points
  - "Not sure yet": 5 points

- **Timeline urgency** (30 points max):
  - "ASAP / Within 1 month": 30 points
  - "1-3 months": 20 points
  - "3-6 months": 10 points
  - "6+ months": 5 points
  - "Just researching": 2 points

- **Project specificity** (30 points max):
  - Description > 100 chars: 30 points
  - Description 50-100 chars: 20 points
  - Description < 50 chars: 10 points

### Classification Rules:

- **HOT**: score >= 70
- **WARM**: score >= 40 and < 70
- **COLD**: score < 40

### Urgency Mapping:

- "ASAP / Within 1 month" → HIGH
- "1-3 months" → MEDIUM
- "3-6 months" or "6+ months" → LOW
- "Just researching" → LOW

### Estimated Value:

- Parse budget string and estimate project value (conservative):
  - "$50k+": $60,000
  - "$25k-$50k": $35,000
  - "$10k-$25k": $17,500
  - "Under $10k": $7,500
  - "Not sure yet": $15,000 (average fallback)

## Workflow Changes

### New Nodes:

1. **Mock AI Qualification** (Code node) - after "Prepare Lead Record"
2. **Merge AI Results** (Code node) - combines lead data with AI output
3. **Update connections** - AI node sits between preparation and database insert

### Fallback Handling:

If the AI node fails (later when using real API):

- Set `classification: "UNSCORED"`
- Set `lead_score: null`
- Still save the lead to database
- Log the error for manual review

## Testing Checklist

After implementing:

- [ ] Submit a high-budget + urgent timeline lead → should score HOT (70+)
- [ ] Submit a medium-budget + relaxed timeline → should score WARM (40-69)
- [ ] Submit a low-budget + "just researching" → should score COLD (<40)
- [ ] Verify all AI columns appear in Supabase with correct data
- [ ] Check that database insert still works if AI node is disabled (UNSCORED fallback)

## Future: Real AI Integration

To swap mock for real AI later:

1. Add OpenAI credential in n8n (API key)
2. Replace "Mock AI Qualification" node with "OpenAI" node
3. Use this prompt:

```
You are a lead qualification assistant for a home renovation company.

Analyze this lead and return ONLY valid JSON matching this schema:
{
  "leadScore": 0-100,
  "classification": "HOT" | "WARM" | "COLD",
  "estimatedValue": number,
  "urgency": "LOW" | "MEDIUM" | "HIGH",
  "summary": "1-2 sentence summary",
  "recommendedAction": "short string"
}

Scoring guidance:
- Higher budgets increase score
- Urgent timelines increase score
- Detailed project descriptions increase score
- HOT: score >= 70, WARM: 40-69, COLD: <40

Lead data:
Project Type: {{$json.leadRecord.project_type}}
Budget: {{$json.leadRecord.budget}}
Timeline: {{$json.leadRecord.timeline}}
Location: {{$json.leadRecord.location}}
Description: {{$json.leadRecord.description}}
```

4. Set response format to JSON mode (structured output)
5. Keep the same "Merge AI Results" node structure
