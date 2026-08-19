# RenovateAI — AI Lead Capture & Qualification System
### Build Plan for Portfolio Project (Vibe-Coded)

**Goal:** Build a working, demoable system — Website → Webhook → n8n → AI Qualification → CRM → Email/Booking → Notification — that maps directly to an "AI Web Developer" job description. This document is the spec the coding agent should follow. Build the MVP first, fully working end-to-end, before touching anything in later phases.

---

## 0. Ground Rules for the Agent (read first, every session)

1. **MVP before features.** Do not build Phase 2+ items until every MVP acceptance criterion in Phase 1 passes.
2. **One vertical slice at a time.** Get form → webhook → n8n → database → console log working end-to-end with dummy data *before* wiring in the AI call, and get the AI call working *before* wiring in email, and so on. Never build all layers in parallel.
3. **No invented services.** If a credential, API key, or account doesn't exist yet, stub it (mock function / hardcoded JSON) and clearly flag it as a stub in code comments, rather than pretending it's connected.
4. **Keep secrets out of the repo.** All API keys go in `.env` (website) and n8n's built-in credential store (never hardcoded in a workflow node).
5. **Every phase ends with a demo-able artifact.** After each phase, there should be something you can literally click through and show in an interview.
6. **Log everything.** Every n8n workflow should have a final "Log to sheet/table" or error-handling branch so failures are visible, not silent.

---

## 1. Tech Stack Decisions (lock these in before coding)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript + Vite + Tailwind | Fast to vibe-code, matches most JD stacks, no server needed for MVP |
| Form submission | Direct `fetch()` POST to n8n webhook URL | No backend needed — n8n *is* the backend |
| Automation | n8n (cloud free tier or self-hosted via Docker) | Matches job requirement directly |
| Database/CRM (MVP) | Airtable or Supabase (pick one — Supabase recommended if you want to show SQL/Postgres skill) | Fast, visual, no server management |
| AI | OpenAI API (gpt-4o-mini for cost) or Claude API | Structured JSON output for lead scoring |
| Email | Gmail node (n8n) or Resend/SendGrid | Free tier available, reliable |
| Notification | Slack webhook or Discord webhook | Free, instant, easy to demo |
| Booking (Phase 3) | Google Calendar API via n8n node | Native n8n support |
| Hosting | Vercel/Netlify (frontend), n8n cloud or Railway (n8n) | Free tiers, fast deploy |

Decide Supabase vs Airtable now — don't revisit this mid-build.

---

## 2. Phase 1 — MVP (build this first, nothing else)

**MVP definition:** A visitor fills out a form on a real website → n8n receives it via webhook → validates the data → calls an AI model to score/classify the lead → writes the lead + AI output to a database → sends a Slack notification if the lead is "HOT." That's it. No email personalization, no booking, no chatbot yet.

### 2.1 Scope (strictly enforced)
**In scope:**
- Static React landing page with one form (Name, Email, Phone, Project Type, Budget, Location, Timeline, Description)
- Client-side validation (required fields, email format)
- POST to n8n webhook on submit
- n8n workflow:
  - Webhook trigger
  - Basic validation node (reject if email missing/invalid → return error to frontend)
  - AI node: send lead data to OpenAI/Claude, request structured JSON (`leadScore`, `classification`, `summary`, `recommendedAction`)
  - Write full record (raw form data + AI output) to Supabase/Airtable
  - IF `classification == HOT` → send Slack message
  - Return success response to frontend (frontend shows "Thanks, we'll be in touch" state)
- Basic error handling: if AI call fails, still save the lead with `classification: "UNSCORED"` and notify via Slack that scoring failed

**Explicitly out of scope for MVP** (do not build yet): personalized AI emails, booking/calendar, reminders, chatbot widget, duplicate detection, spam filtering, multiple lead sources, WARM/COLD nurture sequences, HubSpot integration.

### 2.2 Acceptance criteria (all must pass before Phase 2 starts)
- [ ] Submitting the real form on the deployed site creates a new row in the database with correct data
- [ ] The AI classification (`leadScore`, `classification`, `summary`) is present and sensible for at least 5 test submissions with varying budgets/urgency
- [ ] A HOT lead triggers a Slack message within a few seconds
- [ ] A malformed submission (bad email) is rejected with a user-visible error, and does NOT create a database row
- [ ] If the AI call is deliberately broken (bad API key), the lead is still saved and a Slack alert fires saying "AI scoring failed"
- [ ] The whole flow works from a public URL, not just localhost

### 2.3 File/folder structure to set up
```
renovateai/
  frontend/
    src/
      components/LeadForm.tsx
      lib/api.ts        <- POST helper to webhook
      App.tsx
    .env                <- VITE_N8N_WEBHOOK_URL
  n8n/
    workflows/
      01-lead-intake-mvp.json   <- exported workflow, committed for portfolio proof
  docs/
    architecture.png (or mermaid diagram)
    README.md          <- write this LAST, once MVP works
```

