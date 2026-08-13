import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MessageSquarePlusIcon } from "lucide-react";

export const metadata = {
  title: "PM Help Desk | Setuu",
};

export default async function PmSupportPage() {
  const supabase = await createClient();

  // In a real app, we'd filter by the PM's user ID.
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  const columns = [
    {
      header: "Ticket ID",
      key: "id",
      cell: (row: any) => <span className="font-jetbrains-mono text-xs font-bold text-primary">TKT-{row.id.substring(0,6).toUpperCase()}</span>,
    },
    {
      header: "Issue Summary",
      key: "issue_summary",
      cell: (row: any) => <span className="font-medium text-on-surface line-clamp-1">{row.issue_summary}</span>,
    },
    {
      header: "Priority",
      key: "priority",
      cell: (row: any) => (
        <StatusBadge 
          tone={
            row.priority === "Critical" ? "crimson" :
            row.priority === "High" ? "amber" : "slate"
          } 
          label={row.priority} 
        />
      ),
    },
    {
      header: "Status",
      key: "status",
      cell: (row: any) => (
        <span className={`text-xs font-bold uppercase tracking-wider ${row.status === 'Resolved' ? 'text-semantic-emerald' : 'text-semantic-amber'}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Logged On",
      key: "created_at",
      cell: (row: any) => <span className="font-jetbrains-mono text-xs text-on-surface-variant">{new Date(row.created_at).toLocaleString()}</span>,
    }
  ];

  return (
    <div className="p-6 max-w-[100rem] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Help Desk & Support</h1>
          <p className="text-sm text-on-surface-variant font-inter mt-1">Track your platform issues and IT requests.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm">
          <MessageSquarePlusIcon className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <DataTable 
          data={tickets || []} 
          columns={columns}
        />
      </div>

    </div>
  );
}
