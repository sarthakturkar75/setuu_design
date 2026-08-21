"use client";
import { useToast } from "@/contexts/ToastContext";
import * as React from "react";
import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CheckCircleIcon, FileTextIcon, WrenchIcon, KeyIcon, AlertTriangleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { getProjectMilestones, toggleChecklistItem } from "@/app/actions/milestoneActions";

export default function ProjectHandoverPage() {
  const toast = useToast();

  const [checklist, setChecklist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function fetchChecklists() {
      if (!id) return;
      try {
        const milestones = await getProjectMilestones(id);
        if (!milestones || milestones.length === 0) {
          setLoading(false);
          return;
        }

        const mappedItems: any[] = [];
        for (const m of milestones) {
          const items = m.milestone_checklist_items || [];
          for (const item of items) {
            let Icon = FileTextIcon;
            if (item.title.toLowerCase().includes('key') || item.title.toLowerCase().includes('access')) Icon = KeyIcon;
            else if (item.title.toLowerCase().includes('spare') || item.title.toLowerCase().includes('maintenance')) Icon = WrenchIcon;
            else if (item.title.toLowerCase().includes('safety') || item.title.toLowerCase().includes('fire')) Icon = AlertTriangleIcon;

            mappedItems.push({
              id: item.id,
              category: m.title,
              task: item.title,
              isComplete: item.is_complete,
              icon: Icon
            });
          }
        }
        
        setChecklist(mappedItems);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChecklists();
  }, [id]);

  const toggleItem = async (itemId: string, currentStatus: boolean) => {
    // Optimistic update
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, isComplete: !currentStatus } : item
    ));

    const res = await toggleChecklistItem(itemId, !currentStatus);
    if (!res.success) {
      console.error("Failed to update checklist item");
      // Revert if error
      setChecklist(prev => prev.map(item => 
        item.id === itemId ? { ...item, isComplete: currentStatus } : item
      ));
    }
  };

  const completedCount = checklist.filter(item => item.isComplete).length;
  const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-8 pb-32">
      <div className="flex justify-between items-start bg-surface-container rounded-xl p-8 border border-outline-variant">
        <div>
          <h2 className="text-2xl font-bold font-merriweather text-on-surface">Handover Console</h2>
          <p className="text-on-surface-variant mt-2 max-w-[600px]">
            Manage the final phase of the project. Ensure all documentation, physical assets, and compliance certificates are transferred to the client.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-on-surface-variant mb-1">Overall Readiness</div>
          <div className="text-4xl font-bold font-jetbrains-mono text-primary">{progress}%</div>
          <StatusBadge tone={progress === 100 && checklist.length > 0 ? "emerald" : "amber"} label={progress === 100 && checklist.length > 0 ? "Ready for Handover" : "Incomplete"} className="mt-2" />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold font-merriweather text-on-surface">Integrity Checklist</h3>
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden min-h-[200px]">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">Loading checklists...</div>
          ) : checklist.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">No checklist items found for this project.</div>
          ) : (
            checklist.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`p-4 flex items-center justify-between ${index !== checklist.length - 1 ? 'border-b border-outline-variant/50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${item.isComplete ? 'border-semantic-emerald bg-semantic-emerald text-white' : 'border-outline-variant text-transparent'}`}>
                      {item.isComplete && <CheckCircleIcon className="w-4 h-4" />}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-outline-variant/30 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-0.5">{item.category}</div>
                      <div className={`text-sm font-medium ${item.isComplete ? 'text-on-surface' : 'text-on-surface'}`}>{item.task}</div>
                    </div>
                  </div>
                  <div>
                    <Button variant={item.isComplete ? "outline" : "primary"} size="sm" onClick={() => toggleItem(item.id, item.isComplete)}>
                      {item.isComplete ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={async () => {
          const { generateProjectReport } = await import("@/app/actions/reportActions");
          const res = await generateProjectReport(id, ["handover"]);
          if (res.success) {
            toast.success(`Dossier ready! Download link: ${res.downloadUrl}`);
          } else {
            toast.error("Error: " + res.error);
          }
        }}>
          Export Handover Dossier
        </Button>
        <Button variant="primary" disabled={progress < 100 || checklist.length === 0} onClick={async () => {
          const { createMeeting } = await import("@/app/actions/meetingActions");
          const res = await createMeeting({
            project_id: id,
            title: "Final Handover Meeting",
            meeting_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "Scheduled"
          });
          if (res.success) {
            toast.success("Meeting Scheduled successfully!");
          } else {
            toast.error("Error: " + res.error);
          }
        }}>
          Schedule Client Meeting
        </Button>
      </div>
    </div>
  );
}
