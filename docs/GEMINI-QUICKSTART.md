# Quick Start: Add Your Gemini API Key

## Step 1: Get Your API Key

1. Go to https://aistudio.google.com/app/apikey
2. Copy your API key

## Step 2: Set Environment Variable

### Windows PowerShell (before starting n8n):

```powershell
$env:GOOGLE_GEMINI_API_KEY = "YOUR_API_KEY_HERE"
n8n start
```

### Or create `.env` file in `~/.n8n/`:

```
GOOGLE_GEMINI_API_KEY=YOUR_API_KEY_HERE
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SECRET_KEY=YOUR_SUPABASE_KEY
```

## Step 3: Re-import Workflow

1. Open n8n: http://localhost:5678
2. Delete old "01 Lead Intake MVP" workflow
3. Import: `n8n/workflows/01-lead-intake-mvp.json`
4. Activate workflow ✅

## Step 4: Test

Submit a form → Check Supabase for `lead_score` and `classification` columns!

---

**Troubleshooting:**

- If you get "undefined" error → restart n8n after setting the env var
- If you get 400 error → check your API key is correct
- If classification is "UNSCORED" → check n8n execution logs for API error

**Full docs:** See `docs/gemini-api-setup.md`
