import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const metadata = {
  title: "Issues & Blockers Console | Setuu",
};

export default async function IssuesPage() {
  const supabase = await createClient();

  const { data: issues } = await supabase
    .from("project_issues")
    .select(`
      id,
      title,
      severity,
      status,
      created_at,
      projects(name),
      assignee:user_actor(display_name)
    `)
    .order("created_at", { ascending: false });

  const rows = (issues || []).map((i: any) => ({
    id: i.id,
    project: i.projects?.name || "Unknown Project",
    title: i.title,
    severity: i.severity || "Low",
    status: i.status || "Open",
    assignedTo: i.assignee?.display_name || "Unassigned",
    date: i.created_at,
  }));

  const columns: Column<any>[] = [
    {
      key: "project",
      header: "Project",
      cell: (row) => <span className="font-semibold text-on-surface">{row.project}</span>,
    },
    {
      key: "title",
      header: "Issue / Blocker",
      cell: (row) => row.title,
    },
    {
      key: "severity",
      header: "Severity",
      cell: (row) => {
        let tone: any = "slate";
        const sev = row.severity?.toLowerCase();
        if (sev === "critical") tone = "crimson";
        if (sev === "high") tone = "amber";
        if (sev === "medium") tone = "sky";
        if (sev === "low") tone = "emerald";
        return <StatusBadge tone={tone} label={row.severity} />;
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        let tone: any = "slate";
        const st = row.status?.toLowerCase();
        if (st === "open" || st === "in progress") tone = "sky";
        if (st === "resolved" || st === "closed") tone = "emerald";
        return <StatusBadge tone={tone} label={row.status} />;
      },
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      cell: (row) => row.assignedTo,
    },
    {
      key: "date",
      header: "Reported Date",
      cell: (row) => <span className="font-jetbrains-mono">{new Date(row.date).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Issues & Blockers Console</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Global triage center for all project risks, delays, and critical blockers.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
