"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getTimelineData, updateTaskDates } from "@/app/actions/timelineActions";
import { KanbanColumn } from "@/components/ui/KanbanColumn";
import { KanbanCard } from "@/components/ui/KanbanCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export default function EngineerTasks() {
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

  const handleDragEnd = async (e: any) => {
    // simplified drag end - updating status locally
    const { active, over } = e;
    if (!over) return;
    if (active.id !== over.id) {
      const taskId = active.id;
      const newStatus = over.id; // Assuming column id is the status
      
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      
      // Call server action to persist status
      // Note: updateTaskDates might need to be adapted or another action used for status only,
      // but following the plan's suggestion:
      // await updateTaskDates(taskId, "startDate", "endDate");
    }
  };

  const statuses = ["To Do", "In Progress", "Blocked", "Completed"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <PageHeader title="My Assigned Tasks" subtitle="Multidisciplinary execution board across all projects." />
      
      <FilterBar onApply={() => {}}><select className="p-2 border rounded"><option>All</option></select></FilterBar>

      <div className="flex-1 overflow-x-auto min-h-[500px]">
        {isLoading ? (
          <div className="animate-pulse flex gap-4 h-full">
            {[1, 2, 3, 4].map(i => (
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
                        
                        
                        assignee={task.assignee_id ? { id: "1", name: "Assigned", avatarUrl: "" } : undefined}
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
        title={selectedTask?.title || "Task Details"}
      >
        {selectedTask && (
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Description</h4>
              <p className="text-on-surface">{selectedTask.description || "No description provided."}</p>
            </div>
            
            <div className="flex gap-3 pt-6 border-t border-outline-variant/30">
              <Button onClick={() => {
                setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, status: "Completed" } : t));
                setSelectedTask(null);
                // status update;
              }}>Complete Task</Button>
              <Button variant="outline">Log Time</Button>
              <Button variant="ghost">Edit</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
