"use client";

import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Plus } from "lucide-react";
import { getChangeRequests, getContingencyMetrics } from "@/app/actions/changeOrderActions";
import { useToast } from "@/contexts/ToastContext";
import { ContingencyBurnChart } from "@/components/ui/ContingencyBurnChart";
import { ChangeOrderModal } from "@/components/ui/ChangeOrderModal";
import { SubmitChangeRequestModal } from "@/components/ui/SubmitChangeRequestModal";

export default function ChangesList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [changes, setChanges] = React.useState<any[]>([]);
  const [metrics, setMetrics] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedChange, setSelectedChange] = React.useState<any>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  
  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getChangeRequests(id);
      setChanges(data || []);
      const mets = await getContingencyMetrics(id);
      setMetrics(mets);
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
    { key: "display_id", header: "ID", cell: (row: any) => <span className="font-mono text-xs text-on-surface-variant">{row.display_id || row.id.substring(0,6)}</span> },
    { key: "title", header: "Title", cell: (row: any) => <button onClick={() => setSelectedChange(row)} className="font-medium text-primary hover:underline text-left">{row.title}</button> },
    { key: "cost_impact", header: "Cost Impact", cell: (row: any) => <span className="text-sm font-jetbrains-mono">${Number(row.cost_impact).toLocaleString()}</span> },
    { key: "time_impact_days", header: "Time Impact", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.time_impact_days || 0} days</span> },
    { key: "stage", header: "Stage", cell: (row: any) => <span className="text-xs font-semibold text-on-surface-variant">{row.custom_data?.approval_stage || 'Draft'}</span> },
    { key: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${row.status === 'Approved' ? 'bg-semantic-emerald-bg/10 text-semantic-emerald' : row.status === 'Rejected' ? 'bg-semantic-crimson-bg/10 text-semantic-crimson' : 'bg-semantic-amber-bg/10 text-semantic-amber'}`}>{row.status}</span> },
    { key: "created_at", header: "Date", cell: (row: any) => <span className="text-sm text-on-surface-variant">{new Date(row.created_at).toLocaleDateString()}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Variation Orders & Changes" 
        subtitle="Multi-tier e-signature workflow and contingency tracking."
        actions={
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Log Change
          </button>
        }
      />
      
      {/* Module 4: Contingency Drawdown Tracking */}
      {metrics && <ContingencyBurnChart metrics={metrics} />}

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px]">
        {changes.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-on-surface-variant">
            <p>No changes logged for this project.</p>
          </div>
        ) : (
          <DataTable columns={columns} data={changes} isLoading={isLoading} />
        )}
      </div>

      <ChangeOrderModal 
        change={selectedChange} 
        contractValue={metrics?.contractValue || 0} 
        onClose={() => setSelectedChange(null)}
        onRefresh={() => { setSelectedChange(null); loadData(); }} 
      />
      {showAddModal && (
        <SubmitChangeRequestModal 
          projectId={id} 
          onClose={() => setShowAddModal(false)}
          onRefresh={() => { setShowAddModal(false); loadData(); }} 
        />
      )}
    </div>
  );
}
