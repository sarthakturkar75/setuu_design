"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Search, FileText, CheckCircle2, XCircle, Download, Clock, DollarSign, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { useEffect } from "react";
import { getChangeRequests, approveChangeRequest, rejectChangeRequest } from "@/app/actions/changeRequestActions";

// mockCRs removed, using live data

export default function ChangeRequestsPage() {
  const [selectedCrId, setSelectedCrId] = useState<string | null>(null);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCRs = () => {
    setLoading(true);
    getChangeRequests().then(data => {
      setChangeRequests(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCRs();
  }, []);

  const selectedCr = changeRequests.find(cr => cr.id === selectedCrId);

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
          <FilterBar onClear={() => { }} onApply={() => { }}>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput placeholder="Search CR ID or keywords..." className="pl-9" />
            </div>
            <Select
              options={[
                { label: "All Priorities", value: "" },
                { label: "Critical", value: "critical" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
              ]}
              value=""
              onChange={() => { }}
            />
          </FilterBar>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full py-10 text-center text-on-surface-variant">Loading change requests...</div>
            ) : changeRequests.length === 0 ? (
              <div className="col-span-full py-10 text-center text-on-surface-variant">No change requests found.</div>
            ) : changeRequests.map((cr) => (
              <div
                key={cr.id}
                onClick={() => setSelectedCrId(cr.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col gap-4 ${selectedCrId === cr.id
                  ? "bg-primary/5 border-primary shadow-elevation-l1"
                  : "bg-surface border-outline-variant hover:border-primary/50 hover:shadow-elevation-l1"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-jetbrains text-primary bg-primary/10 px-2 py-0.5 rounded">{cr.id.substring(0, 8)}</span>
                    <span className="text-xs text-on-surface-variant line-clamp-1">{cr.project_name || "Unknown Project"}</span>
                  </div>
                  <StatusBadge
                    tone={cr.status === "Approved" ? "emerald" : "sky"}
                    label={cr.status}
                  />
                </div>

                <div className="flex items-center gap-6 mt-2 pt-4 border-t border-outline-variant border-dashed">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-outline-variant text-sm font-jetbrains font-medium text-on-surface">
                    <DollarSign className="w-4 h-4 text-semantic-crimson" />
                    {cr.cost_impact ? `+₹${cr.cost_impact.toLocaleString()}` : '0'}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface border border-outline-variant text-sm font-jetbrains font-medium text-on-surface">
                    <Clock className="w-4 h-4 text-semantic-amber" />
                    {cr.time_impact_days ? `+${cr.time_impact_days} Days` : '+0 Days'}
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
                <span className="text-sm font-medium text-on-surface-variant">{selectedCr.project_name || "Unknown Project"}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-outline-variant bg-surface-variant/20 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Submitted By</span>
                  <span className="text-sm font-medium text-on-surface">User ID: {selectedCr.submitted_by_id || "System"}</span>
                </div>
                <div className="p-4 rounded-xl border border-outline-variant bg-surface-variant/20 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date Logged</span>
                  <span className="text-sm font-jetbrains text-on-surface">{selectedCr.created_at ? new Date(selectedCr.created_at).toLocaleDateString() : "--"}</span>
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

            <div className="p-6 border-t border-outline-variant bg-surface flex flex-col gap-4 sticky bottom-0">
              {selectedCr.status === "Pending" ? (
                <>
                  <button
                    onClick={async () => {
                      // FIX: Added selectedCr.project_id
                      await approveChangeRequest(selectedCr.id, selectedCr.project_id);
                      setSelectedCrId(null);
                      fetchCRs();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-semantic-emerald text-on-primary rounded-lg font-semibold hover:bg-semantic-emerald/90 transition-colors shadow-elevation-l2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Approve Change & Execute
                  </button>
                  <button
                    onClick={async () => {
                      // FIX: Added selectedCr.project_id
                      await rejectChangeRequest(selectedCr.id, selectedCr.project_id, "Rejected by Admin");
                      setSelectedCrId(null);
                      fetchCRs();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-semantic-crimson text-semantic-crimson rounded-lg font-semibold hover:bg-semantic-crimson hover:text-white transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Request
                  </button>
                </>
              ) : (
                <div className="text-center text-sm font-semibold text-on-surface-variant p-4 bg-surface-variant/30 rounded-lg">
                  This request has been {selectedCr.status.toLowerCase()}.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