### 2.4 Build order within Phase 1 (do in this order, test after each step)
1. Scaffold React app, build the form UI only (no submit logic yet) — confirm it renders and validates client-side.
2. Create n8n webhook node alone, hit it with Postman/curl, confirm you receive the payload — before touching React's fetch call.
3. Wire React's submit → webhook. Confirm payload arrives correctly (log it in n8n).
4. Add validation node in n8n. Test with good and bad payloads.
5. Add database write node. Confirm rows appear correctly for both valid and edge-case data.
6. Add AI node with a fixed prompt (see 2.5). Test in isolation with n8n's manual execution using sample data before connecting it to the live flow.
7. Add the HOT → Slack branch. Test by manually crafting a payload guaranteed to score HOT.
8. Add the AI-failure fallback branch last, once the happy path is fully proven.
9. Deploy frontend to Vercel/Netlify, point `.env` at the production webhook URL, retest the whole flow live.

### 2.5 AI prompt spec (for the qualification node)
System prompt should instruct the model to:
- Act as a lead qualification assistant for a home renovation company
- Return **only** valid JSON, no prose, matching this exact schema:
```json
{
  "leadScore": 0-100,
  "classification": "HOT | WARM | COLD",
  "estimatedValue": number,
  "urgency": "LOW | MEDIUM | HIGH",
  "summary": "1-2 sentence summary",
  "recommendedAction": "short string"
}
```
- Scoring logic to specify explicitly in the prompt: budget size, stated timeline urgency, and specificity of the project description should all raise the score; vague or clearly non-serious submissions should score low.
- Set `response_format: json_object` (OpenAI) or use tool-calling/structured output so parsing never breaks — don't rely on regex-parsing free text.

---

## 3. Phase 2 — Business Logic Layer

Only start once Phase 1 acceptance criteria all pass.

- Duplicate detection: before writing a new lead, check database for existing email/phone in last 30 days → if found, update existing record instead of creating a new one
- Basic spam filtering node (disposable email domain check, honeypot field on the form)
- Branch logic for WARM and COLD leads (not just HOT): different Slack channel or just a database status update
- Add a lightweight internal dashboard page (`/leads`) that reads from Supabase and lists leads with score/classification — this becomes a strong portfolio screenshot

**Acceptance criteria:**
- [ ] Submitting the same email twice updates one record, not two
- [ ] A test submission with a disposable email domain is flagged/rejected
- [ ] WARM and COLD leads are visibly routed differently in n8n's execution log
- [ ] `/leads` dashboard shows real data pulled live from the database

---

## 4. Phase 3 — Personalized Communication

- Add a second AI node: generate a personalized email body using the lead's actual project type, budget, and location (few-shot the prompt with 2-3 example emails so tone stays consistent)
- Send via Gmail node or Resend/SendGrid node in n8n
- Different email templates/tone for HOT vs WARM vs COLD (prompt-driven, not hardcoded strings)

**Acceptance criteria:**
- [ ] Each classification tier produces a distinctly different email tone/content, verifiable by comparing 3 sample sends
- [ ] Emails reference actual submitted details (no generic placeholders left in output)
- [ ] Sent emails are logged (email content + timestamp) back to the database record

---

## 5. Phase 4 — Booking & Reminders

- Add "Book a consultation" link in the HOT-lead email pointing to a booking page (Calendly-style, or a simple custom page hitting Google Calendar's free/busy API via n8n)
- n8n workflow detects new calendar bookings (poll or webhook depending on booking tool) → updates lead status to "Consultation Booked" in the database
- Scheduled workflow (n8n Cron trigger): 24-hour-before and 1-hour-before reminder emails/SMS
- Post-consultation follow-up workflow (wait node + send follow-up + update status)

**Acceptance criteria:**
- [ ] A real booking made through the booking page updates the lead's database status automatically
- [ ] A scheduled reminder fires correctly for a booking dated appropriately in test data
- [ ] Full lifecycle (submit → qualify → email → book → remind → follow-up) is traceable in one database record

---

## 6. Phase 5 — AI Chatbot Widget (stretch, do last)

- Floating chat widget on the website (simple React component + AI API call, streaming optional)
- Chatbot answers general renovation-cost questions from a small knowledge snippet you provide in the system prompt
- Chatbot collects lead details conversationally, then calls the **same** n8n webhook from Phase 1 (reuse, don't duplicate logic)

**Acceptance criteria:**
- [ ] Chatbot can answer at least 5 realistic FAQ-style questions sensibly
- [ ] Chatbot-collected leads land in the same database table, indistinguishable in structure from form-collected leads (just tag `source: "chatbot"` vs `source: "form"`)

---

## 7. Portfolio Presentation Checklist (do after Phase 1, refine after each later phase)

- [ ] Architecture diagram (the ASCII/mermaid diagram from the original scenario, cleaned up)
- [ ] README with problem statement → solution → tech stack → what you'd add with more time
- [ ] Short screen-recording demo (60–90 seconds): submit form live, cut to Slack notification, cut to database row appearing
- [ ] n8n workflow JSON exported and committed to repo (recruiters can literally import and inspect it)
- [ ] Note in README which parts are "AI-agent qualification" vs "AI-personalized copywriting" vs "AI chatbot" — reviewers skimming will want to see the AI touchpoints called out explicitly, since that's the job's emphasis

---

## 8. Suggested order of operations for you personally

1. Lock stack decisions (Section 1) — 15 min, don't overthink it
2. Phase 1 only, following build order in 2.4, one step at a time, testing after each
3. Deploy MVP, record a 60-second demo clip immediately (don't wait until the whole project is done — a demoable MVP is already a strong artifact)
4. Only then move to Phase 2, and so on, recording an updated demo clip after each phase

If you stop after Phase 1 or 2, you already have a complete, coherent, demoable story for an interview — later phases are enhancements, not requirements to have "something to show."
