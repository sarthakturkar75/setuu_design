"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Map, Users, AlertTriangle, Replace, Truck, Wrench, ShieldAlert } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockConflicts = [
  { id: "CFL-882", type: "Double Booking", resource: "Heavy Crane A1", project: "Alpha / Beta", status: "Critical", date: "Oct 18, 2026" },
  { id: "CFL-881", type: "Shortage", resource: "Master Electricians", project: "Gamma Hub", status: "Warning", date: "Oct 19, 2026" },
  { id: "CFL-880", type: "Certification Expired", resource: "Safety Officer (SJ)", project: "Alpha Tower", status: "Resolved", date: "Oct 15, 2026" },
];

export default function ResourceAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"workforce" | "materials" | "machinery">("workforce");

  const columns = [
    { 
      key: "conflict", 
      header: "Conflict", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface">{row.type}</span>
          <span className="text-xs text-on-surface-variant font-jetbrains">{row.id}</span>
        </div>
      )
    },
    { 
      key: "resource", 
      header: "Resource Type", 
      cell: (row: any) => <span className="text-on-surface font-medium">{row.resource}</span>
    },
    { 
      key: "project", 
      header: "Assigned Project(s)", 
      cell: (row: any) => <span className="text-on-surface-variant">{row.project}</span>
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "Critical" ? "crimson" : row.status === "Warning" ? "amber" : "emerald"} 
          label={row.status} 
        />
      )
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <button 
          className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
          disabled={row.status === "Resolved"}
        >
          {row.status === "Resolved" ? "Archived" : "Resolve"}
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Advanced Resource Analytics" 
        subtitle="AI-driven workforce density mapping and conflict resolution"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/resources" className="hover:text-primary transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Analytics</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/resources" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-crimson/10 text-crimson border border-crimson/20 rounded-lg text-sm font-semibold hover:bg-crimson/20 transition-colors">
              <ShieldAlert className="w-4 h-4" />
              Log Blocker
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1800px] mx-auto w-full flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workforce Density Map */}
          <Card className="col-span-1 lg:col-span-2 p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-on-surface">Workforce Density by Zone</h3>
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                <div className="w-3 h-3 rounded-full bg-semantic-emerald/30 border border-semantic-emerald" /> Low
                <div className="w-3 h-3 rounded-full bg-semantic-amber/30 border border-semantic-amber ml-2" /> Optimal
                <div className="w-3 h-3 rounded-full bg-crimson/30 border border-crimson ml-2" /> High (Congestion)
              </div>
            </div>
            
            <div className="flex-1 bg-surface-variant/30 border border-outline-variant rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5" />
              <Map className="w-24 h-24 text-on-surface-variant/20 absolute" />
              
              {/* Mock Heatmap Zones */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-semantic-amber/20 rounded-full blur-xl border-2 border-semantic-amber/50" />
              <div className="absolute top-[30%] left-[28%] text-xs font-bold text-semantic-amber">Zone A (142)</div>

              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-crimson/20 rounded-full blur-2xl border-2 border-crimson/50" />
              <div className="absolute bottom-[30%] right-[28%] text-xs font-bold text-crimson">Zone B (310)</div>
              <div className="absolute bottom-[25%] right-[25%] bg-surface px-2 py-1 rounded shadow text-xs font-bold text-crimson animate-pulse border border-crimson/30">
                Congestion Alert
              </div>
            </div>
          </Card>

          {/* Quick Reallocation Panel */}
          <Card className="col-span-1 flex flex-col p-0 overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-variant/30">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <Replace className="w-4 h-4 text-primary" /> Quick Reallocation
              </h3>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-outline-variant bg-surface">
              <button 
                onClick={() => setActiveTab("workforce")}
                className={`flex-1 py-3 text-sm font-semibold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === "workforce" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant"}`}
              >
                <Users className="w-4 h-4" /> Workforce
              </button>
              <button 
                onClick={() => setActiveTab("materials")}
                className={`flex-1 py-3 text-sm font-semibold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === "materials" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant"}`}
              >
                <Truck className="w-4 h-4" /> Materials
              </button>
              <button 
                onClick={() => setActiveTab("machinery")}
                className={`flex-1 py-3 text-sm font-semibold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === "machinery" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant"}`}
              >
                <Wrench className="w-4 h-4" /> Machinery
              </button>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-4 bg-surface">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Source Project</label>
                <select className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option>Alpha Tower</option>
                  <option>Beta Complex</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Target Project</label>
                <select className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option>Gamma Hub</option>
                  <option>Delta Phase 2</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Quantity / Resource ID</label>
                <input type="text" placeholder="e.g. 5 Laborers, or EX-001" className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
              </div>

              <div className="mt-auto pt-4">
                <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1 flex items-center justify-center gap-2">
                  <Replace className="w-4 h-4" /> Execute Transfer
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Resource Conflicts Table */}
        <Card className="flex flex-col">
          <div className="p-4 border-b border-outline-variant flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-semantic-amber" />
            <h3 className="font-semibold text-on-surface">Active Resource Conflicts</h3>
          </div>
          <DataTable 
            data={mockConflicts}
            columns={columns}
            getRowId={(row: any) => row.id}
          />
        </Card>

      </div>
    </div>
  );
}
