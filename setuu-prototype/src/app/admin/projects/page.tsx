"use client";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/BarChart";
import { Select } from "@/components/ui/Select";
import { Plus, Download, MoreVertical, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProjects, getResourceAllocationData, getCriticalPathMilestones } from "@/app/actions/projectActions";



export default function ProjectTrackingHub() {
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pmFilter, setPmFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceData, setResourceData] = useState<{ label: string, value: number }[]>([]);
  const [criticalMilestones, setCriticalMilestones] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const filteredProjects = projects.filter((p) => {
    const matchesQ = q ? (p.name?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q)) : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesType = typeFilter ? p.type === typeFilter : true;
    const matchesPm = pmFilter ? p.pm_name === pmFilter : true;
    return matchesQ && matchesStatus && matchesType && matchesPm;
  });

  useEffect(() => {
    getProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects", err);
        setLoading(false);
      });

    getResourceAllocationData().then(setResourceData).catch(console.error);
    getCriticalPathMilestones().then(setCriticalMilestones).catch(console.error);
  }, []);

  const columns = [
    {
      key: "id_name",
      header: "Project",
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <Link href={`/admin/projects/${row.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors">{row.name}</Link>
          
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => <StatusBadge tone={row.status === "Not Started" ? "slate" : row.status === "In Progress" ? "sky" : row.status === "Completed" ? "emerald" : "amber"} label={row.status} />
    },
    { key: "type", header: "Discipline", sortable: true, cell: (row: any) => <span>{row.type || "General"}</span> },
    { key: "pm_name", header: "Assigned PM", sortable: true, cell: (row: any) => <span>{row.pm_name || "Unassigned"}</span> },
    { key: "start_date", header: "Start Date", sortable: true, cell: (row: any) => <span className="font-jetbrains text-sm">{row.start_date ? new Date(row.start_date).toLocaleDateString() : "--"}</span> },
    { key: "target_date", header: "Target Date", sortable: true, cell: (row: any) => <span className="font-jetbrains text-sm">{row.target_date ? new Date(row.target_date).toLocaleDateString() : "--"}</span> },
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
          <FilterBar onClear={() => { }} onApply={() => { }}>
            <Select
              options={[
                { label: "All Statuses", value: "" },
                { label: "Not Started", value: "Not Started" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "At Risk", value: "At Risk" },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
            />
            <Select
              options={[
                { label: "All Disciplines", value: "" },
                { label: "Architecture", value: "Architecture" },
                { label: "Structural", value: "Structural" },
                { label: "MEP", value: "MEP" },
              ]}
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
            />
            <Select
              options={[
                { label: "All PMs", value: "" },
                ...Array.from(new Set(projects.map(p => p.pm_name).filter(Boolean))).map(pm => ({ label: pm, value: pm }))
              ]}
              value={pmFilter}
              onChange={(val) => setPmFilter(val)}
            />
            {/* Date range mock */}
            <div className="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-sm text-on-surface flex items-center min-w-[200px]">
              Select Date Range...
            </div>
          </FilterBar>

          <Card className="flex-1 min-h-[400px]">
            <DataTable
              data={filteredProjects}
              columns={columns}
              getRowId={(row: any) => row.id}
              selectable={true}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              isLoading={loading}
            />
          </Card>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
          <Card className="p-5">
            <h3 className="font-merriweather font-bold text-on-surface mb-4">Critical Path Milestones</h3>
            <div className="space-y-4">
              {criticalMilestones.map(m => (
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
              <BarChart data={resourceData} keys={["value"]} colors={["var(--primary)"]} />
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
