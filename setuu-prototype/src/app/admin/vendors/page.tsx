"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { BarChart } from "@/components/ui/BarChart";
import { Plus, MoreVertical, Search, Download } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { TextInput } from "@/components/ui/TextInput";

const mockVendors = [
  { id: "VND-1001", name: "BuildTech Concrete", category: "Materials", status: "active", sla: "98%", contracts: 14 },
  { id: "VND-1002", name: "Metro MEP Services", category: "Subcontractor", status: "active", sla: "92%", contracts: 3 },
  { id: "VND-1003", name: "Acme Heavy Machinery", category: "Equipment", status: "pending", sla: "-", contracts: 0 },
  { id: "VND-1004", name: "Global Steel Co", category: "Materials", status: "active", sla: "88%", contracts: 8 },
  { id: "VND-1005", name: "Apex Architecture", category: "Consultant", status: "inactive", sla: "95%", contracts: 1 },
];

const categoryData = [
  { name: "Materials", count: 42 },
  { name: "Subcontractors", count: 28 },
  { name: "Equipment", count: 15 },
  { name: "Consultants", count: 12 },
  { name: "Logistics", count: 8 },
];

export default function VendorRegistryPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const columns = [
    { 
      key: "name_id", 
      header: "Vendor", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <Link href={`/admin/vendors/${row.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors">{row.name}</Link>
          <span className="text-xs text-on-surface-variant font-jetbrains">{row.id}</span>
        </div>
      )
    },
    { 
      key: "category", 
      header: "Category", 
      sortable: true,
      cell: (row: any) => <span className="text-sm font-medium text-on-surface-variant">{row.category}</span>
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "active" ? "emerald" : row.status === "pending" ? "amber" : "slate"} 
          label={row.status} 
        />
      )
    },
    { 
      key: "sla", 
      header: "SLA Adherence", 
      sortable: true,
      cell: (row: any) => (
        <span className={`font-jetbrains font-bold text-sm ${
          row.sla === "-" ? "text-on-surface-variant" : 
          parseInt(row.sla) > 95 ? "text-semantic-emerald" : 
          parseInt(row.sla) > 90 ? "text-semantic-amber" : "text-semantic-crimson"
        }`}>
          {row.sla}
        </span>
      )
    },
    { 
      key: "contracts", 
      header: "Active Contracts", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.contracts}</span>
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
        title="Vendor Registry" 
        subtitle="Manage suppliers, subcontractors, and external partners"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span>Admin</span>
            <span>/</span>
            <span>Vendors</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export Directory
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Onboard Vendor
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            <FilterBar onClear={() => {}} onApply={() => {}}>
              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <TextInput placeholder="Search vendors by name or ID..." className="pl-9" />
              </div>
              <SelectMenu 
                options={[
                  { label: "All Categories", value: "" },
                  { label: "Materials", value: "materials" },
                  { label: "Subcontractor", value: "subcontractor" },
                  { label: "Equipment", value: "equipment" },
                ]}
                value=""
                onChange={() => {}}
              />
              <SelectMenu 
                options={[
                  { label: "All Statuses", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Pending Onboarding", value: "pending" },
                  { label: "Inactive/Blacklisted", value: "inactive" },
                ]}
                value=""
                onChange={() => {}}
              />
            </FilterBar>

            <Card className="flex-1 min-h-[400px]">
              <DataTable 
                data={mockVendors}
                columns={columns}
                getRowId={(row: any) => row.id}
                selectable={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </Card>
          </div>

          {/* Context Sidebar */}
          <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
            <Card className="p-5">
              <h3 className="font-merriweather font-bold text-on-surface mb-4">Vendors by Category</h3>
              <div className="h-48 mb-2">
                <BarChart data={categoryData} keys={["count"]} colors={["var(--primary)"]} />
              </div>
            </Card>

            <Card className="p-5 bg-surface-variant/30 border-outline-variant">
              <h3 className="font-merriweather font-bold text-on-surface mb-2">Vendor Performance</h3>
              <p className="text-sm text-on-surface-variant mb-4">Analyze SLA adherence, delivery timeliness, and quality scorecards across your vendor network.</p>
              <Link href="/admin/vendors/performance" className="block text-center w-full py-2 bg-surface text-primary border border-primary/30 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                View Performance Matrix
              </Link>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
