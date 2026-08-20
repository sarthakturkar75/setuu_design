"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon, ScanLineIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProjectMaterialsPage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();

  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const { getMaterials } = await import('@/app/actions/materialActions');
        const data = await getMaterials(id);
        setMaterials(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, [id]);

  const handleOrder = async () => {
    setLoading(true); // Optional: add UX feedback
    const { createMaterial, getMaterials } = await import('@/app/actions/materialActions');

    // FIX: Construct FormData to match the upgraded Server Action
    const formData = new FormData();
    formData.append("project_id", id);
    formData.append("name", "New Custom Material Order");
    formData.append("expected_delivery", new Date(Date.now() + 86400000 * 7).toISOString());

    await createMaterial(formData);

    // Optimistic reload
    const data = await getMaterials(id);
    setMaterials(data || []);
    setLoading(false);
  };

  const columns = [
    { key: "id", header: "SKU", cell: (row: any) => <span className="font-jetbrains-mono text-xs text-outline">{row.spec_id || row.id.split('-')[0]}</span> },
    { key: "item_name", header: "Item Description", sortable: true, cell: (row: any) => <span className="font-medium text-on-surface">{row.item_name}</span> },
    { key: "quantity", header: "Quantity", cell: (row: any) => <>{row.quantity}</> },
    {
      key: "status", header: "Status", cell: (row: any) => (
        <StatusBadge
          tone={row.status?.toLowerCase() === "in stock" || row.status === "Delivered" ? "emerald" : row.status === "Low Stock" ? "amber" : "sky"}
          label={row.status || "Unknown"}
        />
      )
    },
    { key: "expected_arrival_date", header: "Next Delivery", cell: (row: any) => <span className="text-sm">{row.expected_arrival_date ? new Date(row.expected_arrival_date).toLocaleDateString() : row.estimated_delivery ? new Date(row.estimated_delivery).toLocaleDateString() : "TBD"}</span> },
    { key: "actions", header: "", cell: (row: any) => (
      <button 
        onClick={async () => {
          if (confirm("Are you sure you want to delete this material?")) {
            const { deleteMaterial } = await import('@/app/actions/materialActions');
            await deleteMaterial(row.id);
            setMaterials(m => m.filter(x => x.id !== row.id));
          }
        }}
        className="text-semantic-crimson hover:bg-semantic-crimson/10 p-2 rounded"
      >
        Delete
      </button>
    ) }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Material Inventory</h2>
        <div className="flex items-center gap-3">
          <Link href={`/pm/projects/${id}/materials/receipt`} className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface hover:bg-surface-variant/80 rounded-lg text-sm font-medium transition-colors">
            <ScanLineIcon className="w-4 h-4" />
            Scan Receipt
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors" onClick={handleOrder}>
            <PlusIcon className="w-4 h-4" />
            Order Material
          </button>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-full p-12 text-on-surface-variant">Loading inventory...</div>
        ) : materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-on-surface-variant">
            <p>No materials tracked yet.</p>
            <button className="mt-4 text-primary hover:underline" onClick={handleOrder}>Add your first order</button>
          </div>
        ) : (
          <DataTable data={materials} columns={columns} />
        )}
      </div>
    </div>
  );
}
