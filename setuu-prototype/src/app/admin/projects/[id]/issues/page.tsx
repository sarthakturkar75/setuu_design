"use client";

import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Plus, CheckCircle2 } from "lucide-react";
import {
  getProjectIssues,
  getRootCauses,
  getIssueAnalytics,
} from "@/app/actions/issueActions";
import { useToast } from "@/contexts/ToastContext";

import { SLACountdownTimer } from "@/components/ui/SLACountdownTimer";
import { RootCauseDistributionChart } from "@/components/ui/RootCauseDistributionChart";
import { UnplannedReworkKPI } from "@/components/ui/UnplannedReworkKPI";
import { CreateIssueModal } from "@/components/ui/CreateIssueModal";
import { LogQAInspectionModal } from "@/components/ui/LogQAInspectionModal";

export default function IssuesList({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [issues, setIssues] = React.useState<any[]>([]);
  const [rootCauses, setRootCauses] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [qaIssue, setQaIssue] = React.useState<any>(null);

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getProjectIssues(id);
      const rcs = await getRootCauses();
      const stats = await getIssueAnalytics(id);

      setIssues(data || []);
      setRootCauses(rcs || []);
      setAnalytics(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [id]);

  const columns = [
    {
      key: "display_id",
      header: "ID",
      cell: (row: any) => (
        <span className="font-mono text-xs text-on-surface-variant">
          {row.display_id || row.id.substring(0, 6)}
        </span>
      ),
    },
    {
      key: "title",
      header: "Issue",
      cell: (row: any) => (
        <span className="font-semibold text-primary hover:underline cursor-pointer">
          {row.title}
        </span>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      cell: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.severity === "Critical"
            ? "bg-semantic-crimson text-white"
            : row.severity === "High"
              ? "bg-semantic-amber text-black"
              : "bg-surface-variant text-on-surface-variant"
            }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      key: "sla",
      header: "SLA Deadline",
      cell: (row: any) =>
        row.status === "Resolved" ? (
          <span className="text-xs text-semantic-emerald font-semibold">
            RESOLVED
          </span>
        ) : (
          <SLACountdownTimer deadlineIso={row.sla_deadline} />
        ),
    },
    {
      key: "root_cause",
      header: "Root Cause",
      cell: (row: any) => (
        <span className="text-sm">
          {row.issue_root_causes?.name || "Unassigned"}
        </span>
      ),
    },
    {
      key: "rework",
      header: "Est. Rework",
      cell: (row: any) => (
        <span className="text-sm font-jetbrains-mono">
          ${(row.estimated_rework_cost || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <span className="text-xs font-semibold">{row.status}</span>
      ),
    },
    {
      key: "qa",
      header: "",
      cell: (row: any) => (
        <button
          onClick={() => setQaIssue(row)}
          className="p-1.5 hover:bg-semantic-emerald/10 text-semantic-emerald rounded border border-transparent hover:border-semantic-emerald/30 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
          title="Log QA Inspection"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> QA
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Defect & QA Tracking"
        subtitle="Manage SLAs, run root cause analytics, and handle BIM clashes."
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Log Issue
          </button>
        }
      />

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface-container rounded-xl border border-outline-variant/50 p-4">
            <h3 className="text-sm font-semibold text-on-surface mb-2">
              Root Cause Clustering
            </h3>
            <RootCauseDistributionChart
              data={analytics.rootCauseDistribution}
            />
          </div>
          <div>
            <UnplannedReworkKPI totalCost={analytics.totalReworkCost} />
          </div>
        </div>
      )}

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px]">
        <DataTable columns={columns} data={issues} isLoading={isLoading} />
      </div>

      {showCreateModal && (
        <CreateIssueModal
          projectId={id}
          rootCauses={rootCauses}
          onClose={() => setShowCreateModal(false)}
          onRefresh={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {qaIssue && (
        <LogQAInspectionModal
          issue={qaIssue}
          onClose={() => setQaIssue(null)}
          onRefresh={() => {
            setQaIssue(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
