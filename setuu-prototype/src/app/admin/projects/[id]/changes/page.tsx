"use client";
import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getChangeRequests, approveChangeRequest, rejectChangeRequest } from "@/app/actions/changeRequestActions";
import { useToast } from "@/contexts/ToastContext";

export default function ChangesList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [changes, setChanges] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const toast = useToast();

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getChangeRequests(id);
        setChanges(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAction = async (changeId: string, action: 'approve' | 'reject') => {
    try {
      const res = action === 'approve' 
        ? await approveChangeRequest(changeId, id) 
        : await rejectChangeRequest(changeId, id, "Rejected by admin");
        
      if (res.success) {
        toast.success(`Change request ${action}d`);
        const data = await getChangeRequests(id);
        setChanges(data || []);
      } else {
        toast.error(res.error || `Failed to ${action} change request`);
      }
    } catch (err) {
      toast.error(`Failed to ${action} change request`);
    }
  };

  const columns = [
    { key: "title", header: "Title", cell: (row: any) => <span className="font-medium">{row.title}</span> },
    { key: "cost_impact", header: "Cost Impact", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.cost_impact ? "$" + Number(row.cost_impact).toLocaleString() : "$0"}</span> },
    { key: "time_impact_days", header: "Time Impact", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.time_impact_days ? row.time_impact_days + " days" : "0 days"}</span> },
    { key: "status", header: "Status", cell: (row: any) => <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${row.status === 'Approved' ? 'bg-semantic-emerald-bg/10 text-semantic-emerald' : row.status === 'Rejected' ? 'bg-semantic-crimson-bg/10 text-semantic-crimson' : 'bg-semantic-amber-bg/10 text-semantic-amber'}`}>{row.status}</span> },
    { key: "created_at", header: "Date", cell: (row: any) => <span className="text-sm text-on-surface-variant">{new Date(row.created_at).toLocaleDateString()}</span> },
    { key: "actions", header: "", cell: (row: any) => row.status === 'Pending' ? (
      <div className="flex gap-2">
        <button onClick={() => handleAction(row.id, 'approve')} className="text-xs px-2 py-1 bg-semantic-emerald/10 text-semantic-emerald rounded hover:bg-semantic-emerald/20 font-medium">Approve</button>
        <button onClick={() => handleAction(row.id, 'reject')} className="text-xs px-2 py-1 bg-semantic-crimson/10 text-semantic-crimson rounded hover:bg-semantic-crimson/20 font-medium">Reject</button>
      </div>
    ) : null }
  ];
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Variation Orders & Changes" 
        subtitle="Track scope deviations and cost impacts."
        actions={
          <Link href={`/admin/projects/${id}/changes/new`} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> New Change Order
          </Link>
        }
      />
      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden min-h-[300px]">
        {changes.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-12 text-on-surface-variant">
            <p>No changes logged for this project.</p>
          </div>
        ) : (
          <DataTable columns={columns} data={changes} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
