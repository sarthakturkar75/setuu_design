"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { 
  GitCommit, 
  Ticket, 
  Box, 
  CheckCircle2, 
  Circle, 
  Code2, 
  Cpu, 
  Settings,
  Paperclip,
  ListChecks
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Mock Data
const tasks = [
  {
    id: "TSK-8902",
    title: "Implement Motor Controller Logic",
    discipline: "Software",
    status: "in_progress",
    commit: "a4f8d9b",
    jira: "SETUU-1402",
    plm: "N/A",
    spec: `### Requirements
- Interface with the CAN bus using standard protocol 2.0A
- Send PWM signals at 20kHz
- Safety override must trigger within 5ms

#### Sub-routines
\`\`\`c
void safety_override_isr() {
  motor_stop();
  trigger_alarm();
}
\`\`\`
`,
    criteria: [
      { id: 1, label: "CAN bus communication verified", done: true },
      { id: 2, label: "PWM outputs active on logic analyzer", done: false },
      { id: 3, label: "Safety override latency < 5ms", done: false }
    ]
  },
  {
    id: "TSK-8799",
    title: "Route PCB for Sensor Array",
    discipline: "Electrical",
    status: "todo",
    commit: "N/A",
    jira: "SETUU-1355",
    plm: "REV-B.04",
    spec: "### Routing Constraints\n- Differential pairs for high-speed ADC lines must be length-matched within 0.1mm.\n- Keep switching regulators at least 20mm away from analog front-end.",
    criteria: [
      { id: 1, label: "Component placement approved by Mech", done: false },
      { id: 2, label: "Differential pairs routed", done: false },
      { id: 3, label: "DRC passed", done: false }
    ]
  },
  {
    id: "TSK-8841",
    title: "Verify Enclosure Thermal Stress",
    discipline: "Mechanical",
    status: "review",
    commit: "N/A",
    jira: "SETUU-1380",
    plm: "REV-A.12",
    spec: "### Simulation Parameters\n- Ambient temp: 45°C\n- Heat dissipation: 15W internal\n- Expected max surface temp: <60°C",
    criteria: [
      { id: 1, label: "Mesh generated", done: true },
      { id: 2, label: "Steady-state thermal sim run", done: true },
      { id: 3, label: "Report compiled", done: true }
    ]
  }
];

