import {Link} from "react-router-dom";
import {useState} from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the AI qualification process work?",
      answer:
        "When you submit your project details, our system captures eight key fields and routes them to an automated workflow. The AI assistant reviews your requirements, assigns a qualification score, and determines the best follow-up path. You receive prompt contact from our team based on your project scope and timeline.",
    },
    {
      question: "What information do I need to provide?",
      answer:
        "We ask for your name, email, phone number, project type, budget range, location, timeline, and a brief description of your renovation goals. This gives us everything needed to understand your project and provide relevant guidance.",
    },
    {
      question: "How quickly will I hear back?",
      answer:
        "Most enquiries receive an initial response within one business day. High-priority projects flagged by our qualification system may receive faster outreach. You can also use the chat assistant for immediate answers to general renovation questions.",
    },
    {
      question: "Can I book a consultation directly?",
      answer:
        "Yes. Once your lead is qualified, you will receive a booking link via email or Slack notification. You can schedule a consultation at a time that works for you, and receive automated reminders before your appointment.",
    },
    {
      question: "What types of renovation projects do you handle?",
      answer:
        "We focus on residential renovations including kitchens, bathrooms, whole-home remodels, basement finishing, and additions. Our intake system is designed to capture details for any type of home improvement project.",
    },
  ];

  return (
    <div className="bg-stone-950">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(244,114,182,0.22),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(251,191,36,0.2),transparent_35%),linear-gradient(135deg,#0c0a09_0%,#1c1917_42%,#111827_100%)]" />
        <div className="pointer-events-none absolute -top-24 right-8 h-64 w-64 rounded-full border border-white/10 bg-white/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="font-sora text-sm uppercase tracking-widest text-amber-300">
            RenovateAI
          </p>
          <h1 className="mt-6 font-sora text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Renovation Leads,
            <br />
            <span className="text-amber-300">Qualified by AI.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-300 sm:text-xl">
            Every renovation enquiry is captured, scored, and routed through an
            AI-assisted workflow. Get qualified leads ready for follow-up,
            consultation booking, and automated reminders.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-xl bg-amber-300 px-8 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              Start Your Project
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
              Ask RenovateAI
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-stone-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-sora text-3xl font-bold text-white sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-stone-400">
              Comprehensive renovation solutions for every part of your home.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/services#kitchen"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-300/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <h3 className="font-sora text-xl font-semibold text-white group-hover:text-amber-300">
                Kitchen Renovation
              </h3>
              <p className="mt-3 text-sm text-stone-400">
                Transform your kitchen with modern layouts, custom cabinetry,
                and premium finishes.
              </p>
            </Link>

            <Link
              to="/services#bathroom"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-300/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <h3 className="font-sora text-xl font-semibold text-white group-hover:text-amber-300">
                Bathroom Remodel
              </h3>
              <p className="mt-3 text-sm text-stone-400">
                Create a spa-like retreat with updated fixtures, tile work, and
                efficient layouts.
              </p>
            </Link>

            <Link
              to="/services#whole-home"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-300/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <h3 className="font-sora text-xl font-semibold text-white group-hover:text-amber-300">
                Whole-Home Renovation
              </h3>
              <p className="mt-3 text-sm text-stone-400">
                Complete transformations that reimagine your entire living space
                from floor to ceiling.
              </p>
            </Link>

            <Link
              to="/services#basement"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-300/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <h3 className="font-sora text-xl font-semibold text-white group-hover:text-amber-300">
                Basement Finishing
              </h3>
              <p className="mt-3 text-sm text-stone-400">
                Convert unfinished space into functional living areas, home
                offices, or entertainment zones.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="font-sora text-3xl font-bold text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-stone-400">
              Our AI-assisted process ensures every lead gets the attention it
              deserves.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 font-sora text-xl font-bold text-stone-950">
                1
              </div>
              <h3 className="mt-6 font-sora text-xl font-semibold text-white">
                Submit Your Enquiry
              </h3>
              <p className="mt-3 text-stone-400">
                Fill out our contact form or chat with our AI assistant. We
                capture your name, project details, budget, timeline, and
                renovation goals.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 font-sora text-xl font-bold text-stone-950">
                2
              </div>
              <h3 className="mt-6 font-sora text-xl font-semibold text-white">
                AI Qualification
              </h3>
              <p className="mt-3 text-stone-400">
                Our system reviews your submission, assigns a qualification
                score based on project scope and readiness, and routes it to the
                appropriate workflow channel.
              </p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 font-sora text-xl font-bold text-stone-950">
                3
              </div>
              <h3 className="mt-6 font-sora text-xl font-semibold text-white">
                Follow-Up and Booking
              </h3>
              <p className="mt-3 text-stone-400">
                Qualified leads receive personalized follow-up via email or
                Slack. Book a consultation directly through your confirmation
                link and receive automated reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-stone-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-sora text-3xl font-bold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300"
                >
                  <span className="font-semibold text-white">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-5 w-5 text-amber-300 transition ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="border-t border-white/10 p-6 pt-4 text-stone-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/10 to-transparent p-8 text-center sm:p-12">
          <h2 className="font-sora text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your Renovation?
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            Share your project details and let our AI-assisted workflow handle
            the qualification process.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-xl bg-amber-300 px-8 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
