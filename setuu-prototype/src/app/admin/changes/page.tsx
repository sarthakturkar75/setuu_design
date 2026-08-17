"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { TextInput } from "@/components/ui/TextInput";
import { Search, FileText, CheckCircle2, XCircle, Download, Clock, DollarSign, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockCRs = [
  { 
    id: "CR-2026-089", 
    title: "Upgrade HVAC units to high-efficiency models", 
    project: "Alpha Tower", 
    priority: "High", 
    status: "Pending Approval", 
    costImpact: "+$45,000", 
    timeImpact: "+14 Days",
    description: "Client requested upgrade to HVAC units on floors 10-15 to meet new LEED certification requirements. Requires structural reinforcement of mounting points.",
    submittedBy: "John Doe",
    submittedDate: "Oct 15, 2026"
  },
  { 
    id: "CR-2026-088", 
    title: "Change lobby flooring material to marble", 
    project: "Beta Complex", 
    priority: "Medium", 
    status: "Pending Approval", 
    costImpact: "+$120,000", 
    timeImpact: "+5 Days",
    description: "Architectural change request to substitute standard porcelain tiles with imported Italian marble for the main lobby.",
    submittedBy: "Alice Smith",
    submittedDate: "Oct 14, 2026"
  },
  { 
    id: "CR-2026-087", 
    title: "Relocate fiber optic main line", 
    project: "Gamma Hub", 
    priority: "Critical", 
    status: "Approved", 
    costImpact: "+$12,500", 
    timeImpact: "+2 Days",
    description: "Municipal utility conflict discovered during excavation. Fiber line must be routed 15ft north of original plan.",
    submittedBy: "Bob Johnson",
    submittedDate: "Oct 10, 2026"
  },
];

export default function ChangeRequestsPage() {
  const [selectedCrId, setSelectedCrId] = useState<string | null>(null);

  const selectedCr = mockCRs.find(cr => cr.id === selectedCrId);

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Change Request Approval Queue" 
        subtitle="Review, approve, and track scope changes and their financial impacts"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Change Requests</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <Download className="w-4 h-4" />
            Export Log
          </button>
        }
      />
      
      <div className="flex-1 overflow-hidden flex max-w-[1800px] mx-auto w-full">
        
        {/* Main List Area */}
        <div className={`flex-1 flex flex-col p-6 overflow-y-auto transition-all ${selectedCrId ? 'hidden xl:flex xl:w-2/3' : 'w-full'}`}>
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search CR ID or keywords..." className="pl-9" />
            </div>
            <SelectMenu 
              options={[
                { label: "All Priorities", value: "" },
                { label: "Critical", value: "critical" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
              ]}
              value=""
              onChange={() => {}}
            />
          </FilterBar>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockCRs.map((cr) => (
              <div 
                key={cr.id} 
                onClick={() => setSelectedCrId(cr.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col gap-4 ${
                  selectedCrId === cr.id 
                    ? "bg-primary/5 border-primary shadow-elevation-l1" 
                    : "bg-surface border-outline-variant hover:border-primary/50 hover:shadow-elevation-l1"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-jetbrains text-primary font-bold">{cr.id}</span>
                    <h3 className="font-semibold text-on-surface text-lg leading-tight mt-1">{cr.title}</h3>
                    <span className="text-sm text-on-surface-variant mt-1">{cr.project}</span>
                  </div>
                  <StatusBadge 
                    tone={cr.status === "Approved" ? "emerald" : "sky"} 
                    label={cr.status} 
                  />
                </div>

                <div className="flex items-center gap-6 mt-2 pt-4 border-t border-outline-variant border-dashed">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-semantic-amber" />
                    <span className="text-sm font-bold text-on-surface">{cr.costImpact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-semantic-amber" />
                    <span className="text-sm font-bold text-on-surface">{cr.timeImpact}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-2 py-1 bg-surface-variant rounded">
                      {cr.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Side-panel */}
        {selectedCrId && selectedCr && (
          <div className="w-full xl:w-1/3 border-l border-outline-variant bg-surface flex flex-col shadow-elevation-l3 xl:shadow-none animate-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-outline-variant flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-jetbrains text-primary font-bold">{selectedCr.id}</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Export PDF">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedCrId(null)}
                    className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors xl:hidden"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-on-surface leading-tight">{selectedCr.title}</h2>
              
              <div className="flex items-center gap-3">
                <StatusBadge 
                  tone={selectedCr.status === "Approved" ? "emerald" : "sky"} 
                  label={selectedCr.status} 
                />
                <span className="text-sm font-medium text-on-surface-variant">{selectedCr.project}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-semantic-amber/10 border border-semantic-amber/20 rounded-xl flex flex-col gap-1 text-center">
                  <span className="text-xs text-semantic-amber font-bold uppercase tracking-wider">Cost Impact</span>
                  <span className="text-xl font-bold text-on-surface">{selectedCr.costImpact}</span>
                </div>
                <div className="p-4 bg-semantic-amber/10 border border-semantic-amber/20 rounded-xl flex flex-col gap-1 text-center">
                  <span className="text-xs text-semantic-amber font-bold uppercase tracking-wider">Time Impact</span>
                  <span className="text-xl font-bold text-on-surface">{selectedCr.timeImpact}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Scope Description</span>
                <p className="text-sm text-on-surface leading-relaxed">
                  {selectedCr.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Submission Details</span>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant">Submitted By</span>
                    <span className="font-medium text-on-surface">{selectedCr.submittedBy}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-on-surface-variant">Date</span>
                    <span className="font-medium text-on-surface font-jetbrains">{selectedCr.submittedDate}</span>
                  </div>
                </div>
              </div>

            </div>

            {selectedCr.status === "Pending Approval" && (
              <div className="p-6 border-t border-outline-variant bg-surface flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-4 py-2 bg-emerald-500/10 text-semantic-emerald border border-semantic-emerald/30 rounded-lg text-sm font-semibold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex-1 px-4 py-2 bg-crimson/10 text-crimson border border-crimson/30 rounded-lg text-sm font-semibold hover:bg-crimson/20 transition-colors flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
