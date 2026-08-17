"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Database, AlertTriangle, ArrowUpRight, Bell } from "lucide-react";

export default function GlobalStorageMonitoring() {
  const storageData = [
    { id: "ORG-003", name: "Stark Industries", used: 980, quota: 1000, trend: "+45 GB this week" },
    { id: "ORG-001", name: "Praimo Innovation", used: 450, quota: 1000, trend: "+12 GB this week" },
    { id: "ORG-002", name: "Acme Corp", used: 320, quota: 500, trend: "+5 GB this week" },
    { id: "ORG-005", name: "Cyberdyne", used: 85, quota: 100, trend: "+2 GB this week" },
    { id: "ORG-004", name: "Wayne Enterprises", used: 12, quota: 100, trend: "Stable" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Global Storage Monitoring" 
        subtitle="Track resource utilization and quota pressure across all organizations." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Resource Pressure (Top Consumers)" className="col-span-1 lg:col-span-2">
          <div className="p-4 space-y-6">
            {storageData.map((org, idx) => {
              const percent = (org.used / org.quota) * 100;
              const isCritical = percent > 90;
              const isWarning = percent > 75 && !isCritical;
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-on-surface">{org.name}</h4>
                      <p className="text-xs text-on-surface-variant font-jetbrains-mono">{org.id} • {org.trend}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-jetbrains-mono font-medium text-sm text-on-surface">{org.used} GB</span>
                        <span className="text-xs text-on-surface-variant mx-1">/</span>
                        <span className="text-xs text-on-surface-variant">{org.quota} GB</span>
                      </div>
                      <StatusBadge 
                        tone={isCritical ? "crimson" : isWarning ? "amber" : "emerald"}
                        label={isCritical ? "Critical" : isWarning ? "Warning" : "Healthy"}
                      />
                    </div>
                  </div>
                  <ProgressBar 
                    progress={percent} 
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    {isCritical && (
                      <button className="px-3 py-1 bg-semantic-amber-bg/20 text-semantic-amber hover:bg-semantic-amber hover:text-white border border-semantic-amber/30 rounded text-xs font-medium transition-colors flex items-center gap-1.5">
                        <Bell className="w-3 h-3" /> Notify Admin
                      </button>
                    )}
                    <button className="px-3 py-1 bg-surface-variant text-on-surface hover:bg-surface-variant/80 rounded text-xs font-medium transition-colors flex items-center gap-1.5">
                      <ArrowUpRight className="w-3 h-3" /> Request Expansion
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="col-span-1 space-y-6">
          <Card title="Storage Infrastructure" className="bg-gradient-to-br from-surface-container to-surface-container-high border-primary/20">
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Database className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-jetbrains-mono font-bold text-on-surface">1,847<span className="text-lg text-on-surface-variant ml-1">GB</span></h3>
                <p className="text-sm text-on-surface-variant mt-1">Total Allocated Storage</p>
              </div>
              <div className="w-full h-px bg-outline-variant/30 my-4" />
              <div className="w-full flex justify-between text-sm">
                <span className="text-on-surface-variant">Global Quota</span>
                <span className="font-semibold text-on-surface">5,000 GB</span>
              </div>
              <div className="w-full flex justify-between text-sm">
                <span className="text-on-surface-variant">Available Capacity</span>
                <span className="font-semibold text-semantic-emerald">3,153 GB</span>
              </div>
            </div>
          </Card>

          <Card title="Automated Actions">
             <div className="p-4 space-y-3">
               <div className="flex gap-3 items-start p-3 bg-surface-variant/30 rounded-lg">
                 <AlertTriangle className="w-4 h-4 text-semantic-amber mt-0.5 shrink-0" />
                 <div>
                   <p className="text-sm font-medium text-on-surface">Auto-Suspend Threshold</p>
                   <p className="text-xs text-on-surface-variant mt-1">Orgs exceeding 105% of quota will be set to read-only mode automatically.</p>
                 </div>
               </div>
               <button className="w-full px-4 py-2 border border-outline-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-variant transition-colors">
                 Configure Thresholds
               </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
