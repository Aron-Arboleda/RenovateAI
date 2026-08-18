export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  budget: string;
  location: string;
  timeline: string;
  description: string;
  lead_score: number | null;
  classification: "HOT" | "WARM" | "COLD" | "UNSCORED" | null;
  lead_status: string;
  submission_count: number;
  created_at: string;
  updated_at: string;
};

function getConfig(): { url: string; key: string } {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url?.trim() || !key?.trim()) {
    throw new Error("The leads dashboard is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Vercel.");
  }
  return {url: url.trim().replace(/\/$/, ""), key: key.trim()};
}

export async function fetchLeads(): Promise<Lead[]> {
  const {url, key} = getConfig();
  const response = await fetch(
    `${url}/rest/v1/leads?select=id,name,email,phone,project_type,budget,location,timeline,description,lead_score,classification,lead_status,submission_count,created_at,updated_at&order=updated_at.desc`,
    {headers: {apikey: key, Authorization: `Bearer ${key}`}},
  );
  if (!response.ok) throw new Error("Could not load leads. Check the Supabase dashboard access policy.");
  return response.json() as Promise<Lead[]>;
}
