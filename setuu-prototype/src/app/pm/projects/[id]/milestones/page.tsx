"use client";
import * as React from "react";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import { KanbanCard } from "@/components/ui/KanbanCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon } from "lucide-react";

type TaskStatus = "todo" | "in_progress" | "review" | "completed";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: { id: string; name: string; avatarUrl?: string };
  priority: "high" | "medium" | "low";
};

export default function MilestoneKanbanPage() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: "TSK-01", title: "Pour Foundation Block A", status: "completed", assignee: { id: "1", name: "David M." }, priority: "high" },
    { id: "TSK-02", title: "Erect Steel Frame", status: "in_progress", assignee: { id: "2", name: "Sarah J." }, priority: "high" },
    { id: "TSK-03", title: "Install HVAC Ducting", status: "todo", assignee: { id: "3", name: "Tom C." }, priority: "medium" },
    { id: "TSK-04", title: "Initial Plumbing Rough-in", status: "review", assignee: { id: "4", name: "Jane D." }, priority: "high" },
    { id: "TSK-05", title: "Electrical Wiring (1st Floor)", status: "todo", assignee: { id: "1", name: "David M." }, priority: "medium" },
  ]);

  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTask(id);
    e.dataTransfer.effectAllowed = "move";
    // Slightly delay adding dragging class so the ghost image doesn't look invisible
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

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask ? { ...t, status: targetStatus } : t
      ));
    }
  };

  const renderColumn = (status: TaskStatus, title: string) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div 
        className="h-full flex-shrink-0"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <KanbanColumn title={title} count={columnTasks.length}>
          {columnTasks.map(t => (
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
                assignee={t.assignee}
                badge={
                  <StatusBadge 
                    tone={t.priority === "high" ? "crimson" : t.priority === "medium" ? "amber" : "slate"} 
                    label={t.priority} 
                  />
                }
              />
            </div>
          ))}
          {status === "todo" && (
            <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-dashed border-outline-variant hover:border-primary/50">
              <PlusIcon className="w-4 h-4" /> Add Task
            </button>
          )}
        </KanbanColumn>
      </div>
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0 max-w-[1600px] w-full mx-auto">
         <h2 className="text-xl font-bold font-merriweather text-on-surface">Milestone Board</h2>
         <div className="flex items-center gap-3">
           <StatusBadge tone="sky" label="Sprint 14" />
         </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden w-full pb-4 px-6 -mx-6">
        <div className="flex h-full gap-6 px-6 pb-2 min-w-max">
          {renderColumn("todo", "To Do")}
          {renderColumn("in_progress", "In Progress")}
          {renderColumn("review", "Review")}
          {renderColumn("completed", "Completed")}
        </div>
      </div>
    </div>
  );
}
