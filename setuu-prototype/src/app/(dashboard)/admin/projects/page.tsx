import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { PlusIcon, EyeIcon, EditIcon } from "lucide-react";

export const metadata = {
  title: "Project Tracking Hub | Setuu",
};

// Define the shape of our row based on what we fetch
type ProjectRow = {
  id: string;
  display_id: string; // If we want a shorter ID for display, or we can use the short uuid
  name: string;
  clientName: string;
  target_date: string;
  status: string;
};

function getStatusTone(status: string): StatusTone {
  switch (status?.toLowerCase()) {
    case "in progress":
      return "sky";
    case "completed":
      return "emerald";
    case "on hold":
      return "amber";
    case "delivered":
      return "royal";
    case "not started":
    default:
      return "slate";
  }
}

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  // Fetch projects and join with organizations to get the client name
  const { data: projectsData, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      target_date,
      client_org:organizations ( name )
    `)
    .order("created_at", { ascending: false });

  // Map to the shape our table expects
  const projects: ProjectRow[] = (projectsData || []).map((p: any) => ({
    id: p.id,
    display_id: p.id.split("-")[0].toUpperCase(), // Just a short segment for UI purposes since po_reference or display_id might not exist
    name: p.name,
    clientName: p.client_org?.name || "Unknown Client",
    target_date: p.target_date || "N/A",
    status: p.status || "Not Started",
  }));

  const columns: Column<ProjectRow>[] = [
    {
      key: "id",
      header: "Project ID",
      cell: (row) => <span className="font-jetbrains-mono font-medium">{row.display_id}</span>,
    },
    {
      key: "name",
      header: "Name",
      cell: (row) => <span className="font-semibold">{row.name}</span>,
    },
    {
      key: "client",
      header: "Client",
      cell: (row) => row.clientName,
    },
    {
      key: "target_date",
      header: "Target Date",
      cell: (row) => (
        <span className="font-jetbrains-mono">
          {row.target_date !== "N/A"
            ? new Date(row.target_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge tone={getStatusTone(row.status)} label={row.status} />
      ),
    },
    {
      key: "actions",
      header: "Quick Actions",
      cell: (row) => (
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Link
            href={`/admin/projects/${row.id}`}
            className="hover:text-primary transition-colors"
            title="View Details"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
          <button className="hover:text-semantic-amber transition-colors" title="Edit">
            <EditIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
      {/* Header section with title and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Project Tracking Hub</h1>
          <p className="text-on-surface-variant font-inter mt-1">
            Manage and oversee all active client engagements and operational delivery.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <PlusIcon className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Error state if fetch failed */}
      {error && (
        <div className="bg-semantic-crimson/10 text-semantic-crimson p-4 rounded-md font-inter text-sm border border-semantic-crimson/20">
          Failed to load projects: {error.message}
        </div>
      )}

      {/* Main Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={projects} />
      </div>
    </div>
  );
}
