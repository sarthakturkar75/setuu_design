import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApproveButton } from "./ApproveButton";

export const metadata = {
  title: "Change Request Queue | Setuu",
};

export default async function ChangeRequestsPage() {
  const supabase = await createClient();

  const { data: changes } = await supabase
    .from("change_requests")
    .select(`
      id,
      title,
      cost_impact,
      time_impact_days,
      status,
      created_at,
      projects(name),
      author:user_actor!created_by(display_name)
    `)
    .order("created_at", { ascending: false });

  const rows = (changes || []).map((c: any) => ({
    id: c.id,
    project: c.projects?.name || "Unknown Project",
    title: c.title,
    costImpact: c.cost_impact || 0,
    timeImpact: c.time_impact_days || 0,
    status: c.status || "Pending",
    author: c.author?.display_name || "Unknown",
    date: c.created_at,
  }));

  const columns: Column<any>[] = [
    {
      key: "project",
      header: "Project",
      cell: (row) => <span className="font-semibold text-on-surface">{row.project}</span>,
    },
    {
      key: "title",
      header: "Change Description",
      cell: (row) => row.title,
    },
    {
      key: "costImpact",
      header: "Cost Impact",
      cell: (row) => (
        <span className={`font-jetbrains-mono ${row.costImpact > 0 ? "text-semantic-crimson" : "text-semantic-emerald"}`}>
          ${Math.abs(row.costImpact).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "timeImpact",
      header: "Time Impact (Days)",
      cell: (row) => (
        <span className={`font-jetbrains-mono ${row.timeImpact > 0 ? "text-semantic-amber" : "text-semantic-emerald"}`}>
          {row.timeImpact > 0 ? `+${row.timeImpact}` : row.timeImpact}
        </span>
      ),
    },
    {
      key: "author",
      header: "Requested By",
      cell: (row) => row.author,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        let tone: any = "slate";
        const st = row.status?.toLowerCase();
        if (st === "pending" || st === "in review") tone = "amber";
        if (st === "approved") tone = "emerald";
        if (st === "rejected") tone = "crimson";
        return <StatusBadge tone={tone} label={row.status} />;
      },
    },
    {
      key: "actions",
      header: "Action",
      cell: (row) => (
        <ApproveButton id={row.id} currentStatus={row.status} />
      ),
    },
  ];

  return (
    <div className="p-6 max-w-[90rem] mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Change Request Approval Queue</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Review and approve financial and timeline variations across all projects.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
