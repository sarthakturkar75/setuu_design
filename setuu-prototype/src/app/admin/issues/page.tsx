"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Search, AlertOctagon, User, Clock, ArrowRight, ShieldAlert, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { useEffect } from "react";
import { getIssues } from "@/app/actions/issueActions";

// mockIssues replaced by live data

export default function IssuesConsolePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIssues()
      .then(data => {
        setIssues(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load issues", err);
        setLoading(false);
      });
  }, []);

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case "Critical": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-crimson/10 text-crimson border border-crimson/20"><AlertOctagon className="w-3 h-3" /> Critical</span>;
      case "High": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-semantic-amber/10 text-semantic-amber border border-semantic-amber/20">High</span>;
      case "Medium": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-sky/10 text-sky border border-sky/20">Medium</span>;
      default: return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-surface-variant text-on-surface-variant">Low</span>;
    }
  };

  const columns = [
    { 
      key: "id_title", 
      header: "Issue & Impact", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-on-surface line-clamp-1">{row.title}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-jetbrains text-primary">{row.display_id || (row.id ? row.id.split('-')[0] : "ISSUE")}</span>
            {(row.timeline_impact || row.cost_impact) && (
              <>
                <span className="text-xs text-on-surface-variant/50">•</span>
                <span className="text-xs text-on-surface-variant">
                  {row.timeline_impact ? `Timeline: ${row.timeline_impact}` : ""}
                  {row.timeline_impact && row.cost_impact ? " | " : ""}
                  {row.cost_impact ? `Cost: ${row.cost_impact}` : ""}
                </span>
              </>
            )}
          </div>
        </div>
      )
    },
    { 
      key: "severity", 
      header: "Severity", 
      sortable: true,
      cell: (row: any) => getSeverityBadge(row.severity)
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "Resolved" ? "emerald" : row.status === "Escalated" ? "crimson" : row.status === "In Progress" ? "sky" : "slate"} 
          label={row.status} 
        />
      )
    },
    { 
      key: "assignee", 
      header: "Assignee", 
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">{row.assignee_name ? row.assignee_name.charAt(0) : "?"}</span>
          </div>
          <span className="text-sm font-medium text-on-surface-variant">{row.assignee_name || "Unassigned"}</span>
        </div>
      )
    },
    { 
      key: "date", 
      header: "Logged Date", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.created_at ? new Date(row.created_at).toLocaleDateString() : "--"}</span>
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <button 
          onClick={() => setSelectedIssueId(row.id)}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Inspect <ArrowRight className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Project Issues & Blockers Console" 
        subtitle="Track, escalate, and resolve impediments across the portfolio"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Issues</span>
          </div>
        }
        actions={
          <Link href="/admin/issues/new" className="flex items-center gap-2 px-4 py-2 bg-crimson text-white rounded-lg text-sm font-semibold hover:bg-crimson/90 transition-colors shadow-elevation-l1">
            <AlertOctagon className="w-4 h-4" />
            Log Global Blocker
          </Link>
        }
      />
      
      <div className="flex-1 overflow-hidden flex max-w-[1800px] mx-auto w-full">
        
        {/* Main List Area */}
        <div className={`flex-1 flex flex-col p-6 overflow-y-auto transition-all ${selectedIssueId ? 'hidden xl:flex xl:w-2/3' : 'w-full'}`}>
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search issue ID or keywords..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select 
              options={[
                { label: "All Severities", value: "" },
                { label: "Critical", value: "critical" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
              value={severityFilter}
              onChange={(val) => setSeverityFilter(val)}
            />
            <Select 
              options={[
                { label: "All Statuses", value: "" },
                { label: "Open", value: "Open" },
                { label: "In Progress", value: "In Progress" },
                { label: "Resolved", value: "Resolved" },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
            />
          </FilterBar>

          <Card className="flex-1 min-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-on-surface-variant">Loading issues...</div>
            ) : (
              <DataTable 
                data={issues}
                columns={columns}
                getRowId={(row: any) => row.id}
              />
            )}
          </Card>
        </div>

        {/* Issue Details Slide-out Panel */}
        {selectedIssueId && selectedIssue && (
          <div className="w-full xl:w-1/3 border-l border-outline-variant bg-surface flex flex-col shadow-elevation-l3 xl:shadow-none animate-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-outline-variant flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-jetbrains text-primary font-bold">{selectedIssue.display_id || "ISSUE"}</span>
                <button 
                  onClick={() => setSelectedIssueId(null)}
                  className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors xl:hidden"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-on-surface leading-tight">{selectedIssue.title}</h2>
              
              <div className="flex items-center gap-3">
                {getSeverityBadge(selectedIssue.severity)}
                <StatusBadge 
                  tone={selectedIssue.status === "Resolved" ? "emerald" : selectedIssue.status === "Escalated" ? "crimson" : selectedIssue.status === "In Progress" ? "sky" : "slate"} 
                  label={selectedIssue.status} 
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Assignee</span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-on-surface">{selectedIssue.assignee_name || "Unassigned"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Date Logged</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium text-on-surface font-jetbrains">{selectedIssue.created_at ? new Date(selectedIssue.created_at).toLocaleDateString() : "--"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Description</span>
                <div className="p-4 rounded-lg bg-surface-variant/30 border border-outline-variant text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                  {selectedIssue.description || "No description provided."}
                </div>
              </div>

              {selectedIssue.root_cause && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Root Cause</span>
                  <div className="p-4 rounded-lg bg-surface-variant/30 border border-outline-variant text-sm text-on-surface leading-relaxed">
                    {selectedIssue.root_cause}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Activity Log</span>
                <div className="flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-outline-variant ml-1">
                  
                  <div className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface">System <span className="font-normal text-on-surface-variant">created issue</span></span>
                      <span className="text-xs text-on-surface-variant mt-0.5">{selectedIssue.created_at ? new Date(selectedIssue.created_at).toLocaleString() : "--"}</span>
                    </div>
                  </div>

                  {selectedIssue.resolved_at && (
                    <div className="flex gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-on-surface">System <span className="font-normal text-on-surface-variant">marked as Resolved</span></span>
                        <span className="text-xs text-on-surface-variant mt-0.5">{new Date(selectedIssue.resolved_at).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            <div className="p-6 border-t border-outline-variant bg-surface flex flex-col sm:flex-row gap-3">
              <button className="flex-1 px-4 py-2 bg-surface text-primary border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Mark Resolved
              </button>
              <button className="flex-1 px-4 py-2 bg-crimson text-white rounded-lg text-sm font-semibold hover:bg-crimson/90 transition-colors flex items-center justify-center gap-2">
                <AlertOctagon className="w-4 h-4" />
                Escalate
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
