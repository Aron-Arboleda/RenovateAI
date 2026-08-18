import {useEffect, useState} from "react";
import {fetchLeads} from "../lib/supabase";
import type {Lead} from "../lib/supabase";

function displayDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {dateStyle: "medium", timeStyle: "short"}).format(new Date(value));
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try { setLeads(await fetchLeads()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Could not load leads."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-100 sm:px-6 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-sora text-sm uppercase tracking-[0.28em] text-amber-300">RenovateAI</p><h1 className="mt-3 font-sora text-3xl text-white sm:text-4xl">Lead dashboard</h1><p className="mt-2 text-stone-300">Live qualification results from Supabase.</p></div>
          <button type="button" onClick={() => void load()} className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-stone-950">Refresh</button>
        </div>
        {isLoading && <p className="mt-8 text-stone-300">Loading leads…</p>}
        {error && <p className="mt-8 rounded-xl bg-rose-100 p-4 text-rose-900">{error}</p>}
        {!isLoading && !error && <div className="mt-8 overflow-x-auto rounded-2xl border border-white/15 bg-white/5"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-white/15 text-stone-300"><tr><th className="p-4">Lead</th><th className="p-4">Project</th><th className="p-4">Score</th><th className="p-4">Classification</th><th className="p-4">Status</th><th className="p-4">Updated</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-b border-white/10 last:border-0"><td className="p-4"><div className="font-semibold text-white">{lead.name}</div><div className="text-stone-400">{lead.email}</div></td><td className="p-4"><div>{lead.project_type}</div><div className="text-stone-400">{lead.budget} · {lead.location}</div></td><td className="p-4 font-semibold text-amber-300">{lead.lead_score ?? "—"}</td><td className="p-4"><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">{lead.classification ?? "UNSCORED"}</span></td><td className="p-4">{lead.lead_status}</td><td className="p-4 text-stone-400">{displayDate(lead.updated_at)}</td></tr>)}</tbody></table>{leads.length === 0 && <p className="p-6 text-stone-300">No leads yet.</p>}</div>}
      </section>
    </main>
  );
}
