"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getProjectResources } from "@/app/actions/resourceActions";
import { getProjectTeam, assignTeamMember } from "@/app/actions/projectActions";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { ResourcePoolModal } from "@/components/ui/ResourcePoolModal";
import { UsersIcon } from "lucide-react";

export default function ProjectTeamPage() {
  const [team, setTeam] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [showAssignForm, setShowAssignForm] = React.useState(false);
  const [vendorId, setVendorId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const params = useParams();
  const id = params?.id as string;
  const toast = useToast();

  const fetchTeam = React.useCallback(async () => {
    if (!id) return;
    try {
      const [teamData, resourceData] = await Promise.all([
        getProjectTeam(id),
        getProjectResources({ projectId: id })
      ]);
      setTeam(teamData || []);
      setResources(resourceData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return toast.error("Please enter a Vendor ID (User ID).");
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("project_id", id);
    formData.append("vendor_id", vendorId);
    
    const res = await assignTeamMember(formData);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Team member assigned.");
      setShowAssignForm(false);
      setVendorId("");
      fetchTeam();
    } else {
      toast.error(res.error || "Failed to assign member.");
    }
  };

  const teamColumns = [
    { key: "name", header: "Name", cell: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{row.fallback}</div>
        <span className="font-medium text-on-surface">{row.name}</span>
      </div>
    )},
    { key: "role", header: "Role", cell: (row: any) => <span className="text-sm font-medium px-2 py-0.5 rounded bg-surface-variant">{row.role}</span> }
  ];

  const resourceColumns = [
    { key: "name", header: "Resource / Group", cell: (row: any) => <span className="font-medium">{row.name}</span> },
    { key: "type", header: "Type", cell: (row: any) => <span className="text-sm">{row.resource_type}</span> },
    { key: "allocated", header: "Allocated", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.allocated_hours}h</span> },
    { key: "actual", header: "Actual", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.actual_hours || 0}h</span> }
  ];

  if (loading) {
    return <div className="p-6 text-center text-on-surface-variant">Loading team...</div>;
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Key Personnel & Stakeholders</h2>
        <button 
          onClick={() => setShowAssignForm(!showAssignForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <UsersIcon className="w-4 h-4" />
          {showAssignForm ? "Cancel" : "Assign Member"}
        </button>
      </div>

      {showAssignForm && (
        <ResourcePoolModal 
          projectId={id}
          onClose={() => setShowAssignForm(false)}
          onRefresh={fetchTeam}
        />
      )}

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={team} columns={teamColumns} />
      </div>

      <h2 className="text-xl font-bold font-merriweather text-on-surface mt-12 mb-6">General Resources (Labor & Equipment)</h2>
      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        {resources.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">No generic resources allocated. Go to Resources tab to add.</div>
        ) : (
          <DataTable data={resources} columns={resourceColumns} />
        )}
      </div>
    </div>
  );
}
