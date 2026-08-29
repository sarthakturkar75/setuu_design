import { InviteModal } from "@/components/modals/InviteModal";
"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { BarChart } from "@/components/ui/BarChart";
import { Plus, MoreVertical, Search, Download } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { TextInput } from "@/components/ui/TextInput";

import { useEffect } from "react";
import { getVendors, getVendorCategoryData } from "@/app/actions/vendorActions";

export default function VendorRegistryPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getVendors(),
      getVendorCategoryData()
    ])
      .then(([vendorData, categoryData]) => {
        setVendors(vendorData);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load vendors", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    { 
      key: "name_id", 
      header: "Vendor", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <Link href={`/admin/vendors/${row.vendor_id}`} className="font-semibold text-on-surface hover:text-primary transition-colors">{row.name}</Link>
          <span className="text-xs text-on-surface-variant font-jetbrains">{row.vendor_id?.slice(0,8)}...</span>
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
          tone={row.status === "Active" ? "emerald" : row.status === "Pending" ? "amber" : "slate"} 
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
          !row.sla || row.sla === "-" ? "text-on-surface-variant" : 
          parseInt(row.sla) > 95 ? "text-semantic-emerald" : 
          parseInt(row.sla) > 90 ? "text-semantic-amber" : "text-semantic-crimson"
        }`}>
          {row.sla}%
        </span>
      )
    },
    { 
      key: "organization_name", 
      header: "Organization", 
      sortable: true,
      cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.organization_name || "Platform"}</span>
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
                <TextInput placeholder="Search vendors by name or ID..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select 
                options={[
                  { label: "All Categories", value: "" },
                  { label: "Materials", value: "Materials" },
                  { label: "Subcontractor", value: "Subcontractor" },
                  { label: "Equipment", value: "Equipment" },
                ]}
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val)}
              />
              <Select 
                options={[
                  { label: "All Statuses", value: "" },
                  { label: "Active", value: "Active" },
                  { label: "Pending Onboarding", value: "Pending" },
                  { label: "Inactive/Blacklisted", value: "Inactive" },
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
              />
            </FilterBar>

            <Card className="col-span-2 min-h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-on-surface-variant">Loading vendors...</div>
              ) : (
                <DataTable 
                  data={vendors}
                  columns={columns}
                  getRowId={(row: any) => row.id}
                  selectable={true}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
              )}
            </Card>
          </div>

          {/* Context Sidebar */}
          <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
            <Card className="p-5">
              <h3 className="font-merriweather font-bold text-on-surface mb-4">Vendors by Category</h3>
              <div className="h-48 mb-2">
                <BarChart data={categories} keys={["count"]} colors={["var(--primary)"]} />
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
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} defaultType="organization" />
    </div>
  );
}
