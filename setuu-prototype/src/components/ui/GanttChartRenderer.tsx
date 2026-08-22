"use client";

import React, { useState, useEffect } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { updateMilestoneDates } from '@/app/actions/timelineActions';

export function GanttChartRenderer({ tasks: initialTasks, onTasksChange }: { tasks: any[], onTasksChange: (tasks: any) => void }) {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (initialTasks.length > 0) {
      const formattedTasks: Task[] = [];
      
      initialTasks.forEach(t => {
        // 1. Live Task
        formattedTasks.push({
          start: new Date(t.custom_data?.start_date || t.created_at),
          end: new Date(t.target_date || new Date().getTime() + 86400000),
          name: t.title,
          id: t.id,
          type: 'task' as 'task',
          progress: t.completion_status ? 100 : (t.weight_percent || 0),
          isDisabled: false,
          styles: { 
            progressColor: t.completion_status ? '#059669' : '#0ea5e9', 
            progressSelectedColor: '#0284c7'
          },
          dependencies: t.dependencies
        });

        // 2. Baseline Task (Ghosted)
        if (t.baseline_start_date && t.baseline_end_date) {
           formattedTasks.push({
              start: new Date(t.baseline_start_date),
              end: new Date(t.baseline_end_date),
              name: `[Baseline] ${t.title}`,
              id: `${t.id}-baseline`,
              type: 'task' as 'task',
              progress: 0,
              isDisabled: true, // Cannot drag baseline
              styles: {
                backgroundColor: 'rgba(156, 163, 175, 0.2)', // gray-400 transparent
                backgroundSelectedColor: 'rgba(156, 163, 175, 0.2)',
                progressColor: 'transparent',
                progressSelectedColor: 'transparent'
              }
           });
        }
      });

      setTasks(formattedTasks);
    } else {
      // Provide a dummy task to prevent crash if empty
      setTasks([{
        start: new Date(),
        end: new Date(new Date().getTime() + 86400000),
        name: 'Project Start',
        id: 'start',
        type: 'project' as 'project',
        progress: 0,
        isDisabled: true
      }]);
    }
  }, [initialTasks]);

  const handleTaskChange = async (task: Task) => {
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    setTasks(newTasks);
    onTasksChange(newTasks);
    
    // Server action to save and cascade
    if (task.id !== 'start') {
       try {
         await updateMilestoneDates(task.id, task.start, task.end);
       } catch (err) {
         console.error("Failed to update milestone dates", err);
       }
    }
  };

  const handleTaskDelete = (task: Task) => {
    // Add logic later
  };

  const handleProgressChange = async (task: Task) => {
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    setTasks(newTasks);
  };

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-lg overflow-hidden shadow-sm">
       <div className="p-4 border-b border-outline-variant/30 flex gap-4 bg-surface-variant/20">
          <button className={`px-3 py-1 rounded text-sm ${view === ViewMode.Day ? 'bg-primary text-white' : 'bg-surface border'}`} onClick={() => setView(ViewMode.Day)}>Day</button>
          <button className={`px-3 py-1 rounded text-sm ${view === ViewMode.Week ? 'bg-primary text-white' : 'bg-surface border'}`} onClick={() => setView(ViewMode.Week)}>Week</button>
          <button className={`px-3 py-1 rounded text-sm ${view === ViewMode.Month ? 'bg-primary text-white' : 'bg-surface border'}`} onClick={() => setView(ViewMode.Month)}>Month</button>
       </div>
       <div className="p-4 overflow-x-auto w-full">
         {tasks.length > 0 && (
           <Gantt
             tasks={tasks}
             viewMode={view}
             onDateChange={handleTaskChange}
             onDelete={handleTaskDelete}
             onProgressChange={handleProgressChange}
             listCellWidth="155px"
             columnWidth={view === ViewMode.Month ? 150 : 60}
           />
         )}
       </div>
    </div>
  );
}
