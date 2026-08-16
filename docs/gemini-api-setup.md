# Google Gemini API Setup Guide

## Overview

The workflow now uses **Google Gemini 1.5 Flash** for real-time lead qualification instead of mock data. This guide explains how to configure the API key and test the integration.

## Environment Variable Setup

### Option 1: n8n Environment Variables (Recommended for Production)

1. **Stop n8n** if it's running
2. **Set the environment variable** before starting n8n:

#### Windows (PowerShell):

```powershell
$env:GOOGLE_GEMINI_API_KEY = "YOUR_API_KEY_HERE"
n8n start
```

#### Windows (Command Prompt):

```cmd
set GOOGLE_GEMINI_API_KEY=YOUR_API_KEY_HERE
n8n start
```

#### macOS/Linux:

```bash
export GOOGLE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
n8n start
```

### Option 2: n8n .env File (Recommended for Local Development)

1. Navigate to your n8n home directory (usually `~/.n8n`)
2. Create or edit `.env` file:

```bash
GOOGLE_GEMINI_API_KEY=YOUR_API_KEY_HERE
```

3. Restart n8n

### Option 3: Docker Environment Variable

If running n8n in Docker:

```bash
docker run -it --rm \
  -e GOOGLE_GEMINI_API_KEY=YOUR_API_KEY_HERE \
  -e SUPABASE_URL=YOUR_SUPABASE_URL \
  -e SUPABASE_SECRET_KEY=YOUR_SUPABASE_KEY \
  -p 5678:5678 \
  n8nio/n8n
```

## API Configuration Details

### Model Used

- **Model**: `gemini-1.5-flash`
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Cost**: Free tier includes 15 requests/minute, 1500 requests/day, 1M tokens/day

### Generation Parameters

```json
{
  "temperature": 0.3, // Low temp for consistent scoring
  "topK": 1, // Focus on most likely tokens
  "topP": 0.8, // Nucleus sampling
  "maxOutputTokens": 1024, // Sufficient for structured JSON
  "responseMimeType": "application/json" // Force JSON output
}
```

## Workflow Structure

The updated workflow has 3 AI-related nodes:

1. **Prepare AI Prompt** (Code node)
   - Formats lead data into a structured prompt
   - Includes scoring guidance for Gemini

2. **Call Gemini API** (HTTP Request node)
   - Sends POST request to Gemini API
   - Uses `GOOGLE_GEMINI_API_KEY` from environment
   - Timeout: 10 seconds
   - Never errors (returns response even on failure)

3. **Parse AI Response** (Code node)
   - Extracts JSON from Gemini's response structure
   - Validates required fields (`leadScore`, `classification`)
   - **Fallback handling**: If API fails, returns:
     ```json
     {
       "classification": "UNSCORED",
       "lead_score": null,
       "ai_summary": "AI scoring failed: [error message]",
       "recommended_action": "Manual review required - AI unavailable"
     }
     ```

## Testing the Integration

### 1. Verify Environment Variable

```bash
# In PowerShell (where n8n is running)
echo $env:GOOGLE_GEMINI_API_KEY
```

Should output your API key (not empty).

### 2. Import Updated Workflow

1. Open n8n at `http://localhost:5678`
2. Go to Workflows
3. Delete old "01 Lead Intake MVP" workflow
4. Click "Import from File"
5. Select `n8n/workflows/01-lead-intake-mvp.json`
6. Activate the workflow

### 3. Test with Sample Lead

Submit a test lead through the frontend form:

**HOT Lead Test** (should score 70+):

```json
{
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "phone": "555-0123",
  "projectType": "Full Kitchen Remodel",
  "budget": "$50k+",
  "timeline": "ASAP / Within 1 month",
  "location": "San Francisco, CA",
  "description": "We need a complete kitchen renovation including new cabinets, countertops, appliances, and flooring. The current layout is inefficient and we want to create an open-concept design with an island. Timeline is urgent as we're hosting a family event in 6 weeks."
}
```

**WARM Lead Test** (should score 40-69):

```json
{
  "name": "Mike Chen",
  "email": "mike@example.com",
  "phone": "555-0456",
  "projectType": "Bathroom Renovation",
  "budget": "$25k-$50k",
  "timeline": "1-3 months",
  "location": "Seattle, WA",
  "description": "Looking to update our master bathroom with modern fixtures and a walk-in shower."
}
```

**COLD Lead Test** (should score <40):

```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "phone": "555-0789",
  "projectType": "General Inquiry",
  "budget": "Not sure yet",
  "timeline": "Just researching",
  "location": "Austin, TX",
  "description": "Thinking about home improvements."
}
```

### 4. Verify AI Response in Supabase

Check your `leads` table for the new columns:

```sql
SELECT
  name,
  lead_score,
  classification,
  urgency,
  ai_summary,
  recommended_action,
  ai_scored_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;
```

## Troubleshooting

### Error: "GOOGLE_GEMINI_API_KEY is undefined"

- **Cause**: Environment variable not set before n8n started
- **Fix**: Set the variable and restart n8n (see Option 1 above)

### Error: "API returned 400 Bad Request"

- **Cause**: Invalid API key
- **Fix**: Verify your API key at https://aistudio.google.com/app/apikey

### Error: "API returned 429 Too Many Requests"

- **Cause**: Exceeded free tier rate limits (15 req/min)
- **Fix**: Wait 1 minute or upgrade to paid tier

### AI Returns "UNSCORED" Classification

- **Cause**: API call failed, but lead was still saved (by design)
- **Check**: n8n execution log for error details
- **Fix**: Verify API key and network connectivity

### AI Scores Don't Match Expectations

- **Cause**: Gemini's interpretation may vary
- **Fix**: Adjust prompt in "Prepare AI Prompt" node to be more explicit about scoring criteria

## API Key Management

### Security Best Practices

- ✅ Store API key in environment variables, never hardcode
- ✅ Add `.env` to `.gitignore`
- ✅ Use different API keys for development vs production
- ✅ Monitor API usage at https://aistudio.google.com/app/apikey
- ❌ Never commit API keys to version control

### Rate Limits (Free Tier)

- **Per minute**: 15 requests
- **Per day**: 1,500 requests
- **Token limit**: 1M tokens/day

For high-volume production use, consider:

1. Upgrading to paid tier
2. Implementing request caching
3. Adding rate limiting in the frontend

## Cost Estimation

**Free Tier** (Current setup):

- Cost: $0/month
- Capacity: ~1,500 leads/day
- Sufficient for: MVP, demo, portfolio

**Paid Tier** (If you exceed free tier):

- Gemini 1.5 Flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
- Estimated: ~500 tokens per lead (input + output)
- Cost for 10,000 leads/month: ~$1.50

Compare to OpenAI GPT-4o-mini: ~$0.50/1M tokens (similar pricing)

## Next Steps

After confirming AI qualification works:

1. ✅ Proceed to Phase 1 Step 7: Add Slack notification for HOT leads
2. Consider adding AI confidence scores to the output
3. A/B test different prompt variations to optimize scoring accuracy
4. Add analytics dashboard to track classification distribution
