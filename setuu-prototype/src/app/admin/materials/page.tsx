"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { MoreVertical, Search, Download, Camera, PackagePlus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { useEffect } from "react";
import { getMaterials } from "@/app/actions/materialActions";

// mockMaterials removed, using live data

export default function MasterMaterialTrackingPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaterials()
      .then(data => {
        setMaterials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch materials", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    { 
      key: "name_spec", 
      header: "Item & Spec", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.item_name}</span>
          <span className="text-xs text-on-surface-variant font-jetbrains">{row.spec_id || "--"}</span>
        </div>
      )
    },
    { 
      key: "project", 
      header: "Project", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface-variant">{row.project_name || "Unknown"}</span>
    },
    { 
      key: "po_supplier", 
      header: "PO & Supplier", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <Link href="#" className="font-jetbrains text-primary hover:underline text-sm">{row.po_number || "--"}</Link>
          <span className="text-xs text-on-surface-variant">{row.supplier_name || "--"}</span>
        </div>
      )
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={
            row.status === "Delivered" ? "emerald" : 
            row.status === "In Transit" ? "sky" : 
            row.status === "Delayed" ? "crimson" : "slate"
          } 
          label={row.status} 
        />
      )
    },
    { 
      key: "dates", 
      header: "Delivery (Est / Act)", 
      cell: (row: any) => (
        <div className="flex flex-col font-jetbrains text-sm">
          <span className="text-on-surface-variant">E: {row.estimated_delivery ? new Date(row.estimated_delivery).toLocaleDateString() : "--"}</span>
          <span className={row.status === "Delivered" ? "text-semantic-emerald font-bold" : "text-on-surface-variant/50"}>
            A: {row.actual_delivery ? new Date(row.actual_delivery).toLocaleDateString() : "--"}
          </span>
        </div>
      )
    },
    { 
      key: "actions", 
      header: "", 
      cell: () => (
        <button className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Master Material Tracking" 
        subtitle="Track purchase orders, field receipts, and incoming manifests across all projects"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Materials</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors hidden sm:flex">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary bg-primary/10 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Receipt</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <PackagePlus className="w-4 h-4" />
              Receive PO
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full">
        <Card className="flex flex-col min-h-[500px]">
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search item, PO, or spec ID..." className="pl-9" />
            </div>
            <Select 
              options={[
                { label: "All Projects", value: "" },
                { label: "Alpha Tower", value: "alpha" },
                { label: "Beta Complex", value: "beta" },
                { label: "Gamma Hub", value: "gamma" },
              ]}
              value=""
              onChange={() => {}}
            />
            <Select 
              options={[
                { label: "All Statuses", value: "" },
                { label: "Pending", value: "pending" },
                { label: "In Transit", value: "transit" },
                { label: "Delivered", value: "delivered" },
                { label: "Delayed", value: "delayed" },
              ]}
              value=""
              onChange={() => {}}
            />
          </FilterBar>

          <Card className="flex-1 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-on-surface-variant py-20">Loading materials...</div>
            ) : (
              <DataTable 
                data={materials}
                columns={columns}
                getRowId={(row: any) => row.id}
                selectable={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            )}
          </Card>
        </Card>
      </div>
    </div>
  );
}
