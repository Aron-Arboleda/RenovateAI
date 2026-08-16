# Phase 1 Step 7: Slack Notifications

## Overview

Added Slack notifications for HOT leads and AI scoring failures. This ensures immediate alerts when high-priority leads come in or when the AI system encounters issues.

## What Was Added

### New Workflow Nodes

1. **Is HOT Lead?** (IF node)
   - Checks if `classification === "HOT"`
   - Runs after database insert
   - Routes to Slack alert if HOT, otherwise checks for UNSCORED

2. **Send HOT Lead Alert** (HTTP Request node)
   - Posts formatted message to Slack webhook
   - Includes all lead details, score, and AI recommendations
   - Rich formatting with Slack Block Kit

3. **Is UNSCORED?** (IF node)
   - Checks if `classification === "UNSCORED"`
   - Only runs if lead is not HOT
   - Routes to failure alert if UNSCORED

4. **Send AI Failure Alert** (HTTP Request node)
   - Posts alert when AI scoring fails
   - Includes lead details and error message
   - Indicates manual review is needed

### Notification Flow

```
Insert Lead (Supabase)
    ↓
Is HOT Lead?
    ├─ TRUE → Send HOT Lead Alert → Build DB Result Response
    └─ FALSE → Is UNSCORED?
                ├─ TRUE → Send AI Failure Alert → Build DB Result Response
                └─ FALSE → Build DB Result Response (WARM/COLD leads, no alert)
```

## Slack Webhook Setup

### Step 1: Create Slack Webhook

1. Go to https://api.slack.com/apps
2. Click **"Create New App"** → **"From scratch"**
3. Name your app: **"RenovateAI Lead Alerts"**
4. Select your workspace
5. Click **"Incoming Webhooks"** in the left sidebar
6. Toggle **"Activate Incoming Webhooks"** to ON
7. Click **"Add New Webhook to Workspace"**
8. Select the channel where you want alerts (e.g., `#leads` or `#sales`)
9. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

### Step 2: Add to n8n Environment

Add the webhook URL as an environment variable:

#### Windows PowerShell:

```powershell
$env:SLACK_WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE"
```

#### Or add to `~/.n8n/.env`:

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
GOOGLE_GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_key
```

### Step 3: Restart n8n

```powershell
# Stop n8n (Ctrl+C if running in terminal)
# Restart with env vars loaded
n8n start
```

### Step 4: Re-import Workflow

1. Open n8n: http://localhost:5678
2. Delete old "01 Lead Intake MVP" workflow
3. Import: `n8n/workflows/01-Lead-Intake-MVP.json`
4. Activate the workflow ✅

## Notification Examples

### 🔥 HOT Lead Alert

When a HOT lead is submitted, Slack receives:

```
🔥 HOT Lead - Immediate Action Required

Name:           Sarah Johnson
Score:          85/100
Email:          sarah@example.com
Phone:          555-0123
Project:        Full Kitchen Remodel
Budget:         $50k+
Timeline:       ASAP / Within 1 month
Location:       San Francisco, CA

AI Summary:
HOT lead: Full Kitchen Remodel project in San Francisco, CA.
Budget $50k+, timeline ASAP / Within 1 month.

Recommended Action:
Contact within 24 hours - high priority

Urgency: HIGH | Est. Value: $60,000
```

### ⚠️ AI Failure Alert

When AI scoring fails (e.g., API key invalid, rate limit hit):

```
⚠️ AI Scoring Failed - Manual Review Required

Name:           Mike Chen
Email:          mike@example.com
Phone:          555-0456
Project:        Bathroom Renovation
Budget:         $25k-$50k
Timeline:       1-3 months

Error Details:
AI scoring failed: Gemini API error: 401

