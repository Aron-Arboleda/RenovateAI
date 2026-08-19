import {useState} from "react";
import type {FormEvent} from "react";
import {submitBooking} from "../lib/api";

function initialValue(key: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

export default function BookingForm() {
  const [name, setName] = useState(() => initialValue("name"));
  const [email, setEmail] = useState(() => initialValue("email"));
  const [startsAt, setStartsAt] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    try {
      await submitBooking({name, email, startsAt: new Date(startsAt).toISOString(), notes});
      setMessage("Your consultation is booked. A confirmation will arrive shortly.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking failed. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-100 sm:px-6">
      <section className="mx-auto max-w-xl rounded-3xl border border-white/15 bg-white p-6 text-stone-900 shadow-2xl sm:p-8">
        <p className="font-sora text-sm uppercase tracking-[0.28em] text-amber-700">RenovateAI</p>
        <h1 className="mt-4 font-sora text-3xl font-semibold">Book a consultation</h1>
        <p className="mt-2 text-sm text-stone-600">Choose a preferred 30-minute time. We’ll confirm it after checking our calendar.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium">Name<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5" /></label>
          <label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5" /></label>
          <label className="block text-sm font-medium">Preferred time<input required type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5" /></label>
          <label className="block text-sm font-medium">Anything we should know?<textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2.5" /></label>
          <button disabled={isSubmitting} className="w-full rounded-xl bg-stone-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{isSubmitting ? "Booking…" : "Request consultation"}</button>
        </form>
        {message && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-stone-800">{message}</p>}
      </section>
    </main>
  );
}
