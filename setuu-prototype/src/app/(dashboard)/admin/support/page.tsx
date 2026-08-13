import { createClient } from "@/lib/supabase/server";
import { SupportPanel } from "./SupportPanel";

export const metadata = {
  title: "Support Ticket Triage | Setuu",
};

export default async function SupportPage() {
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select(`
      id,
      issue_category,
      description,
      status,
      resolution_notes,
      created_at,
      user_id
    `)
    .order("created_at", { ascending: false });

  // For demonstration, map the raw data.
  // We're skipping an inner join on user_identity for simplicity here if it's not setup yet,
  // but we can fake the username or map it if available.
  const mappedTickets = (tickets || []).map((t: any) => ({
    id: t.id,
    user: t.user_id || "Anonymous User",
    category: t.issue_category || "General Inquiry",
    description: t.description,
    status: t.status || "Open",
    notes: t.resolution_notes,
    date: t.created_at,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Support Ticket Triage</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Review, categorize, and resolve technical issues reported by platform users.
        </p>
      </div>

      <SupportPanel tickets={mappedTickets} />
    </div>
  );
}
