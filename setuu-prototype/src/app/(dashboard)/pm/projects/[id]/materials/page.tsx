import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PackageSearchIcon } from "lucide-react";

export const metadata = {
  title: "Materials Ledger | Setuu",
};

export default async function ProjectMaterialsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: materials } = await supabase
    .from("project_materials")
    .select(`
      id,
      po_number,
      material_name,
      spec_id,
      status,
      delivery_date,
      tracking_number,
      vendor:project_vendors(vendor:org_vendors(name))
    `)
    .eq("project_id", params.id)
    .order("delivery_date", { ascending: false });

  const columns = [
    {
      header: "PO Number",
      key: "po_number",
      cell: (row: any) => <span className="font-jetbrains-mono font-medium text-primary">{row.po_number}</span>,
    },
    {
      header: "Material / Component",
      key: "material_name",
      cell: (row: any) => <span className="font-medium text-on-surface">{row.material_name}</span>,
    },
    {
      header: "Spec ID",
      key: "spec_id",
      cell: (row: any) => <span className="font-jetbrains-mono text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{row.spec_id}</span>,
    },
    {
      header: "Vendor",
      key: "vendor",
      cell: (row: any) => <span className="text-sm">{row.vendor?.vendor?.name || "Unassigned"}</span>,
    },
    {
      header: "Status",
      key: "status",
      cell: (row: any) => (
        <StatusBadge 
          tone={
            row.status === "Delivered" ? "emerald" :
            row.status === "In Transit" ? "sky" :
            row.status === "Delayed" ? "crimson" : "slate"
          } 
          label={row.status || "Pending"} 
        />
      ),
    },
    {
      header: "Est. Delivery",
      key: "delivery_date",
      cell: (row: any) => <span className="text-sm">{row.delivery_date ? new Date(row.delivery_date).toLocaleDateString() : "TBD"}</span>,
    },
    {
      header: "Tracking",
      key: "tracking_number",
      cell: (row: any) => (
        <span className="font-jetbrains-mono text-xs tracking-wider text-on-surface-variant hover:text-primary hover:underline cursor-pointer">
          {row.tracking_number || "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-[100rem] mx-auto w-full pb-20">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Project Materials Ledger</h1>
          <p className="text-sm text-on-surface-variant font-inter mt-1">Track POs, specs, and delivery ETAs for this deployment.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded font-medium text-sm transition-colors">
          <PackageSearchIcon className="w-4 h-4" />
          Request Material
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <DataTable 
            data={materials || []} 
            columns={columns}
          />
        </div>
      </div>

    </div>
  );
}
