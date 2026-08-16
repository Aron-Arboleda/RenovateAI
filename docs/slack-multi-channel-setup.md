# Slack Multi-Channel Webhook Setup Guide

## Overview

This guide shows how to create separate Slack webhooks for different lead types:

- **#hot-leads** - Immediate action required (HOT classification)
- **#warm-leads** - Follow up within 2-3 days (WARM classification)
- **#system-alerts** - AI failures and errors (UNSCORED classification)

---

## Step 1: Create Your Slack Channels

1. Open your Slack workspace
2. Click the **+** next to "Channels" in the sidebar
3. Create these 3 channels:
   - `hot-leads` - For urgent, high-value leads
   - `warm-leads` - For qualified leads that need follow-up
   - `system-alerts` - For technical issues and errors

---

## Step 2: Create Slack App (One Time Setup)

1. Go to https://api.slack.com/apps
2. Click **"Create New App"**
3. Select **"From scratch"**
4. App Name: `RenovateAI Lead Alerts`
5. Pick your workspace
6. Click **"Create App"**

---

## Step 3: Create Webhook for HOT Leads

1. In your app settings, click **"Incoming Webhooks"** (left sidebar)
2. Toggle **"Activate Incoming Webhooks"** to **ON**
3. Scroll down and click **"Add New Webhook to Workspace"**
4. **Select channel:** `#hot-leads`
5. Click **"Allow"**
6. Copy the webhook URL that appears (starts with `https://hooks.slack.com/services/...`)
7. **Save this as:** `SLACK_WEBHOOK_HOT`

Example: `https://hooks.slack.com/services/T01234ABC/B01234DEF/abcd1234efgh5678ijkl`

---

## Step 4: Create Webhook for WARM Leads

1. Still on the "Incoming Webhooks" page
2. Click **"Add New Webhook to Workspace"** again
3. **Select channel:** `#warm-leads`
4. Click **"Allow"**
5. Copy the new webhook URL
6. **Save this as:** `SLACK_WEBHOOK_WARM`

---

## Step 5: Create Webhook for System Alerts

1. Click **"Add New Webhook to Workspace"** one more time
2. **Select channel:** `#system-alerts`
3. Click **"Allow"**
4. Copy the webhook URL
5. **Save this as:** `SLACK_WEBHOOK_ERRORS`

---

## Step 6: Add to n8n Environment Variables

You now have 3 webhook URLs. Add them to your n8n environment:

### Option A: PowerShell (Before Starting n8n)

```powershell
# Set all webhook URLs
$env:SLACK_WEBHOOK_HOT = "https://hooks.slack.com/services/YOUR/HOT/WEBHOOK"
$env:SLACK_WEBHOOK_WARM = "https://hooks.slack.com/services/YOUR/WARM/WEBHOOK"
$env:SLACK_WEBHOOK_ERRORS = "https://hooks.slack.com/services/YOUR/ERROR/WEBHOOK"

# Keep existing env vars
$env:GOOGLE_GEMINI_API_KEY = "your_existing_gemini_key"
$env:SUPABASE_URL = "your_existing_supabase_url"
$env:SUPABASE_SECRET_KEY = "your_existing_supabase_key"

# Start n8n
n8n start
```

### Option B: Add to `~/.n8n/.env` File (Recommended)

1. Navigate to your n8n home directory (usually `C:\Users\YourName\.n8n\`)
2. Create or edit `.env` file
3. Add all webhook URLs:

```env
# Slack Webhooks (Multi-Channel)
SLACK_WEBHOOK_HOT=https://hooks.slack.com/services/YOUR/HOT/WEBHOOK
SLACK_WEBHOOK_WARM=https://hooks.slack.com/services/YOUR/WARM/WEBHOOK
SLACK_WEBHOOK_ERRORS=https://hooks.slack.com/services/YOUR/ERROR/WEBHOOK

# Existing credentials
GOOGLE_GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_service_role_key
```

4. Save and restart n8n

---

## Step 7: Verify Environment Variables

After restarting n8n, verify in PowerShell:

```powershell
# Check all webhook URLs are set
echo $env:SLACK_WEBHOOK_HOT
echo $env:SLACK_WEBHOOK_WARM
echo $env:SLACK_WEBHOOK_ERRORS
```

Each should output the respective webhook URL (not empty).

---

## Step 8: Test Each Webhook

Before updating the n8n workflow, test each webhook manually:

### Test HOT Leads Webhook

```powershell
$body = @{
    text = "🔥 Test: HOT leads webhook working!"
} | ConvertTo-Json

Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_HOT -Method Post -Body $body -ContentType "application/json"
```

Check `#hot-leads` channel - you should see the message!

### Test WARM Leads Webhook

```powershell
$body = @{
    text = "🎯 Test: WARM leads webhook working!"
} | ConvertTo-Json

Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_WARM -Method Post -Body $body -ContentType "application/json"
```

Check `#warm-leads` channel for the message.

### Test System Alerts Webhook

```powershell
$body = @{
    text = "⚠️ Test: System alerts webhook working!"
} | ConvertTo-Json

Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_ERRORS -Method Post -Body $body -ContentType "application/json"
```

Check `#system-alerts` channel for the message.

---

## Troubleshooting

### "Invalid webhook URL" error

- **Cause:** Webhook URL is incorrect or expired
- **Fix:** Regenerate webhook in Slack app settings

### No message appears in channel

- **Cause:** App not installed to workspace or webhook deactivated
- **Fix:** Go to Slack app settings → Incoming Webhooks → verify "Active" is ON

### "channel_not_found" error

- **Cause:** Channel was deleted or renamed
- **Fix:** Recreate webhook pointing to existing channel

### Environment variable is empty

- **Cause:** n8n started before setting env vars
- **Fix:** Set variables first, then start n8n

---

## Next Step

Once all 3 webhooks are tested and working, I'll update the n8n workflow to use them! 🚀
