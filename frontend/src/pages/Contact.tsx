import LeadForm from "../components/LeadForm";

export default function Contact() {
  return (
    <div className="bg-stone-950">
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-sora text-4xl font-bold text-white sm:text-5xl">
            Start Your Project
          </h1>
          <p className="mt-6 text-lg text-stone-300">
            Share your renovation goals and let our AI-assisted qualification
            workflow handle the rest. Every enquiry is captured, scored, and
            routed for appropriate follow-up.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <LeadForm />

          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="font-sora text-xl font-semibold text-white">
                What Happens Next?
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-sm font-bold text-stone-950">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Review</h3>
                    <p className="mt-1 text-sm text-stone-400">
                      Your submission is analyzed for project scope, budget
                      alignment, and timeline readiness.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-sm font-bold text-stone-950">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Qualification Score
                    </h3>
                    <p className="mt-1 text-sm text-stone-400">
                      Your lead receives a score from 0 to 100, and
                      high-priority projects trigger immediate team
                      notifications.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-300 font-sora text-sm font-bold text-stone-950">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Follow-Up</h3>
                    <p className="mt-1 text-sm text-stone-400">
                      You will receive a personalized email with next steps,
                      including a consultation booking link if applicable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="font-sora text-xl font-semibold text-white">
                Prefer to Chat?
              </h2>
              <p className="mt-4 text-stone-400">
                Our AI assistant can answer renovation questions or guide you
                through the project intake process conversationally.
              </p>
              <button
                type="button"
                onClick={() => {
                  const chatButton = document.querySelector(
                    '[aria-label="Open chat"]',
                  ) as HTMLButtonElement;
                  if (chatButton) chatButton.click();
                }}
                className="mt-6 w-full rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-stone-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
              >
                Open Chat Assistant
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="font-sora text-xl font-semibold text-white">
                Required Information
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-stone-400">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Full name and contact details
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Project type and scope
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Budget range
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Project location
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Desired timeline
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Brief project description
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
