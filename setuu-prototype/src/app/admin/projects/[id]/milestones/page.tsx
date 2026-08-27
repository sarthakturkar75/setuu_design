"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import { KanbanCard } from "@/components/ui/KanbanCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon, DollarSign, ListTodo, AlertTriangle } from "lucide-react";
import { getProjectMilestones, updateMilestone, deleteMilestone, createMilestone } from "@/app/actions/milestoneActions";
import { useToast } from "@/contexts/ToastContext";

// WIP Limits mapping (could be fetched from project_config)
const WIP_LIMITS: Record<string, number> = {
  todo: 99,
  in_progress: 3,
  review: 5,
  completed: 99
};

import { getCycleTimeAnalytics } from "@/app/actions/kanbanAnalyticsActions";

export default function MilestoneKanbanPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [milestones, setMilestones] = React.useState<any[]>([]);
  const [cycleAnalytics, setCycleAnalytics] = React.useState({ inProgressAvg: 0, reviewAvg: 0 });
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState('');
  const [newWBS, setNewWBS] = React.useState('');
  const [newSOV, setNewSOV] = React.useState('');
  
  const toast = useToast();

  React.useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const data = await getProjectMilestones(projectId);
        setMilestones(data || []);
        
        const analytics = await getCycleTimeAnalytics(projectId);
        setCycleAnalytics(analytics as any);
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

  const handleDrop = async (e: React.DragEvent, columnId: string, statusLabel: string) => {
    e.preventDefault();
    if (draggedTask) {
      // Check WIP Limits
      const columnCount = milestones.filter(t => (t.custom_data?.kanban_status || getColumnForStatus(t.status_label)) === columnId).length;
      if (WIP_LIMITS[columnId] && columnCount >= WIP_LIMITS[columnId]) {
         toast.error(`WIP Limit Reached: Cannot add more than ${WIP_LIMITS[columnId]} items to ${statusLabel}.`);
         return;
      }

      const isCompleted = columnId === 'completed';
      const originalMilestone = milestones.find(t => t.id === draggedTask);
      
      // Optimistic update
      setMilestones(prev => prev.map(t => 
        t.id === draggedTask ? { 
          ...t, 
          completion_status: isCompleted, 
          status_label: statusLabel,
          custom_data: { ...t.custom_data, kanban_status: columnId }
        } : t
      ));
      
      // Server update
      const res = await updateMilestone(draggedTask, { 
        completion_status: isCompleted,
        custom_data: { ...(originalMilestone?.custom_data || {}), kanban_status: columnId }
      });

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

  const renderColumn = (columnId: string, title: string, swimlaneMilestones: any[], dept: string) => {
    const columnMilestones = swimlaneMilestones.filter(t => (t.custom_data?.kanban_status || getColumnForStatus(t.status_label)) === columnId);
    
    const isOverWIP = WIP_LIMITS[columnId] && columnMilestones.length >= WIP_LIMITS[columnId];

    return (
      <div 
        className="h-full flex-shrink-0 w-80 flex flex-col"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, columnId, title)} 
      >
        <div className={`mb-3 px-1 flex justify-between items-center ${isOverWIP ? 'text-semantic-crimson' : 'text-on-surface-variant'}`}>
           <span className="font-semibold text-sm font-jetbrains flex items-center gap-2">
             {title}
             {isOverWIP && <AlertTriangle className="w-4 h-4" />}
           </span>
           <span className="text-xs bg-surface-variant px-2 py-0.5 rounded-full">{columnMilestones.length} / {WIP_LIMITS[columnId]}</span>
        </div>
        <div className={`flex-1 bg-surface-variant/30 rounded-xl p-3 flex flex-col gap-3 overflow-y-auto ${isOverWIP ? 'border border-semantic-crimson/50' : 'border border-outline-variant/30'}`}>
          {columnMilestones.map(t => {
            const checklists = t.milestone_checklist_items || [];
            const completedCount = checklists.filter((c:any) => c.is_complete).length;
            const progressRatio = checklists.length > 0 ? `${completedCount}/${checklists.length}` : null;
            
            return (
              <div 
                key={t.id} 
                id={t.id}
                draggable 
                onDragStart={(e) => handleDragStart(e, t.id)}
                onDragEnd={(e) => handleDragEnd(e, t.id)}
              >
                <KanbanCard 
                  id={t.id}
                  title={
                    <div className="flex flex-col gap-1">
                      {t.wbs_code && <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded w-fit">{t.wbs_code}</span>}
                      <span>{t.title || t.name}</span>
                    </div>
                  }
                  assignee={{ id: t.id, name: t.department || "Unassigned" }}
                  badge={
                    <div className="flex gap-2 items-center">
                       {t.sov_value > 0 && (
                         <StatusBadge tone="emerald" label={`$${Number(t.sov_value).toLocaleString()}`} icon={<DollarSign className="w-3 h-3" />} />
                       )}
                       {progressRatio && (
                         <StatusBadge tone="slate" label={progressRatio} icon={<ListTodo className="w-3 h-3" />} />
                       )}
                       <StatusBadge 
                         tone={t.status_label === "Overdue" ? "crimson" : "slate"} 
                         label={t.target_date || "No date"} 
                       />
                    </div>
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
            );
          })}
          {columnId === "todo" && (
            showAddForm === dept ? (
              <div className="mt-2 flex flex-col gap-2 p-3 bg-surface rounded-lg border border-outline-variant">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface text-sm text-on-surface"
                  autoFocus
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWBS}
                    onChange={(e) => setNewWBS(e.target.value)}
                    placeholder="WBS (1.1)"
                    className="w-1/2 px-3 py-2 rounded border border-outline-variant bg-surface text-sm text-on-surface font-mono"
                  />
                  <input
                    type="number"
                    value={newSOV}
                    onChange={(e) => setNewSOV(e.target.value)}
                    placeholder="SOV $"
                    className="w-1/2 px-3 py-2 rounded border border-outline-variant bg-surface text-sm text-on-surface font-mono"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={async () => {
                      if (!newTitle) return;
                      const res = await createMilestone(projectId, { 
                        title: newTitle, 
                        wbs_code: newWBS, 
                        sov_value: parseFloat(newSOV) || 0,
                        status_label: 'Not Started',
                        completion_status: false,
                        department: dept === "General" ? null : dept
                      });
                      if (res.success) {
                        toast.success('Milestone created!');
                        setNewTitle(''); setNewWBS(''); setNewSOV('');
                        setShowAddForm(null);
                        const data = await getProjectMilestones(projectId);
                        setMilestones(data || []);
                      } else {
                        toast.error(res.error || 'Failed to create milestone');
                      }
                    }}
                    className="flex-1 py-2 bg-primary text-on-primary rounded text-sm font-semibold"
                  >Add</button>
                  <button onClick={() => { setShowAddForm(null); setNewTitle(''); setNewWBS(''); setNewSOV(''); }} className="px-3 py-2 text-sm text-on-surface-variant">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddForm(dept)} className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all text-sm border border-dashed border-outline-variant hover:border-primary/50">
                <PlusIcon className="w-4 h-4" /> Add Task
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-center text-on-surface-variant">Loading milestone board...</div>;
  }

  // Calculate Swimlanes
  const departments = milestones.length > 0 ? Array.from(new Set(milestones.map(m => m.department || "General"))).sort() : ["General"];

  return (
    <div className="p-6 h-[calc(100vh-140px)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0 max-w-[1600px] w-full mx-auto">
         <div>
           <h2 className="text-2xl font-bold font-merriweather text-on-surface">Milestone Board</h2>
           <p className="text-on-surface-variant text-sm mt-1">Cost-loaded tasks, WIP limits, and sub-contractor handoffs.</p>
         </div>
         <div className="flex items-center gap-3">
           <div className="flex flex-col text-right mr-4">
             <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-jetbrains">Avg Cycle Time</span>
             <span className="text-sm font-semibold text-on-surface">
               {cycleAnalytics.inProgressAvg}h <span className="text-on-surface-variant font-normal">in progress</span> &bull; {cycleAnalytics.reviewAvg}h <span className="text-on-surface-variant font-normal">in review</span>
             </span>
           </div>
           <a href={`/api/billing/aia?projectId=${projectId}`} target="_blank" className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant/30 rounded-md text-sm font-medium hover:bg-surface-variant/30 transition-colors">
             <DollarSign className="w-4 h-4 text-semantic-emerald" /> 
             Generate AIA G702
           </a>
           <StatusBadge tone="sky" label="Active" />
         </div>
      </div>

      <div className="flex-1 overflow-auto w-full pb-4 px-6 -mx-6 flex flex-col gap-8">
        {departments.map(dept => {
          const deptMilestones = milestones.filter(m => (m.department || "General") === dept);
          return (
            <div key={dept} className="flex flex-col">
              <h3 className="text-lg font-bold font-merriweather text-on-surface mb-4 pb-2 border-b border-outline-variant/50">{dept} Trade</h3>
              <div className="flex gap-6 min-w-max">
                {renderColumn("todo", "Not Started", deptMilestones, dept)}
                {renderColumn("in_progress", "In Progress", deptMilestones, dept)}
                {renderColumn("review", "Review", deptMilestones, dept)}
                {renderColumn("completed", "Completed", deptMilestones, dept)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
