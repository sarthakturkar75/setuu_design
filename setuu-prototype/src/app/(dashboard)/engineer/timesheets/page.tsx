"use client";

import * as React from "react";
import { useState } from "react";
import { Clock, Code2, Cpu, Settings, Calendar, Save, FileCheck2 } from "lucide-react";

// Mock Weekly Tasks
const timesheetTasks = [
  { id: "TSK-8902", title: "Implement Motor Controller Logic", discipline: "Software", hours: [4.5, 5, 0, 0, 0, 0, 0] },
  { id: "TSK-8799", title: "Route PCB for Sensor Array", discipline: "Electrical", hours: [3.5, 3, 2, 0, 0, 0, 0] },
  { id: "TSK-8841", title: "Verify Enclosure Thermal Stress", discipline: "Mechanical", hours: [0, 0, 6, 4.5, 0, 0, 0] },
  { id: "TSK-8800", title: "General Engineering Overhead", discipline: "Admin", hours: [0, 0, 0, 3.5, 8, 0, 0] }
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimesheetsPage() {
  const [data, setData] = useState(timesheetTasks);
  const [activeCell, setActiveCell] = useState<{task: string, day: number} | null>(null);
  
  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case "Software": return <Code2 className="w-4 h-4 text-semantic-sky" />;
      case "Mechanical": return <Settings className="w-4 h-4 text-semantic-amber" />;
      case "Electrical": return <Cpu className="w-4 h-4 text-semantic-emerald" />;
      default: return <Clock className="w-4 h-4 text-outline" />;
    }
  };

  const calculateTotal = (hours: number[]) => hours.reduce((a, b) => a + b, 0);

  const handleHourChange = (taskId: string, dayIndex: number, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 24) return;
    
    setData(prev => prev.map(t => {
      if (t.id === taskId) {
        const newHours = [...t.hours];
        newHours[dayIndex] = numValue;
        return { ...t, hours: newHours };
      }
      return t;
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-merriweather text-2xl font-bold text-on-surface">Labor & Timesheet Logging</h1>
          <p className="text-on-surface-variant text-sm mt-1">Fractional hour input for active technical tasks. (Financial data restricted)</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm font-medium text-on-surface bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30">
            <Calendar className="w-4 h-4 mr-2 text-on-surface-variant" />
            Week of Aug 10 - Aug 16, 2026
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-primary/90 transition-colors shadow-sm">
            <FileCheck2 className="w-4 h-4 mr-2" />
            Submit Timesheet
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-surface border-b border-outline-variant/30 p-4">
          <div className="col-span-4 text-sm font-bold text-on-surface-variant font-inter uppercase tracking-wider">
            Task Assignment
          </div>
          <div className="col-span-7 grid grid-cols-7 gap-2 text-center">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="col-span-1 text-center text-sm font-bold text-on-surface-variant font-inter uppercase tracking-wider">
            Total
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-outline-variant/30">
          {data.map((task) => (
            <div key={task.id} className="grid grid-cols-12 p-4 items-center hover:bg-surface/50 transition-colors">
              
              {/* Task Details */}
              <div className="col-span-4 pr-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-jetbrains-mono text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    {task.id}
                  </span>
                  {getDisciplineIcon(task.discipline)}
                </div>
                <div className="text-sm font-bold text-on-surface leading-tight font-inter">
                  {task.title}
                </div>
              </div>

              {/* Day Inputs */}
              <div className="col-span-7 grid grid-cols-7 gap-2">
                {task.hours.map((val, idx) => (
                  <div key={idx} className="relative">
                    <input 
                      type="number" 
                      step="0.5"
                      min="0"
                      max="24"
                      value={val || ""}
                      onChange={(e) => handleHourChange(task.id, idx, e.target.value)}
                      onFocus={() => setActiveCell({ task: task.id, day: idx })}
                      onBlur={() => setActiveCell(null)}
                      className={`
                        w-full h-10 text-center font-jetbrains-mono text-sm font-medium rounded-lg 
                        bg-surface border focus:outline-none transition-all
                        ${activeCell?.task === task.id && activeCell?.day === idx 
                          ? 'border-[#41BEFD] ring-1 ring-[#41BEFD] text-on-surface bg-white shadow-[0_0_8px_rgba(65,190,253,0.3)]' 
                          : 'border-outline-variant/50 text-on-surface-variant hover:border-outline-variant'
                        }
                      `}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Row Total */}
              <div className="col-span-1 text-center">
                <span className="font-jetbrains-mono font-bold text-lg text-on-surface">
                  {calculateTotal(task.hours).toFixed(1)}
                </span>
                <span className="text-xs text-on-surface-variant ml-1 font-inter">hrs</span>
              </div>

            </div>
          ))}
        </div>

        {/* Footer Totals */}
        <div className="grid grid-cols-12 bg-surface border-t border-outline-variant/30 p-4">
          <div className="col-span-4 flex items-center justify-between pr-4">
            <span className="text-sm font-bold text-on-surface uppercase tracking-wider">Weekly Totals</span>
            <div className="flex items-center text-xs text-on-surface-variant font-medium">
              <Clock className="w-3 h-3 mr-1" />
              Standard 40h
            </div>
          </div>
          <div className="col-span-7 grid grid-cols-7 gap-2 text-center">
            {daysOfWeek.map((_, idx) => (
              <div key={idx} className="font-jetbrains-mono text-sm font-bold text-on-surface-variant">
                {data.reduce((sum, task) => sum + task.hours[idx], 0).toFixed(1)}
              </div>
            ))}
          </div>
          <div className="col-span-1 text-center">
            <span className="font-jetbrains-mono font-bold text-xl text-primary">
              {data.reduce((sum, task) => sum + calculateTotal(task.hours), 0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
