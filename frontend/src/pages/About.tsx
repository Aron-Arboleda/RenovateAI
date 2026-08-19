import {Link} from "react-router-dom";

export default function About() {
  return (
    <div className="bg-stone-950">
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-sora text-4xl font-bold text-white sm:text-5xl">
            About RenovateAI
          </h1>
          <p className="mt-6 text-lg text-stone-300">
            A technology demonstration project showcasing AI-assisted lead
            capture, qualification, and workflow automation for renovation
            businesses.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10">
            <h2 className="font-sora text-2xl font-bold text-white sm:text-3xl">
              Our Approach
            </h2>
            <div className="mt-6 space-y-4 text-stone-300">
              <p>
                RenovateAI demonstrates how renovation companies can leverage AI
                and automation to streamline their lead intake and qualification
                process. Every project enquiry flows through a structured
                workflow that captures essential details, assigns qualification
                scores, and routes leads to the appropriate follow-up channel.
              </p>
              <p>
                Our system is built on modern automation tools including n8n
                workflows, Supabase for data storage, Gemini AI for intelligent
                qualification, and Slack for real-time team notifications. This
                stack enables renovation businesses to respond faster,
                prioritize high-value leads, and maintain consistent
                communication with potential clients.
              </p>
              <p>
                The entire process is designed to reduce manual data entry,
                eliminate lead routing errors, and ensure every enquiry receives
                appropriate attention based on project scope, budget, and
                timeline.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="font-sora text-xl font-semibold text-white">
                Technology-Assisted Intake
              </h3>
              <p className="mt-4 text-stone-400">
                Our lead form and chat assistant collect structured data that
                feeds directly into automated workflows. AI reviews each
                submission for completeness, budget alignment, and project
                readiness.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="font-sora text-xl font-semibold text-white">
                Automated Qualification
              </h3>
              <p className="mt-4 text-stone-400">
                Gemini AI analyzes project details and assigns qualification
                scores based on configurable criteria. High-priority leads
                receive immediate Slack notifications for rapid follow-up.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="font-sora text-xl font-semibold text-white">
                Seamless Booking Flow
              </h3>
              <p className="mt-4 text-stone-400">
                Qualified leads receive personalized booking links via email.
                Consultations are stored in Supabase, and automated reminders
                ensure clients arrive prepared for their appointments.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="font-sora text-xl font-semibold text-white">
                Conversational Support
              </h3>
              <p className="mt-4 text-stone-400">
                The chat assistant provides instant answers to common renovation
                questions and can guide visitors through a structured intake
                flow, collecting lead details conversationally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-stone-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-sora text-3xl font-bold text-white sm:text-4xl">
            The Workflow
          </h2>

          <div className="mt-12 space-y-6">
            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white">Lead Capture</h3>
                <p className="mt-2 text-stone-400">
                  Visitors submit project details through the contact form or
                  chat assistant. The system validates required fields, checks
                  email format, and includes honeypot spam protection.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Qualification</h3>
                <p className="mt-2 text-stone-400">
                  An n8n workflow receives the lead data and sends it to Gemini
                  AI for qualification. The AI evaluates project scope, budget
                  alignment, timeline readiness, and detail completeness, then
                  assigns a score from 0 to 100.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white">Data Storage</h3>
                <p className="mt-2 text-stone-400">
                  Qualified leads are stored in Supabase with the AI-generated
                  score, reasoning, and follow-up recommendations. This creates
                  a centralized database for lead management and reporting.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                4
              </div>
              <div>
                <h3 className="font-semibold text-white">Team Notification</h3>
                <p className="mt-2 text-stone-400">
                  High-priority leads trigger immediate Slack notifications to
                  the sales team. Notifications include the qualification score,
                  project summary, and a direct link to the lead record.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                5
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Consultation Booking
                </h3>
                <p className="mt-2 text-stone-400">
                  Qualified leads receive personalized emails with booking
                  links. Clients select their preferred consultation time, and
                  the system stores appointment details in Supabase.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                6
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Automated Reminders
                </h3>
                <p className="mt-2 text-stone-400">
                  Scheduled n8n workflows send email reminders 24 hours and 1
                  hour before each consultation, reducing no-shows and ensuring
                  clients arrive prepared.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/10 to-transparent p-8 text-center sm:p-12">
          <h2 className="font-sora text-3xl font-bold text-white sm:text-4xl">
            See It in Action
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            Experience the automated workflow by submitting a project enquiry or
            chatting with our AI assistant.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-xl bg-amber-300 px-8 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              Start a Project
            </Link>
            <button
              type="button"
              onClick={() => {
                const chatButton = document.querySelector(
                  '[aria-label="Open chat"]',
                ) as HTMLButtonElement;
                if (chatButton) chatButton.click();
              }}
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-stone-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              Chat with AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
