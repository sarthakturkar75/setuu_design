"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { KPICard } from "@/components/ui/KPICard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Archive, Download, Server, FileWarning, ShieldCheck, Scale, RefreshCcw, Trash2, Search } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getProjects } from "@/app/actions/projectActions";

export default function ArchiveManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [archives, setArchives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProjects({ is_archived: true });
        setArchives(data || []);
      } catch (e) {
        console.error("Failed to load archives", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns = [
    { 
      key: "record", 
      header: "Record Identity", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.name}</span>
          
        </div>
      )
    },
    { 
      key: "module", 
      header: "Origin Module", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface-variant">Projects</span>
    },
    { 
      key: "policy", 
      header: "Retention Policy",
      cell: (row: any) => <span className="font-medium text-on-surface">Permanent</span>
    },
    { 
      key: "created_at", 
      header: "Archived Date", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.created_at ? new Date(row.created_at).toLocaleDateString() : "Unknown"}</span>
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <StatusBadge 
            tone={row.status === "Secure" ? "emerald" : row.status === "Legal Hold" ? "amber" : "crimson"} 
            label={row.status || "Unknown"} 
          />
        </div>
      )
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            <RefreshCcw className="w-4 h-4" /> Restore
          </button>
          <button className="text-sm font-semibold text-crimson hover:underline flex items-center gap-1" disabled={row.status === "Secure"}>
            <Trash2 className="w-4 h-4" /> Purge
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Archive & Data Retention Manager" 
        subtitle="Manage long-term storage, compliance holds, and automated data purging"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Archive</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <Download className="w-4 h-4" />
            Export Audit
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Total Cold Storage" 
            value={`${(([].totalStorageGb || 0)/1024).toFixed(1)} TB`} 
            trend={{ value: 4, label: "from last month", isPositive: false }}
            icon={<Server className="w-5 h-5 text-on-surface-variant" />}
          />
          <KPICard 
            title="Archived Records" 
            value={[].totalUsers ? [].totalUsers * 420 : 0} 
            trend={{ value: 12, label: "from last month", isPositive: true }}
            icon={<Archive className="w-5 h-5 text-on-surface-variant" />}
          />
          <KPICard 
            title="Pending Purge" 
            value={[].totalProjects ? [].totalProjects * 2 : 0} 
            trend={{ value: 2, label: "due this week", isPositive: false }}
            icon={<FileWarning className="w-5 h-5 text-crimson" />}
          />
          <Card className="p-6 flex items-center justify-between bg-emerald-500/10 border-semantic-emerald/30">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-semantic-emerald uppercase tracking-wider">Compliance Grade</span>
              <span className="text-4xl font-bold text-semantic-emerald mt-1">A+</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface shadow-elevation-l1 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-semantic-emerald" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Legal Holds & Compliance Events */}
          <div className="col-span-1 flex flex-col gap-6">
            <Card className="flex flex-col">
              <div className="p-4 border-b border-outline-variant bg-surface-variant/30 flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2">
                  <Scale className="w-4 h-4 text-semantic-amber" /> Active Legal Holds
                </h3>
                <span className="text-xs font-bold bg-semantic-amber text-on-primary px-2 py-0.5 rounded-full">3 Active</span>
              </div>
              <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                
                <div className="p-4 rounded-lg border border-semantic-amber/50 bg-semantic-amber/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-on-surface">Subcontractor Dispute #884</span>
                    <span className="text-xs font-jetbrains text-semantic-amber">HLD-001</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Prevents deletion or modification of any financial or timesheet records related to "Alpha Tower" from Q3 2024 to Q1 2025.
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-semantic-amber/20">
                    <span className="text-xs text-on-surface-variant font-medium">Applied: Oct 12, 2025</span>
                    <button className="text-xs font-semibold text-primary hover:underline">Manage</button>
                  </div>
                </div>

              </div>
            </Card>

            <Card className="flex flex-col flex-1">
              <div className="p-4 border-b border-outline-variant bg-surface-variant/30 flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-semantic-emerald" /> Recent Compliance Events
                </h3>
              </div>
              <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                <div className="flex flex-col gap-1 pb-3 border-b border-outline-variant/50">
                  <span className="text-xs font-jetbrains text-on-surface-variant">Today, 14:22 UTC</span>
                  <span className="text-sm font-medium text-on-surface">Automated Purge Completed</span>
                  <span className="text-xs text-on-surface-variant">Purged 1,420 expired visitor logs according to 30-day retention policy.</span>
                </div>
                <div className="flex flex-col gap-1 pb-3 border-b border-outline-variant/50">
                  <span className="text-xs font-jetbrains text-on-surface-variant">Yesterday, 09:00 UTC</span>
                  <span className="text-sm font-medium text-on-surface">Legal Hold HLD-001 Applied</span>
                  <span className="text-xs text-on-surface-variant">Hold successfully locked 14,022 records from modification/deletion.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-jetbrains text-on-surface-variant">Oct 12, 11:45 UTC</span>
                  <span className="text-sm font-medium text-on-surface">Quarterly Audit Backup Verification</span>
                  <span className="text-xs text-on-surface-variant text-semantic-emerald">Verified matching SHA-256 hashes for all Q2 cold storage vaults.</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Archived Records Table */}
          <Card className="col-span-1 lg:col-span-2 flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">Archived Records Repository</h3>
            </div>
            <FilterBar onClear={() => {}} onApply={() => {}}>
              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <TextInput placeholder="Search record ID or name..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select 
                options={[
                  { label: "All Modules", value: "" },
                  { label: "Financials", value: "fin" },
                  { label: "Projects", value: "proj" },
                  { label: "Vendors", value: "ven" },
                ]}
                value={moduleFilter}
                onChange={(val) => setModuleFilter(val)}
              />
            </FilterBar>

            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading archives...</div>
            ) : (
              <DataTable 
                data={archives}
                columns={columns}
                getRowId={(row: any) => row.id}
              />
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
