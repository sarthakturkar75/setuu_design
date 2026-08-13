import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

export const metadata = {
  title: "Client Approvals Tracker | Setuu",
};

type ApprovalRow = {
  id: string;
  type: string;
  project: string;
  itemTitle: string;
  date: string;
  status: string;
};

export default async function ClientApprovalsPage() {
  const supabase = await createClient();

  // Fetch formal client approvals
  const { data: approvalsData } = await supabase
    .from("client_approvals")
    .select(`
      id,
      document_title,
      status,
      created_at,
      project:projects(name)
    `)
    .order("created_at", { ascending: false });

  // Fetch field update acknowledgements
  const { data: acksData } = await supabase
    .from("acknowledgements")
    .select(`
      id,
      status,
      created_at,
      update:updates(
        caption,
        project:projects(name)
      )
    `)
    .order("created_at", { ascending: false });

  const rows: ApprovalRow[] = [
    ...(approvalsData || []).map((a: any) => ({
      id: a.id,
      type: "Document Approval",
      project: a.project?.name || "Unknown Project",
      itemTitle: a.document_title || "Untitled Document",
      date: a.created_at,
      status: a.status,
    })),
    ...(acksData || []).map((ack: any) => ({
      id: ack.id,
      type: "Field Update Acknowledgment",
      project: ack.update?.project?.name || "Unknown Project",
      itemTitle: ack.update?.caption || "Field Update",
      date: ack.created_at,
      status: ack.status,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const columns: Column<ApprovalRow>[] = [
    {
      key: "type",
      header: "Type",
      cell: (row) => <span className="text-sm text-on-surface-variant font-medium">{row.type}</span>,
    },
    {
      key: "project",
      header: "Project",
      cell: (row) => <span className="font-semibold text-on-surface">{row.project}</span>,
    },
    {
      key: "itemTitle",
      header: "Item Description",
      cell: (row) => row.itemTitle,
    },
    {
      key: "date",
      header: "Date Requested",
      cell: (row) => (
        <span className="font-jetbrains-mono">
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        let tone: "slate" | "royal" | "purple" | "emerald" | "amber" | "crimson" = "slate";
        const status = row.status?.toLowerCase() || "";
        
        if (status === "acknowledged" || status === "approved") {
          tone = "royal"; // Requested by prompt
        } else if (status === "needs discussion" || status === "rejected") {
          tone = "purple"; // Requested by prompt
        } else if (status === "pending") {
          tone = "amber";
        }
        
        return <StatusBadge tone={tone as any} label={row.status || "Pending"} />;
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <Link
          href={`/admin/projects/${row.project}`}
          className="text-on-surface-variant hover:text-primary transition-colors"
          title="View Details"
        >
          <EyeIcon className="w-4 h-4" />
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Client Approvals Tracker</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Monitor pending signatures, document sign-offs, and field update acknowledgements.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