export default function KanbanBoard() {
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [localTasks, setLocalTasks] = useState(tasks);

  const columns = [
    { id: "todo", label: "To Do", color: "bg-surface-container" },
    { id: "in_progress", label: "In Progress", color: "bg-semantic-sky/10" },
    { id: "review", label: "In Review", color: "bg-semantic-purple/10" },
    { id: "done", label: "Verified", color: "bg-semantic-emerald/10" }
  ];

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case "Software": return <Code2 className="w-4 h-4" />;
      case "Mechanical": return <Settings className="w-4 h-4" />;
      case "Electrical": return <Cpu className="w-4 h-4" />;
      default: return null;
    }
  };

  const toggleCriteria = (taskId: string, criteriaId: number) => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          criteria: t.criteria.map(c => 
            c.id === criteriaId ? { ...c, done: !c.done } : c
          )
        };
      }
      return t;
    }));
    if (selectedTask.id === taskId) {
      setSelectedTask(prev => ({
        ...prev,
        criteria: prev.criteria.map(c => 
          c.id === criteriaId ? { ...c, done: !c.done } : c
        )
      }));
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left: Kanban Board */}
      <div className="flex-1 flex overflow-x-auto p-6 space-x-6 border-r border-outline-variant/50">
        {columns.map(col => (
          <div key={col.id} className="flex-none w-80 flex flex-col">
            <h3 className="font-merriweather font-bold text-sm text-on-surface mb-4 flex items-center justify-between">
              {col.label}
              <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-xs">
                {localTasks.filter(t => t.status === col.id).length}
              </span>
            </h3>
            <div className={`flex-1 rounded-xl p-3 space-y-3 overflow-y-auto border border-outline-variant/30 ${col.color}`}>
              {localTasks.filter(t => t.status === col.id).map(task => (
                <Card 
                  key={task.id} 
                  className={`cursor-pointer transition-shadow hover:shadow-md ${selectedTask.id === task.id ? 'ring-2 ring-primary border-transparent' : ''}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <CardHeader className="p-3 pb-2 space-y-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-jetbrains-mono text-[10px] font-semibold text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="text-on-surface-variant">
                        {getDisciplineIcon(task.discipline)}
                      </span>
                    </div>
                    <CardTitle className="text-sm font-bold leading-tight font-inter">
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-xs text-on-surface-variant flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-semantic-emerald" />
                      {task.criteria.filter(c => c.done).length}/{task.criteria.length}
                    </span>
                    {task.commit !== "N/A" && (
                      <span className="font-jetbrains-mono flex items-center">
                        <GitCommit className="w-3 h-3 mr-1" /> {task.commit}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Detail Pane */}
      <div className="w-[450px] bg-surface-container-lowest overflow-y-auto">
        {selectedTask ? (
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-jetbrains-mono text-sm font-bold bg-surface-container-high px-2 py-1 rounded text-primary">
                {selectedTask.id}
              </span>
              <StatusBadge tone={
                selectedTask.status === "todo" ? "slate" :
                selectedTask.status === "in_progress" ? "sky" :
                selectedTask.status === "review" ? "purple" : "emerald"
              } label={columns.find(c => c.id === selectedTask.status)?.label || ""} />
            </div>

            <h2 className="text-2xl font-merriweather font-bold text-on-surface mb-6">
              {selectedTask.title}
            </h2>

            {/* Immutable Metadata Blocks */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container rounded-lg p-3 border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant font-inter flex items-center mb-1">
                  <GitCommit className="w-3 h-3 mr-1" /> Git Hash
                </span>
                <span className="font-jetbrains-mono text-sm text-on-surface select-all">
                  {selectedTask.commit}
                </span>
              </div>
              <div className="bg-surface-container rounded-lg p-3 border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant font-inter flex items-center mb-1">
                  <Ticket className="w-3 h-3 mr-1" /> Jira Ticket
                </span>
                <span className="font-jetbrains-mono text-sm text-on-surface select-all">
                  {selectedTask.jira}
                </span>
              </div>
              <div className="bg-surface-container rounded-lg p-3 border border-outline-variant/30 col-span-2">
                <span className="text-xs text-on-surface-variant font-inter flex items-center mb-1">
                  <Box className="w-3 h-3 mr-1" /> PLM Revision
                </span>
                <span className="font-jetbrains-mono text-sm text-on-surface select-all">
                  {selectedTask.plm}
                </span>
              </div>
            </div>

            {/* Markdown Spec */}
            <div className="mb-8 prose prose-sm dark:prose-invert prose-pre:bg-surface-container-highest prose-pre:text-on-surface prose-pre:font-jetbrains-mono">
              <ReactMarkdown>{selectedTask.spec}</ReactMarkdown>
            </div>

            {/* Sub-task Checklists */}
            <div>
              <h4 className="font-merriweather font-bold text-sm text-on-surface mb-3 flex items-center">
                <ListChecks className="w-4 h-4 mr-2" />
                Acceptance Criteria
              </h4>
              <div className="space-y-2">
                {selectedTask.criteria.map((criteria) => (
                  <button
                    key={criteria.id}
                    onClick={() => toggleCriteria(selectedTask.id, criteria.id)}
                    className="w-full flex items-start p-3 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/30 transition-colors text-left"
                  >
                    {criteria.done ? (
                      <CheckCircle2 className="w-5 h-5 text-semantic-emerald mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-outline mt-0.5 shrink-0" />
                    )}
                    <span className={`ml-3 text-sm font-inter ${criteria.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                      {criteria.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-on-surface-variant">
            Select a task to view details
          </div>
        )}
      </div>
    </div>
  );
}
