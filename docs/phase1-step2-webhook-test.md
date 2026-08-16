# Phase 1 Step 2 - Webhook Intake Test

## Goal

Confirm n8n receives payloads before connecting frontend submit.

## Import Workflow

1. Open n8n.
2. Import workflow JSON from n8n/workflows/01-lead-intake-mvp.json.
3. Activate or run in test mode.

## Expected Endpoint Shape

- Test URL: https://YOUR_N8N_HOST/webhook-test/renovateai/lead-intake
- Production URL: https://YOUR_N8N_HOST/webhook/renovateai/lead-intake

## Test Command (PowerShell)

Run this with your test webhook URL:

curl -Method Post "https://YOUR_N8N_HOST/webhook-test/renovateai/lead-intake" -ContentType "application/json" -Body '{"name":"Taylor Quinn","email":"taylor@example.com","phone":"555-010-8899","projectType":"Kitchen Renovation","budget":"$75,000 - $150,000","location":"Austin, TX","timeline":"1-3 months","description":"Full kitchen remodel with custom cabinets and layout update."}'

## Pass Condition

- n8n execution appears in the workflow history.
- HTTP response body includes:
  - ok: true
  - message: Webhook received
  - received: payload object

## Next Step

After this passes, wire frontend submit in LeadForm to POST to this webhook URL.
