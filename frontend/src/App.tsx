import LeadForm from "./components/LeadForm";

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-950 px-4 py-10 text-stone-100 sm:px-6 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(244,114,182,0.22),transparent_42%),radial-gradient(circle_at_85%_80%,rgba(251,191,36,0.2),transparent_35%),linear-gradient(135deg,#0c0a09_0%,#1c1917_42%,#111827_100%)]" />
      <div className="pointer-events-none absolute -top-24 right-8 h-64 w-64 rounded-full border border-white/10 bg-white/5 blur-3xl" />

      <section className="relative mx-auto max-w-6xl animate-rise grid-cols-1 gap-8 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <header className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl lg:sticky lg:top-8">
          <p className="font-sora text-sm uppercase tracking-[0.28em] text-amber-300">
            RenovateAI
          </p>
          <h1 className="mt-5 font-sora text-4xl leading-tight text-white sm:text-5xl">
            Renovation Leads,
            <span className="block text-amber-300">Qualified by AI.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-stone-300 sm:text-lg">
            Phase 1 intake form with live webhook submission into n8n. This is
            the production pathway for lead capture.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-stone-200 sm:grid-cols-2">
            <div className="rounded-xl border border-white/15 bg-black/20 p-3">
              Captures 8 required lead fields
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-3">
              Email format checks before submit
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-3">
              Inline, field-level error messages
            </div>
            <div className="rounded-xl border border-white/15 bg-black/20 p-3">
              Direct POST to n8n webhook endpoint
            </div>
          </div>
        </header>

        <LeadForm />
      </section>
    </main>
  );
}

export default App;
