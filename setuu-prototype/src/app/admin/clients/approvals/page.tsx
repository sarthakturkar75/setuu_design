"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Card } from "@/components/ui/Card";
import { Clock, Search, Download, AlertTriangle, FileText, Archive } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getClientApprovals } from "@/app/actions/clientActions";

export default function ClientApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getClientApprovals();
        setApprovals(data.map(app => ({
          id: app.display_id || app.id.substring(0, 8),
          item: app.document_title,
          requester: app.created_by || "Unknown",
          pending: "Pending Reviewer", // DB placeholder 
          waitTime: "N/A", // Calculation placeholder
          priority: "Medium", // DB doesn't have priority, fallback
          status: app.status,
          type: "Client",
          date: app.created_at ? new Date(app.created_at).toLocaleDateString() : "Unknown",
          project: app.project_name
        })));
      } catch (e) {
        console.error("Failed to load approvals", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCardsByStatus = (status: string) => {
    return approvals.filter(app => app.status === status);
  };

  const ApprovalCard = ({ app }: { app: any }) => (
    <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col gap-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <span className="font-semibold text-on-surface leading-tight line-clamp-2">{app.item}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${app.priority === 'Critical' ? 'bg-crimson/10 text-crimson border border-crimson/20' : app.priority === 'High' ? 'bg-semantic-amber/10 text-semantic-amber border border-semantic-amber/20' : 'bg-surface-variant text-on-surface-variant'}`}>{app.priority}</span>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <span className="text-on-surface-variant flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {app.project}</span>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-on-surface font-medium">{app.type}</span>
          <span className="font-jetbrains text-on-surface-variant">{app.date}</span>
        </div>
      </div>

      {app.status !== "Signed & Closed" && (
        <div className="mt-2 pt-2 border-t border-outline-variant flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Pending: <span className="font-semibold text-primary">{app.pending}</span></span>
          <span className={`font-jetbrains flex items-center gap-1 ${app.waitTime.includes('48') ? 'text-crimson font-bold' : 'text-on-surface-variant'}`}>
            <Clock className="w-3 h-3" /> {app.waitTime}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader
        title="Client Approvals Tracker"
        subtitle="Global visibility into pending multi-party authorizations and SLA compliance"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Clients</span>
            <span>/</span>
            <span className="text-on-surface font-medium">Approvals</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/archive" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Archive className="w-4 h-4" />
              View archived
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        }
      />

      <div className="flex-1 flex flex-col p-6 max-w-[1800px] mx-auto w-full gap-6 h-full overflow-hidden">

        <FilterBar onClear={() => { }} onApply={() => { }}>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput placeholder="Search ID, item, or person..." className="pl-9" />
          </div>
          <Select
            options={[
              { label: "All Projects", value: "" },
              { label: "Alpha Tower", value: "alpha" },
              { label: "Beta Complex", value: "beta" },
            ]}
            value=""
            onChange={() => { }}
          />
          <Select
            options={[
              { label: "All Types", value: "" },
              { label: "Finance", value: "fin" },
              { label: "Technical", value: "tech" },
              { label: "Legal", value: "leg" },
            ]}
            value=""
            onChange={() => { }}
          />
        </FilterBar>

        {/* KPI Warning Row (Kept as it adds value to the tracker) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
          <Card className="p-4 flex items-center justify-between border-crimson/30 bg-crimson/5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-crimson" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-crimson">SLA Breaches</span>
                <span className="text-xs text-on-surface-variant">Approvals delayed beyond 48 hours</span>
              </div>
            </div>
            <span className="text-2xl font-bold font-jetbrains text-crimson leading-none">12</span>
          </Card>
          <Card className="p-4 flex items-center justify-between border-semantic-amber/30 bg-semantic-amber/5">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-semantic-amber" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-semantic-amber">At Risk (Next 4h)</span>
                <span className="text-xs text-on-surface-variant">Approvals nearing SLA limits</span>
              </div>
            </div>
            <span className="text-2xl font-bold font-jetbrains text-semantic-amber leading-none">8</span>
          </Card>
        </div>

        {/* Kanban Board Layout */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant p-12">
            Loading approvals...
          </div>
        ) : (
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4">

            {/* Pending Review Column */}
            <div className="flex-1 min-w-[320px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" /> Pending Review
                </h3>
                <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {getCardsByStatus("Pending Review").length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {getCardsByStatus("Pending Review").map(app => <ApprovalCard key={app.id} app={app} />)}
              </div>
            </div>

            {/* Awaiting Signature Column */}
            <div className="flex-1 min-w-[320px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-semantic-amber" /> Awaiting Signature
                </h3>
                <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {getCardsByStatus("Awaiting Signature").length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {getCardsByStatus("Awaiting Signature").map(app => <ApprovalCard key={app.id} app={app} />)}
              </div>
            </div>

            {/* Revision Requested Column */}
            <div className="flex-1 min-w-[320px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-crimson" /> Revision Requested
                </h3>
                <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {getCardsByStatus("Revision Requested").length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {getCardsByStatus("Revision Requested").map(app => <ApprovalCard key={app.id} app={app} />)}
              </div>
            </div>

            {/* Signed & Closed Column */}
            <div className="flex-1 min-w-[320px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                <h3 className="font-semibold text-on-surface flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-semantic-emerald" /> Signed & Closed
                </h3>
                <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {getCardsByStatus("Signed & Closed").length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {getCardsByStatus("Signed & Closed").map(app => <ApprovalCard key={app.id} app={app} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
