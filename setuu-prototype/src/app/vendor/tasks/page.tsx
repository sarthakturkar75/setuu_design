"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTimelineData, updateTaskDates } from "@/app/actions/timelineActions";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import { KanbanCard } from "@/components/ui/KanbanCard";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Toast, toast } from "@/components/ui/Toast";

export default function VendorTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTimelineData(""); // passing empty or undefined to get all assigned tasks
        setTasks(data.tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const statuses = ["To Do", "In Progress", "Verification"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <PageHeader title="Subcontracted Tasks" subtitle="Execute and submit deliverables for assigned work." />
      
      <div className="flex-1 overflow-x-auto min-h-[500px]">
        {isLoading ? (
          <div className="animate-pulse flex gap-4 h-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-80 bg-surface-container rounded-lg shrink-0"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 h-full items-start">
            {statuses.map(status => (
              <KanbanColumn key={status} id={status} title={status} count={tasks.filter(t => t.status === status || (status === 'To Do' && !t.status)).length}>
                <div className="space-y-3 p-2">
                  {tasks.filter(t => t.status === status || (status === 'To Do' && !t.status)).map(task => (
                    <div key={task.id} onClick={() => setSelectedTask(task)}>
                      <KanbanCard 
                        id={task.id}
                        title={task.title}
                        
                        
                      />
                    </div>
                  ))}
                </div>
              </KanbanColumn>
            ))}
          </div>
        )}
      </div>

      <Drawer 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || "Task Execution"}
      >
        {selectedTask && (
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Description</h4>
                <p className="text-on-surface">{selectedTask.description || "No description provided."}</p>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/30">
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Attach Deliverables</h4>
                <FileDropzone onFileSelect={() => {}} accept="*/*" />
              </div>
            </div>
            
            <div className="flex gap-3 pt-6 border-t border-outline-variant/30 mt-auto">
              <Button onClick={() => {
                setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, status: "Verification" } : t));
                setSelectedTask(null);
                // status update;
                toast.success("Submitted for PM verification");
              }}>Submit for Verification</Button>
              <Button variant="outline">Save Draft</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
