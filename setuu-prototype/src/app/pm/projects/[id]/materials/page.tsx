"use client";
import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon, ScanLineIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectMaterialsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [materials, setMaterials] = useState([
    { id: "MAT-101", item: "Portland Cement (Type I)", quantity: "500 bags", status: "In Stock", nextDelivery: "-" },
    { id: "MAT-102", item: "Rebar #5 (5/8 inch)", quantity: "150 tons", status: "Low Stock", nextDelivery: "Aug 20" },
    { id: "MAT-103", item: "HVAC Ducting", quantity: "0 m", status: "Awaiting", nextDelivery: "Aug 22" }
  ]);

  const handleOrder = () => {
    setMaterials([...materials, {
        id: `MAT-${Math.floor(Math.random() * 900) + 100}`,
        item: "New Custom Material Order",
        quantity: "100 units",
        status: "Awaiting",
        nextDelivery: "TBD"
    }]);
  };

  const columns = [
    { key: "id", header: "SKU", cell: (row: any) => <span className="font-jetbrains-mono text-xs text-outline">{row.id}</span> },
    { key: "item", header: "Item Description", sortable: true, cell: (row: any) => <span className="font-medium text-on-surface">{row.item}</span> },
    { key: "quantity", header: "Quantity", cell: (row: any) => <>{row.quantity}</> },
    {
      key: "status", header: "Status", cell: (row: any) => (
        <StatusBadge
          tone={row.status === "In Stock" ? "emerald" : row.status === "Low Stock" ? "amber" : "sky"}
          label={row.status}
        />
      )
    },
    { key: "nextDelivery", header: "Next Delivery", cell: (row: any) => <span className="text-sm">{row.nextDelivery}</span> }
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

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={materials} columns={columns} />
      </div>
    </div>
  );
}