Lead was saved to database but requires manual qualification
```

## Testing

### Test 1: HOT Lead Notification

Submit a lead that should score HOT (70+):

```json
{
  "name": "Test HOT Lead",
  "email": "test@example.com",
  "phone": "555-1234",
  "projectType": "Full Kitchen Remodel",
  "budget": "$50k+",
  "timeline": "ASAP / Within 1 month",
  "location": "San Francisco, CA",
  "description": "We need a complete kitchen renovation including new cabinets, countertops, appliances, and flooring. The current layout is inefficient and we want to create an open-concept design with an island. Timeline is urgent as we're hosting a family event in 6 weeks."
}
```

**Expected:** Slack notification within 2-3 seconds

### Test 2: WARM/COLD Lead (No Notification)

Submit a lead that should score WARM or COLD (< 70):

```json
{
  "name": "Test WARM Lead",
  "email": "warm@example.com",
  "phone": "555-5678",
  "projectType": "Bathroom Renovation",
  "budget": "$10k-$25k",
  "timeline": "3-6 months",
  "location": "Austin, TX",
  "description": "Looking to update bathroom fixtures and flooring."
}
```

**Expected:** No Slack notification (only HOT and UNSCORED trigger alerts)

### Test 3: AI Failure (UNSCORED)

Temporarily break the AI by setting invalid API key:

1. In n8n, set `GOOGLE_GEMINI_API_KEY` to `"invalid_key_test"`
2. Submit any lead
3. Lead should save with `classification: "UNSCORED"`

**Expected:** Slack alert about AI failure

## Notification Rules

| Classification | Slack Alert? | Alert Type                   |
| -------------- | ------------ | ---------------------------- |
| HOT (70-100)   | ✅ Yes       | 🔥 Immediate action required |
| WARM (40-69)   | ❌ No        | -                            |
| COLD (0-39)    | ❌ No        | -                            |
| UNSCORED       | ✅ Yes       | ⚠️ Manual review required    |

## Customization

### Change Notification Channels

You can create separate Slack webhooks for different lead types:

| Classification | Webhook URL            | Channel          | Purpose                   |
| -------------- | ---------------------- | ---------------- | ------------------------- |
| HOT            | `SLACK_WEBHOOK_HOT`    | `#hot-leads`     | Immediate action required |
| WARM           | `SLACK_WEBHOOK_WARM`   | `#warm-leads`    | Follow up within 2-3 days |
| UNSCORED       | `SLACK_WEBHOOK_ERRORS` | `#system-alerts` | AI failures and errors    |

### Step-by-Step Webhook Setup

1. **Create Slack Channels** in your workspace:
   - `#hot-leads` - For urgent, high-value leads
   - `#warm-leads` - For qualified leads needing follow-up
   - `#system-alerts` - For technical issues and errors

2. **Create Webhooks in Slack App**:
   - Go to https://api.slack.com/apps
   - Select your app → **"Incoming Webhooks"**
   - Toggle **"Activate Incoming Webhooks"** ON
   - Create 3 webhooks:
     - **HOT**: Select `#hot-leads` channel
     - **WARM**: Select `#warm-leads` channel
     - **ERRORS**: Select `#system-alerts` channel

3. **Add to n8n Environment** (PowerShell):

   ```powershell
   $env:SLACK_WEBHOOK_HOT = "https://hooks.slack.com/services/YOUR/HOT/WEBHOOK"
   $env:SLACK_WEBHOOK_WARM = "https://hooks.slack.com/services/YOUR/WARM/WEBHOOK"
   $env:SLACK_WEBHOOK_ERRORS = "https://hooks.slack.com/services/YOUR/ERROR/WEBHOOK"
   ```

4. **Or add to `~/.n8n/.env`**:
   ```env
   SLACK_WEBHOOK_HOT=https://hooks.slack.com/services/YOUR/HOT/WEBHOOK
   SLACK_WEBHOOK_WARM=https://hooks.slack.com/services/YOUR/WARM/WEBHOOK
   SLACK_WEBHOOK_ERRORS=https://hooks.slack.com/services/YOUR/ERROR/WEBHOOK
   ```

### Customize Message Content

Edit the `jsonBody` in each HTTP Request node to change:

- Message text (emoji, tone)
- Which fields are displayed
- Message formatting (blocks, sections, context)

### Customize Message Examples

#### HOT Lead (🔥 Immediate Action)

```json
{
  "text": "🔥 HOT Lead - Immediate Action Required",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🔥 HOT Lead - Immediate Action Required"
      }
    },
    {
      "type": "section",
      "fields": [
        {"type": "mrkdwn", "text": "*Name:*\\n${name}"},
        {"type": "mrkdwn", "text": "*Score:*\\n${lead_score}/100"}
      ]
    }
  ]
}
```

#### WARM Lead (🎯 Follow Up)

