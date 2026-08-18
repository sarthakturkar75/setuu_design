"use client";
import * as React from "react";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { CheckCircleIcon, FileTextIcon, WrenchIcon, KeyIcon, AlertTriangleIcon } from "lucide-react";

export default function ProjectHandoverPage() {
  const [checklist, setChecklist] = useState([
    { id: "1", category: "Documentation", task: "All As-Built Drawings Uploaded", isComplete: true, icon: FileTextIcon },
    { id: "2", category: "Documentation", task: "O&M Manuals Compiled", isComplete: true, icon: FileTextIcon },
    { id: "3", category: "Inspections", task: "Final Fire Safety Certificate", isComplete: false, icon: AlertTriangleIcon },
    { id: "4", category: "Physical", task: "All Keys & Access Cards Transferred", isComplete: false, icon: KeyIcon },
    { id: "5", category: "Maintenance", task: "Spare Parts Inventory Logged", isComplete: true, icon: WrenchIcon },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, isComplete: !item.isComplete } : item
    ));
  };

  const completedCount = checklist.filter(item => item.isComplete).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

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
          <StatusBadge tone={progress === 100 ? "emerald" : "amber"} label={progress === 100 ? "Ready for Handover" : "Incomplete"} className="mt-2" />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold font-merriweather text-on-surface">Integrity Checklist</h3>
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
          {checklist.map((item, index) => {
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
                  <Button variant={item.isComplete ? "outline" : "primary"} size="sm" onClick={() => toggleItem(item.id)}>
                    {item.isComplete ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={() => alert("Downloading PDF Dossier...")}>Export Handover Dossier</Button>
        <Button variant="primary" disabled={progress < 100} onClick={() => alert("Meeting Scheduled!")}>Schedule Client Meeting</Button>
      </div>
    </div>
  );
}
