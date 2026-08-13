import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import Link from "next/link";
import { BarChartIcon, UserCircleIcon, WrenchIcon } from "lucide-react";

export const metadata = {
  title: "Resource & Timesheet Hub | Setuu",
};

export default async function ResourcesPage() {
  const supabase = await createClient();

  // Fetch from project_resources
  const { data: resources } = await supabase
    .from("project_resources")
    .select(`
      id,
      name,
      resource_type,
      allocated_hours,
      actual_hours,
      productivity_score,
      current_assignment,
      projects(name)
    `)
    .order("name", { ascending: true });

  const rows = (resources || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    type: r.resource_type || "Personnel",
    project: r.projects?.name || "Unassigned",
    task: r.current_assignment || "Available",
    allocated: r.allocated_hours || 0,
    actual: r.actual_hours || 0,
    productivity: r.productivity_score || 0,
  }));

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Resource Name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.type === "Equipment" ? (
            <WrenchIcon className="w-4 h-4 text-on-surface-variant" />
          ) : (
            <UserCircleIcon className="w-4 h-4 text-on-surface-variant" />
          )}
          <span className="font-semibold text-on-surface">{row.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => <span className="text-sm font-medium text-on-surface-variant">{row.type}</span>,
    },
    {
      key: "project",
      header: "Current Project",
      cell: (row) => row.project,
    },
    {
      key: "task",
      header: "Assignment",
      cell: (row) => row.task,
    },
    {
      key: "allocated",
      header: "Allocated Hrs",
      cell: (row) => <span className="font-jetbrains-mono">{row.allocated}h</span>,
    },
    {
      key: "actual",
      header: "Actual Hrs",
      cell: (row) => {
        const isOver = row.actual > row.allocated;
        return (
          <span className={`font-jetbrains-mono ${isOver ? "text-semantic-crimson font-bold" : "text-semantic-emerald"}`}>
            {row.actual}h
          </span>
        );
      },
    },
    {
      key: "productivity",
      header: "Productivity Score",
      cell: (row) => {
        let tone = "text-on-surface";
        if (row.productivity >= 90) tone = "text-semantic-emerald";
        else if (row.productivity < 75) tone = "text-semantic-amber";
        return (
          <span className={`font-jetbrains-mono font-medium ${tone}`}>
            {row.productivity}%
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Resource & Timesheet Hub</h1>
          <p className="text-on-surface-variant font-inter mt-1">
            Manage workforce allocation, timesheet entries, and equipment deployments.
          </p>
        </div>
        <Link
          href="/admin/resources/analytics"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface-container-high border border-outline-variant text-on-surface rounded-md font-medium text-sm transition-colors hover:bg-surface-container focus-visible:outline-none"
        >
          <BarChartIcon className="w-4 h-4" />
          View Allocation Analytics
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
