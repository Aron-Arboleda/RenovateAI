# RenovateAI Public-Site Polish & Chat UX Plan

## Summary

Transform the current lead-form screen into a premium, modern renovation-company site with Home, Services, About, and Contact routes. Keep the existing `/book` and private `/leads` routes intact. Use capability-led content and the existing visual assets—no fictional testimonials, project results, or customer claims.

## Key changes

- Add React Router and a shared responsive site shell: sticky header, active navigation, mobile menu, consistent footer, and route-aware page titles.
- Rebuild the Home page around:
  - Premium hero with clear “Start your project” and “Ask RenovateAI” calls to action.
  - Services overview, renovation process, AI qualification explainer, FAQ accordion, and contact/project-inquiry section.
  - Explicit explanation of the real automation flow: enquiry → AI qualification → follow-up → consultation booking.
- Add focused public pages:
  - **Services:** kitchen, bathroom, whole-home, basement, and addition offerings with scope-focused copy.
  - **About:** RenovateAI’s approach, technology-assisted intake, and transparent capability positioning.
  - **Contact:** reuse the validated lead form as the primary project-enquiry path.
- Establish a reusable premium visual system: warm stone palette, amber accents, editorial Sora/Manrope typography, shared section spacing, elevated cards, responsive layouts, and reduced-motion support.
- Remove unused starter CSS/assets that conflict with the Tailwind-based design.

## Chatbot experience

- Refactor the widget into a polished expandable chat panel with:
  - Clear open/close state, welcome message, suggested FAQ prompts, message timestamps omitted for simplicity, and automatic scroll to the newest message.
  - A multiline auto-growing textarea: one-line minimum, expands up to five lines, then scrolls internally.
  - `Enter` to send and `Shift+Enter` for a newline; disabled controls during requests.
  - Accessible animated three-dot typing indicator while n8n/Gemini is processing.
  - Inline, retryable error state that preserves the visitor’s drafted message.
- Separate FAQ mode from an optional guided-estimate flow:
  - FAQ answers remain conversational and do not force lead capture.
  - “Get a tailored estimate” starts an explicit guided intake with progress, one or two requested details at a time, and a visible option to switch to the full form.
  - Once all eight lead fields are collected, show a review/consent step and submit only after the visitor confirms.
- Update the chat webhook response contract to include `reply`, `leadUpdates`, `nextAction`, and `isLeadComplete`; use `nextAction` to drive FAQ, guided-intake, review, and completion UI states.
- Preserve the existing lead-intake webhook for final submission and continue tagging completed chat leads as `source: "chatbot"`.

## Test plan

- Verify all public routes, header links, mobile navigation, CTA anchors, `/book`, and `/leads` work on direct Vercel navigation.
- Test responsive layouts at mobile, tablet, and desktop sizes; confirm keyboard navigation, visible focus states, and reduced-motion behavior.
- Test chatbot FAQ prompts, long multiline input, typing animation, request failure/retry, and automatic message scrolling.
- Complete a guided estimate, verify the review step blocks automatic submission, confirm a single consented lead reaches the existing workflow with `source = chatbot`, and verify the full form remains available as an alternative.
- Run the frontend production build and test deployed n8n chat responses against the revised response schema.

## Assumptions

- The website remains a portfolio/demo site, so content describes services and workflow capabilities without claiming real customer outcomes.
- The existing deployed Vercel SPA rewrite remains in place.
- Chat uses the existing non-streaming n8n/Gemini webhook; “thinking” feedback is a client-side typing animation rather than token streaming.
