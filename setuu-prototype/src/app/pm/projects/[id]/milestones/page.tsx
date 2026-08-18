"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import { KanbanCard } from "@/components/ui/KanbanCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon } from "lucide-react";
import { getProjectMilestones, updateMilestone } from "@/app/actions/milestoneActions";

type MilestoneStatus = "todo" | "in_progress" | "review" | "completed";

export default function MilestoneKanbanPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [milestones, setMilestones] = React.useState<any[]>([]);
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

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
      // Optimistic update
      setMilestones(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, completion_status: targetStatus } : t
      ));
      
      // Server update
      await updateMilestone(draggedTask, { completion_status: targetStatus });
    }
  };

  // Map arbitrary completion_status strings to columns, defaulting appropriately
  const getColumnForStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("progress")) return "in_progress";
    if (s.includes("review")) return "review";
    if (s.includes("complete")) return "completed";
    return "todo";
  };

  const renderColumn = (columnId: string, title: string) => {
    const columnMilestones = milestones.filter(t => getColumnForStatus(t.completion_status) === columnId);
    
    return (
      <div 
        className="h-full flex-shrink-0"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, title)} // using title or mapped status to save to DB
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
                title={t.title}
                assignee={{ id: "1", name: t.department || "Unassigned" }}
                badge={
                  <StatusBadge 
                    tone={t.completion_status === "Overdue" ? "crimson" : "slate"} 
                    label={t.target_date || "No date"} 
                  />
                }
              />
            </div>
          ))}
          {columnId === "todo" && (
            <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-dashed border-outline-variant hover:border-primary/50">
              <PlusIcon className="w-4 h-4" /> Add Milestone
            </button>
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
