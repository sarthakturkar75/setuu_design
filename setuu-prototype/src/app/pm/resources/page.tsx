"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FilterBar } from "@/components/ui/FilterBar";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import Link from "next/link";
import { TrendingUp, FileSpreadsheet, UserPlus, Clock, CheckCircle2, MoreVertical, Search } from "lucide-react";
import { getProjectResources, getGlobalResourceAnalytics } from "@/app/actions/resourceActions";

export default function GlobalResourcesHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [resources, setResources] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resData, anData] = await Promise.all([
          getProjectResources(),
          getGlobalResourceAnalytics()
        ]);
        setResources(resData || []);
        setAnalytics(anData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredResources = resources.filter(r => 
    (!projectFilter || r.project_name === projectFilter) &&
    (!searchTerm || (r.name && r.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const columns = [
    { key: "name", header: "Resource Group / Individual", cell: (row: any) => <div className="font-medium text-on-surface flex items-center gap-2">{row.name}</div> },
    { key: "project_name", header: "Project", cell: (row: any) => <span className="text-sm font-medium">{row.project_name || "Unassigned"}</span> },
    { key: "resource_type", header: "Type", cell: (row: any) => <span className="text-sm text-on-surface-variant">{row.resource_type}</span> },
    { key: "allocated_hours", header: "Allocated", cell: (row: any) => <span className="font-jetbrains text-sm">{row.allocated_hours || 0}h</span> },
    { key: "actual_hours", header: "Actual", cell: (row: any) => <span className="font-jetbrains text-sm">{row.actual_hours || 0}h</span> },
    { 
      key: "status", 
      header: "Status", 
      cell: (row: any) => {
        const allocated = row.allocated_hours || 0;
        const actual = row.actual_hours || 0;
        const variance = actual - allocated;
        let status = "On Track";
        if (variance < 0) status = "Under Budget";
        if (variance > 0 && variance <= 50) status = "Over Budget";
        if (variance > 50) status = "Critical Overrun";

        return (
          <StatusBadge 
            tone={
              status === "Under Budget" ? "emerald" : 
              status === "On Track" ? "sky" : 
              status === "Over Budget" ? "amber" : "crimson"
            } 
            label={status} 
          />
        );
      }
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
        </div>
      )
    }
  ];

  const maxHours = analytics ? Math.max(10, ...analytics.topProjects.map((p: any) => Math.max(p.allocated, p.actual))) : 100;

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Resource & Timesheet Management" 
        subtitle="Track labor utilization, approve timesheets, and manage workforce allocation"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/pm" className="hover:text-primary transition-colors">PM</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Resources</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/pm/resources/analytics" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <TrendingUp className="w-4 h-4" />
              Advanced Analytics
            </Link>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        {loading ? (
           <div className="p-6 text-center animate-pulse text-on-surface-variant">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 col-span-1 lg:col-span-2 flex flex-col">
              <h3 className="font-semibold text-on-surface mb-4">Top 5 Projects Resource Allocation</h3>
              <div className="flex-1 min-h-[200px] flex items-end gap-6 border-b border-l border-outline-variant p-4 relative pt-10">
                <div className="absolute top-2 right-4 flex items-center gap-4 text-xs font-medium text-on-surface-variant">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-outline-variant" /> Allocated</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-primary" /> Actual</div>
                </div>
                
                {analytics?.topProjects.map((proj: any, idx: number) => {
                  const allocH = Math.max(10, (proj.allocated / maxHours) * 100);
                  const actH = Math.max(10, (proj.actual / maxHours) * 100);
                  const isOver = proj.actual > proj.allocated;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                      <div className="flex items-end gap-1 h-full w-full justify-center">
                        <div className="w-8 md:w-12 bg-outline-variant/30 rounded-t-sm" style={{ height: `${allocH}%` }} title={`${proj.allocated} Allocated`} />
                        <div className={`w-8 md:w-12 rounded-t-sm ${isOver ? 'bg-crimson/80' : 'bg-primary/80'}`} style={{ height: `${actH}%` }} title={`${proj.actual} Actual`} />
                      </div>
                      <span className="text-xs font-medium text-on-surface-variant whitespace-nowrap truncate max-w-[80px]" title={proj.name}>{proj.name}</span>
                    </div>
                  );
                })}
                {analytics?.topProjects.length === 0 && (
                   <div className="w-full text-center text-sm text-on-surface-variant pb-8">No resource allocations found.</div>
                )}
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-center bg-surface-variant/30 border-dashed border-2 border-outline-variant items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${analytics?.totalVariance > 0 ? 'bg-semantic-amber/10' : 'bg-semantic-emerald/10'}`}>
                <TrendingUp className={`w-8 h-8 ${analytics?.totalVariance > 0 ? 'text-semantic-amber' : 'text-semantic-emerald'}`} />
              </div>
              <h3 className="text-3xl font-bold text-on-surface font-jetbrains">{analytics?.totalVariance > 0 ? '+' : ''}{analytics?.totalVariance || 0} hrs</h3>
              <p className="text-on-surface-variant font-medium mt-1">Portfolio Variance {analytics?.totalVariance > 0 ? '(Overrun)' : '(Saved)'}</p>
              <p className="text-sm text-on-surface-variant/70 mt-4 leading-relaxed max-w-[250px]">
                {analytics?.totalVariance > 0 
                  ? "You have global actual hours exceeding allocations across the portfolio."
                  : "Overall portfolio is currently under budget for resource hours."}
              </p>
            </Card>
          </div>
        )}

        <Card className="flex flex-col flex-1 min-h-[400px]">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-semibold text-on-surface">Productivity Matrix</h3>
          </div>
          <FilterBar onClear={() => {setSearchTerm(""); setProjectFilter("");}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search resource..." className="pl-9" value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
            </div>
            <Select 
              options={[
              { label: "All Projects", value: "" },
              ...Array.from(new Set(resources.map(r => r.project_name).filter(Boolean))).map(p => ({ label: p as string, value: p as string }))
            ]}
            value={projectFilter}
            onChange={(val: any) => setProjectFilter(val.target.value)}
            />
          </FilterBar>

          <div className="p-4">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading resources...</div>
            ) : (
              <DataTable 
                data={filteredResources}
                columns={columns}
                getRowId={(row: any) => row.id}
                selectable={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
