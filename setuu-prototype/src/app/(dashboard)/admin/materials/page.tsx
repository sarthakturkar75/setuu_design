import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

export const metadata = {
  title: "Master Material Tracking | Setuu",
};

export default async function MaterialsPage() {
  const supabase = await createClient();

  const { data: materials } = await supabase
    .from("project_materials")
    .select(`
      id,
      item_name,
      quantity,
      status,
      po_number,
      spec_id,
      expected_arrival_date,
      projects(name),
      organizations(name)
    `)
    .order("created_at", { ascending: false });

  const rows = (materials || []).map((m: any) => ({
    id: m.id,
    project: m.projects?.name || "Unknown Project",
    item: m.item_name,
    po: m.po_number || "N/A",
    spec: m.spec_id || "N/A",
    qty: m.quantity,
    vendor: m.organizations?.name || "Unassigned",
    status: m.status || "Pending",
  }));

  const columns: Column<any>[] = [
    {
      key: "project",
      header: "Project",
      cell: (row) => <span className="font-medium text-on-surface">{row.project}</span>,
    },
    {
      key: "po",
      header: "PO Number",
      cell: (row) => <span className="font-jetbrains-mono text-sm tracking-wide">{row.po}</span>,
    },
    {
      key: "spec",
      header: "Spec ID",
      cell: (row) => <span className="font-jetbrains-mono text-sm tracking-wide text-on-surface-variant">{row.spec}</span>,
    },
    {
      key: "item",
      header: "Item Description",
      cell: (row) => row.item,
    },
    {
      key: "qty",
      header: "Qty",
      cell: (row) => row.qty,
    },
    {
      key: "vendor",
      header: "Vendor",
      cell: (row) => row.vendor,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        let tone: any = "slate";
        const st = row.status?.toLowerCase();
        if (st === "delivered" || st === "received") tone = "emerald";
        if (st === "in transit" || st === "shipped") tone = "sky";
        if (st === "delayed" || st === "issue") tone = "crimson";
        if (st === "ordered") tone = "amber";
        return <StatusBadge tone={tone} label={row.status} />;
      },
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <EyeIcon className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-[90rem] mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Master Material Tracking</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Global overview of procurement, shipments, and receiving across all active projects.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
