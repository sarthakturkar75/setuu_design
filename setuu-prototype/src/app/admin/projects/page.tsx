"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/BarChart";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { Plus, Download, MoreVertical, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const mockProjects = [
  { id: "PRJ-1042", name: "Alpha Tower", status: "in_progress", discipline: "Architecture", pm: "Alice Chen", start: "2026-01-15", target: "2027-12-01" },
  { id: "PRJ-1045", name: "Beta Site", status: "on_hold", discipline: "Civil", pm: "Bob Smith", start: "2026-03-01", target: "2026-10-15" },
  { id: "PRJ-1048", name: "Gamma Facility", status: "completed", discipline: "MEP", pm: "Charlie Davis", start: "2025-06-10", target: "2026-07-20" },
  { id: "PRJ-1050", name: "Delta Complex", status: "not_started", discipline: "Structural", pm: "Alice Chen", start: "2026-09-01", target: "2028-05-30" },
];

const resourceAllocationData = [
  { label: "Architecture", value: 4500 },
  { label: "Structural", value: 3200 },
  { label: "MEP", value: 2800 },
  { label: "Civil", value: 1500 },
];

const criticalPathMilestones = [
  { id: 1, project: "Alpha Tower", name: "Foundation Pour", daysLeft: 4, status: "critical" },
  { id: 2, project: "Beta Site", name: "Site Clearance", daysLeft: 12, status: "warning" },
  { id: 3, project: "Gamma Facility", name: "Final Inspection", daysLeft: 2, status: "critical" },
];

export default function ProjectTrackingHub() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const columns = [
    { 
      key: "id_name", 
      header: "Project", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <Link href={`/admin/projects/${row.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors">{row.name}</Link>
          <span className="text-xs font-jetbrains text-on-surface-variant">{row.id}</span>
        </div>
      )
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => <StatusBadge tone={row.status as any} label={row.status} />
    },
    { key: "discipline", header: "Discipline", sortable: true, cell: (row: any) => <span>{row.discipline}</span> },
    { key: "pm", header: "Assigned PM", sortable: true, cell: (row: any) => <span>{row.pm}</span> },
    { key: "start", header: "Start Date", sortable: true, cell: (row: any) => <span className="font-jetbrains text-sm">{row.start}</span> },
    { key: "target", header: "Target Date", sortable: true, cell: (row: any) => <span className="font-jetbrains text-sm">{row.target}</span> },
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
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader 
        title="Project Tracking Hub" 
        subtitle="Manage and monitor all active initiatives"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span>Admin</span>
            <span>/</span>
            <span>Projects</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <SelectMenu 
              options={[
                { label: "All Statuses", value: "" },
                { label: "In Progress", value: "in_progress" },
                { label: "On Hold", value: "on_hold" },
                { label: "Completed", value: "completed" },
              ]}
              value=""
              onChange={() => {}}
            />
            <SelectMenu 
              options={[
                { label: "All Disciplines", value: "" },
                { label: "Architecture", value: "Architecture" },
                { label: "Structural", value: "Structural" },
                { label: "MEP", value: "MEP" },
              ]}
              value=""
              onChange={() => {}}
            />
            <SelectMenu 
              options={[
                { label: "All PMs", value: "" },
                { label: "Alice Chen", value: "Alice Chen" },
                { label: "Bob Smith", value: "Bob Smith" },
              ]}
              value=""
              onChange={() => {}}
            />
            {/* Date range mock */}
            <div className="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-sm text-on-surface flex items-center min-w-[200px]">
              Select Date Range...
            </div>
          </FilterBar>

          <Card className="flex-1 min-h-[400px]">
            <DataTable 
              data={mockProjects}
              columns={columns}
              getRowId={(row: any) => row.id}
              selectable={true}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </Card>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
          <Card className="p-5">
            <h3 className="font-merriweather font-bold text-on-surface mb-4">Critical Path Milestones</h3>
            <div className="space-y-4">
              {criticalPathMilestones.map(m => (
                <div key={m.id} className="p-3 border border-outline-variant rounded-lg bg-surface-variant/30 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-on-surface">{m.name}</h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.status === 'critical' ? 'bg-semantic-crimson/10 text-semantic-crimson' : 'bg-semantic-amber/10 text-semantic-amber'}`}>
                      {m.daysLeft} Days
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <MapPin className="w-3 h-3" />
                    <span>{m.project}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-merriweather font-bold text-on-surface mb-4">Resource Allocation (Hrs)</h3>
            <div className="h-48">
              <BarChart data={resourceAllocationData} keys={["value"]} colors={["var(--primary)"]} />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
