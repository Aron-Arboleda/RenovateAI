# Phase 5 — AI Chatbot Widget

The floating **Ask RenovateAI** widget answers renovation FAQs through Gemini, holds a short conversation, and gathers the same eight fields as the website form. Once all fields are present, it submits to the existing lead-intake webhook with `source: "chatbot"`; no duplicate lead-processing workflow is created.

## Deploy

1. Import and activate [`04-chat-assistant.json`](../n8n/workflows/04-chat-assistant.json) in Azure n8n. It uses the existing `GOOGLE_GEMINI_API_KEY` environment variable.
2. Set `VITE_N8N_CHAT_WEBHOOK_URL` in Vercel to the production URL of that webhook and redeploy.
3. Re-import the updated lead-intake workflow so it preserves `source: "chatbot"` rather than overwriting it as `form`.

## Verify

- Ask at least five common questions about renovation scope, timeline, cost factors, permits, materials, or consultation.
- Complete a chat-led intake. Confirm the new Supabase lead has `source = chatbot` and is processed by the same qualification, notification, email, and booking flow as a form lead.