```json
{
  "text": "🎯 WARM Lead Alert",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🎯 WARM Lead - Follow Up Within 2-3 Days"
      }
    },
    {
      "type": "section",
      "fields": [
        {"type": "mrkdwn", "text": "*Name:*\\n${name}"},
        {"type": "mrkdwn", "text": "*Score:*\\n${lead_score}/100"}
      ]
    }
  ]
}
```

### Customization Checklist

- [ ] Create 3 Slack channels: `#hot-leads`, `#warm-leads`, `#system-alerts`
- [ ] Create 3 webhooks in Slack app settings
- [ ] Set environment variables in n8n
- [ ] Re-import workflow with updated connections
- [ ] Test each classification with sample leads
- [ ] Verify messages appear in correct channels

---

## 🎯 Final MVP Status

✅ **All Phase 1 Steps Complete:**

- [x] Step 1: Lead form UI with validation
- [x] Step 2: n8n webhook connection
- [x] Step 3: Frontend submission logic
- [x] Step 4: Server-side validation
- [x] Step 5: Database write (Supabase)
- [x] Step 6: AI qualification (Google Gemini)
- [x] Step 7: Slack notifications (HOT, WARM, UNSCORED)

🎉 **You've built a complete, demoable MVP!**

Next: Phase 2 - Business Logic Layer (duplicate detection, spam filtering, etc.)

To send different classifications to different channels, create multiple webhooks:

```env
SLACK_WEBHOOK_HOT=https://hooks.slack.com/services/.../hot-leads
SLACK_WEBHOOK_ERRORS=https://hooks.slack.com/services/.../errors
```

Update the workflow nodes to use different webhooks.

### Add WARM Lead Notifications

If you want to notify for WARM leads too:

1. Add another IF node after "Is UNSCORED?"
2. Check for `classification === "WARM"`
3. Add HTTP Request node with different message format
4. Update connections

### Customize Message Format

Edit the `jsonBody` in the HTTP Request nodes to customize:

- Emoji (change 🔥 to 🚨, 🎯, etc.)
- Fields shown (add/remove fields from the blocks array)
- Color coding (use Slack message attachments with colors)
- @mentions (add `"text": "<!channel> Hot lead!"` to mention everyone)

## Troubleshooting

### No Slack Notifications Received

**Check 1: Webhook URL Set?**

```powershell
echo $env:SLACK_WEBHOOK_URL
```

Should output your webhook URL, not empty.

**Check 2: Workflow Activated?**

- Open n8n workflow
- Check toggle switch is ON (blue)

**Check 3: Classification Correct?**

- Check Supabase `leads` table
- Verify `classification` column shows "HOT" for your test
- If not "HOT", check AI scoring logic

**Check 4: n8n Execution Log**

- Click on workflow execution
- Check "Is HOT Lead?" node output
- Verify it's routing to "Send HOT Lead Alert"

### Slack Returns 400 Bad Request

**Cause:** Invalid JSON in webhook body
**Fix:** Check the `jsonBody` in the HTTP Request node - n8n expressions must be valid

### Duplicate Notifications

**Cause:** Workflow executed multiple times
**Fix:** Check webhook is only called once per form submission

### Notifications Too Slow

**Cause:** n8n processing time + Slack API latency
**Expected:** 2-5 seconds is normal
**Improve:** Optimize AI call (already using neverError: true to avoid blocking)

## Environment Variables Summary

Your n8n now requires these 4 environment variables:

```env
# Required from Step 5
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_service_role_key

# Required from Step 6
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Required from Step 7
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## Next Steps

After confirming Slack notifications work:

- ✅ Phase 1 Step 7 complete
- 🎯 Phase 1 MVP is now FEATURE COMPLETE!
- 📋 Next: Deploy to production (Vercel + Azure/Railway)
- 📋 Then: Phase 2 acceptance criteria testing

## Phase 1 MVP Checklist

- [x] Step 1: Lead form UI with validation
- [x] Step 2: n8n webhook connection
- [x] Step 3: Frontend submission logic
- [x] Step 4: Server-side validation
- [x] Step 5: Database write (Supabase)
- [x] Step 6: AI qualification (Google Gemini)
- [x] Step 7: Slack notifications (HOT + UNSCORED)
- [ ] Step 8: Deploy to production
- [ ] Step 9: End-to-end acceptance testing

🎉 **You've completed all core MVP features!**
