"use client";
import { useState } from "react";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getProjectResources, createResource, deleteResource } from "@/app/actions/resourceActions";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { PlusIcon, Trash2Icon } from "lucide-react";

export default function ProjectResourcesPage() {
  const [resources, setResources] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newRes, setNewRes] = React.useState({ name: "", type: "Labor", hours: "" });

  const params = useParams();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const id = params?.id as string;
  const toast = useToast();

  React.useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const resourceData = await getProjectResources({ projectId: id });
        setResources(resourceData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleDelete = async (resId: string) => {
    if (!window.confirm("Remove this resource allocation?")) return;
    const res = await deleteResource(resId);
    if (res.success) {
      toast.success("Resource removed");
      setResources(resources.filter((r) => r.id !== resId));
    } else {
      toast.error(res.error || "Failed to remove resource");
    }
  };

  const handleCreate = async () => {
    if (!newRes.name.trim()) return toast.error("Name is required");

    const formData = new FormData();
    formData.append("project_id", id);
    formData.append("name", newRes.name.trim());
    formData.append("resource_type", newRes.type);
    formData.append("allocated_hours", newRes.hours || "0");

    const res = await createResource(formData);
    if (res.success) {
      toast.success("Resource allocated");
      setShowAddForm(false);
      setNewRes({ name: "", type: "Labor", hours: "" });
      const data = await getProjectResources({ projectId: id });
      setResources(data || []);
    } else {
      toast.error(res.error || "Failed to allocate resource");
    }
  };

  const columns = [
    { key: "name", header: "Resource Name", cell: (row: any) => <span className="font-medium text-on-surface">{row.name}</span> },
    { key: "resource_type", header: "Type", cell: (row: any) => <span className="text-sm">{row.resource_type}</span> },
    { key: "allocated_hours", header: "Allocated Hours", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.allocated_hours ?? 0} hrs</span> },
    { key: "actual_hours", header: "Actual Hours", cell: (row: any) => <span className="text-sm font-jetbrains-mono">{row.actual_hours ?? 0} hrs</span> },
    { key: "current_assignment", header: "Assignment", cell: (row: any) => <span className="text-sm">{row.current_assignment || "Unassigned"}</span> },
    {
      key: "actions",
      header: "",
      cell: (row: any) => (
        <div className="flex justify-end">
          <button onClick={() => handleDelete(row.id)} className="p-2 text-on-surface-variant hover:text-semantic-crimson hover:bg-semantic-crimson/10 rounded-lg transition-colors">
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  if (loading) return <div className="p-6 animate-pulse text-on-surface-variant">Loading resource data...</div>;

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-normal">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-merriweather text-on-surface">Resource Allocations</h2>
          <p className="text-sm text-on-surface-variant mt-1">Manage workforce and equipment allocated to this project.</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Allocate Resource
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold text-on-surface mb-1 block">Resource Name *</label>
            <input type="text" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} placeholder="e.g. Lead Engineer or Excavator" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" autoFocus />
          </div>
          <div className="w-40">
            <label className="text-sm font-semibold text-on-surface mb-1 block">Type</label>
            <select value={newRes.type} onChange={e => setNewRes({ ...newRes, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none">
              <option value="Labor">Labor</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
          <div className="w-32">
            <label className="text-sm font-semibold text-on-surface mb-1 block">Allocated Hrs</label>
            <input type="number" value={newRes.hours} onChange={e => setNewRes({ ...newRes, hours: e.target.value })} placeholder="e.g. 160" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none" />
          </div>
          <button onClick={handleCreate} className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold whitespace-nowrap shadow-sm hover:bg-primary/90 transition-colors">
            Save
          </button>
          <button onClick={() => { setShowAddForm(false); setNewRes({ name: "", type: "Labor", hours: "" }); }} className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="text-center py-12 bg-surface-container border border-dashed border-outline-variant rounded-xl">
          <p className="text-sm text-on-surface-variant">No resources allocated to this project yet.</p>
        </div>
      ) : (
        <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden shadow-sm">
          <DataTable data={resources} columns={columns} />
        </div>
      )}
    </div>
  );
}
