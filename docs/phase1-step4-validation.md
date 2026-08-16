# Phase 1 Step 4 - n8n Validation Node Test

## Goal

Reject malformed submissions at the n8n layer (not only in frontend validation).

## Workflow Behavior

- Valid payload returns 200 with:
  - ok: true
  - message: Lead payload accepted
- Invalid payload returns 400 with:
  - ok: false
  - message: Payload validation failed
  - errors: array of validation errors

## Test 1 - Valid Payload

curl -Method Post "http://localhost:5678/webhook-test/renovateai/lead-intake" -ContentType "application/json" -Body '{"name":"Taylor Quinn","email":"taylor@example.com","phone":"555-010-8899","projectType":"Kitchen Renovation","budget":"$75,000 - $150,000","location":"Austin, TX","timeline":"1-3 months","description":"Full kitchen remodel with custom cabinets and layout update."}'

Expected: HTTP 200 and ok: true

## Test 2 - Invalid Email

curl -Method Post "http://localhost:5678/webhook-test/renovateai/lead-intake" -ContentType "application/json" -Body '{"name":"Taylor Quinn","email":"bad-email","phone":"555-010-8899","projectType":"Kitchen Renovation","budget":"$75,000 - $150,000","location":"Austin, TX","timeline":"1-3 months","description":"Full kitchen remodel with custom cabinets and layout update."}'

Expected: HTTP 400, message Payload validation failed, and errors includes "email must be valid"

## Test 3 - Missing Required Field

curl -Method Post "http://localhost:5678/webhook-test/renovateai/lead-intake" -ContentType "application/json" -Body '{"name":"","email":"taylor@example.com","phone":"555-010-8899","projectType":"Kitchen Renovation","budget":"$75,000 - $150,000","location":"Austin, TX","timeline":"1-3 months","description":"Full kitchen remodel with custom cabinets and layout update."}'

Expected: HTTP 400 and errors includes "name is required"

## Frontend Verification

When n8n returns 400, the frontend form shows the backend validation message in a red error banner.
