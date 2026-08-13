"use client";

import { useState } from "react";
import { CheckCircle2Icon, CircleIcon } from "lucide-react";

export default function MobileMilestonesPage({ params }: { params: { id: string } }) {
  
  // Dummy state for mobile checklist
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify Site Access Credentials", completed: true },
    { id: 2, text: "Inspect Foundation Pour Quality", completed: false },
    { id: 3, text: "Sign-off on Initial Framing", completed: false },
    { id: 4, text: "Review Safety Protocol Compliance", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const progress = (tasks.filter(t => t.completed).length / tasks.length) * 100;

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto w-full pb-24">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Phase 1 Execution</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Foundation & Initial Setup</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-xs text-on-surface-variant mb-2">
          <span>{tasks.filter(t => t.completed).length} of {tasks.length} tasks completed</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-semantic-emerald' : 'bg-primary'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <button 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full min-h-[72px] flex items-center gap-4 px-5 rounded-xl border text-left transition-all active:scale-[0.98] ${
              task.completed 
                ? "bg-surface-container/50 border-outline-variant/30 opacity-70" 
                : "bg-surface border-outline-variant hover:border-primary shadow-sm"
            }`}
          >
            <div className="shrink-0">
              {task.completed ? (
                <CheckCircle2Icon className="w-8 h-8 text-semantic-emerald" />
              ) : (
                <CircleIcon className="w-8 h-8 text-outline-variant" />
              )}
            </div>
            <span className={`text-base font-medium leading-tight ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
              {task.text}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
