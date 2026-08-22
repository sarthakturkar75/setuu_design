"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import { KanbanCard } from "@/components/ui/KanbanCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon } from "lucide-react";
import { getProjectMilestones, updateMilestone, deleteMilestone, createMilestone } from "@/app/actions/milestoneActions";
import { useToast } from "@/contexts/ToastContext";

export default function MilestoneKanbanPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [milestones, setMilestones] = React.useState<any[]>([]);
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const toast = useToast();

  React.useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const data = await getProjectMilestones(projectId);
        setMilestones(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, [projectId]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTask(id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add("opacity-50");
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedTask(null);
    const el = document.getElementById(id);
    if (el) el.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (draggedTask) {
      const isCompleted = targetStatus === 'Completed';
      const originalMilestone = milestones.find(t => t.id === draggedTask);
      
      // Optimistic update
      setMilestones(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, completion_status: isCompleted, status_label: targetStatus } : t
      ));
      
      // Server update
      const res = await updateMilestone(draggedTask, { completion_status: isCompleted });
      if (!res?.success) {
         toast.error(res?.error || 'Failed to update milestone');
         // revert
         if (originalMilestone) {
            setMilestones(prev => prev.map(t => t.id === draggedTask ? originalMilestone : t));
         }
      }
    }
  };

  const getColumnForStatus = (statusLabel: string) => {
    if (statusLabel === 'Completed') return 'completed';
    if (statusLabel === 'Overdue') return 'review';
    if (statusLabel === 'In Progress') return 'in_progress';
    return 'todo';
  };

  const renderColumn = (columnId: string, title: string) => {
    const columnMilestones = milestones.filter(t => getColumnForStatus(t.status_label) === columnId);
    
    return (
      <div 
        className="h-full flex-shrink-0"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, title)} 
      >
        <KanbanColumn title={title} count={columnMilestones.length}>
          {columnMilestones.map(t => (
            <div 
              key={t.id} 
              id={t.id}
              draggable 
              onDragStart={(e) => handleDragStart(e, t.id)}
              onDragEnd={(e) => handleDragEnd(e, t.id)}
            >
              <KanbanCard 
                id={t.id}
                title={t.title || t.name}
                assignee={{ id: t.id, name: t.department || "Unassigned" }}
                badge={
                  <StatusBadge 
                    tone={t.status_label === "Overdue" ? "crimson" : "slate"} 
                    label={t.target_date || "No date"} 
                  />
                }
                onDelete={async (e) => {
                  e.stopPropagation();
                  if (!window.confirm("Are you sure you want to delete this milestone?")) return;
                  const res = await deleteMilestone(t.id);
                  if (res?.success) {
                    setMilestones(m => m.filter(x => x.id !== t.id));
                    toast.success("Milestone deleted");
                  } else {
                    toast.error(res?.error || "Failed to delete milestone");
                  }
                }}
              />
            </div>
          ))}
          {columnId === "todo" && (
            showAddForm ? (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Milestone title..."
                  className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface"
                  autoFocus
                />
                <button
                  onClick={async () => {
                    if (!newTitle.trim()) return;
                    const res = await createMilestone(projectId, { title: newTitle.trim(), completion_status: false });
                    if (res.success) {
                      toast.success('Milestone created!');
                      setNewTitle('');
                      setShowAddForm(false);
                      const data = await getProjectMilestones(projectId);
                      setMilestones(data || []);
                    } else {
                      toast.error(res.error || 'Failed to create milestone');
                    }
                  }}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold"
                >Add</button>
                <button onClick={() => { setShowAddForm(false); setNewTitle(''); }} className="px-3 py-2 text-sm text-on-surface-variant">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowAddForm(true)} className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all text-sm border border-dashed border-outline-variant hover:border-primary/50">
                <PlusIcon className="w-4 h-4" /> Add Milestone
              </button>
            )
          )}
        </KanbanColumn>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-center text-on-surface-variant">Loading milestone board...</div>;
  }

  return (
    <div className="p-6 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0 max-w-[1600px] w-full mx-auto">
         <h2 className="text-xl font-bold font-merriweather text-on-surface">Milestone Board</h2>
         <div className="flex items-center gap-3">
           <StatusBadge tone="sky" label="Active" />
         </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden w-full pb-4 px-6 -mx-6">
        <div className="flex h-full gap-6 px-6 pb-2 min-w-max">
          {renderColumn("todo", "Not Started")}
          {renderColumn("in_progress", "In Progress")}
          {renderColumn("review", "Review")}
          {renderColumn("completed", "Completed")}
        </div>
      </div>
    </div>
  );
}
