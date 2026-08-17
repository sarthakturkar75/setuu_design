"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { TextInput } from "@/components/ui/TextInput";
import { Search, UserPlus, FileSpreadsheet, Clock, CheckCircle2, MoreVertical, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockResources = [
  { id: "RES-001", project: "Alpha Tower", group: "Structural Engineering", allocated: 450, actual: 425, variance: -25, status: "Under Budget" },
  { id: "RES-002", project: "Alpha Tower", group: "Site Management", allocated: 200, actual: 215, variance: 15, status: "Over Budget" },
  { id: "RES-003", project: "Beta Complex", group: "MEP Subcontractors", allocated: 800, actual: 800, variance: 0, status: "On Track" },
  { id: "RES-004", project: "Gamma Hub", group: "Heavy Machinery Ops", allocated: 320, actual: 380, variance: 60, status: "Critical Overrun" },
  { id: "RES-005", project: "Gamma Hub", group: "Safety Inspectors", allocated: 120, actual: 95, variance: -25, status: "Under Budget" },
];

export default function ResourceHubPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const getVarianceNode = (variance: number) => {
    if (variance === 0) return <span className="text-on-surface-variant">0 hrs</span>;
    if (variance > 0) return <span className="text-crimson font-bold flex items-center gap-1">+{variance} <TrendingUp className="w-3 h-3" /></span>;
    return <span className="text-emerald-500 font-bold flex items-center gap-1">{variance} <TrendingDown className="w-3 h-3" /></span>;
  };

  const columns = [
    { 
      key: "group_id", 
      header: "Resource Group", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.group}</span>
          <span className="text-xs text-on-surface-variant font-jetbrains">{row.id}</span>
        </div>
      )
    },
    { 
      key: "project", 
      header: "Project", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface-variant">{row.project}</span>
    },
    { 
      key: "allocated", 
      header: "Allocated", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-on-surface">{row.allocated} hrs</span>
    },
    { 
      key: "actual", 
      header: "Actual Logged", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-on-surface font-medium">{row.actual} hrs</span>
    },
    { 
      key: "variance", 
      header: "Variance",
      cell: (row: any) => getVarianceNode(row.variance)
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={
            row.status === "Under Budget" ? "emerald" : 
            row.status === "On Track" ? "sky" : 
            row.status === "Over Budget" ? "amber" : "crimson"
          } 
          label={row.status} 
        />
      )
    },
    { 
      key: "actions", 
      header: "", 
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-surface-variant rounded-md text-on-surface-variant hover:text-primary transition-colors" title="View Timesheet">
            <Clock className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-emerald-500/10 rounded-md text-on-surface-variant hover:text-semantic-emerald transition-colors" title="Approve Hours">
            <CheckCircle2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-surface-variant rounded-md text-on-surface-variant transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Resource & Timesheet Management" 
        subtitle="Track labor utilization, approve timesheets, and manage workforce allocation"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Resources</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/resources/analytics" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <TrendingUp className="w-4 h-4" />
              Advanced Analytics
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
              <UserPlus className="w-4 h-4" />
              Assign Resource
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        {/* Analytics Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 col-span-1 lg:col-span-2 flex flex-col">
            <h3 className="font-semibold text-on-surface mb-4">Resource Allocation by Project (Actual vs Allocated)</h3>
            <div className="flex-1 min-h-[200px] flex items-end gap-6 border-b border-l border-outline-variant p-4 relative pt-10">
              {/* Mock Grouped Bar Chart */}
              <div className="absolute top-2 right-4 flex items-center gap-4 text-xs font-medium text-on-surface-variant">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-outline-variant" /> Allocated</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary" /> Actual</div>
              </div>
              
              {/* Project 1 */}
              <div className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <div className="flex items-end gap-1 h-full w-full justify-center">
                  <div className="w-8 md:w-12 bg-outline-variant/30 rounded-t-sm h-[80%]" title="650 Allocated" />
                  <div className="w-8 md:w-12 bg-primary/80 rounded-t-sm h-[75%]" title="640 Actual" />
                </div>
                <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">Alpha Tower</span>
              </div>
              
              {/* Project 2 */}
              <div className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <div className="flex items-end gap-1 h-full w-full justify-center">
                  <div className="w-8 md:w-12 bg-outline-variant/30 rounded-t-sm h-[95%]" title="800 Allocated" />
                  <div className="w-8 md:w-12 bg-primary/80 rounded-t-sm h-[95%]" title="800 Actual" />
                </div>
                <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">Beta Complex</span>
              </div>
              
              {/* Project 3 */}
              <div className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <div className="flex items-end gap-1 h-full w-full justify-center">
                  <div className="w-8 md:w-12 bg-outline-variant/30 rounded-t-sm h-[50%]" title="440 Allocated" />
                  <div className="w-8 md:w-12 bg-crimson/80 rounded-t-sm h-[60%]" title="475 Actual" />
                </div>
                <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap">Gamma Hub</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-center bg-surface-variant/30 border-dashed border-2 border-outline-variant items-center text-center">
            <div className="w-16 h-16 rounded-full bg-semantic-amber/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-semantic-amber" />
            </div>
            <h3 className="text-3xl font-bold text-on-surface font-jetbrains">+75 hrs</h3>
            <p className="text-on-surface-variant font-medium mt-1">Portfolio Variance (Overrun)</p>
            <p className="text-sm text-on-surface-variant/70 mt-4 leading-relaxed max-w-[250px]">
              Gamma Hub Heavy Machinery Operations is the primary driver of this overrun.
            </p>
          </Card>
        </div>

        {/* Productivity Matrix Table */}
        <Card className="flex flex-col flex-1 min-h-[400px]">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-semibold text-on-surface">Productivity Matrix</h3>
          </div>
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search resource group..." className="pl-9" />
            </div>
            <SelectMenu 
              options={[
                { label: "All Projects", value: "" },
                { label: "Alpha Tower", value: "alpha" },
                { label: "Beta Complex", value: "beta" },
                { label: "Gamma Hub", value: "gamma" },
              ]}
              value=""
              onChange={() => {}}
            />
          </FilterBar>

          <DataTable 
            data={mockResources}
            columns={columns}
            getRowId={(row: any) => row.id}
            selectable={true}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </Card>
      </div>
    </div>
  );
}
