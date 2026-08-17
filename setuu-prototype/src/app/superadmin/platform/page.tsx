"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { AlertTriangle, Save, RotateCcw, Radio, Activity, Terminal } from "lucide-react";

export default function PlatformConfig() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcast, setBroadcast] = useState("");

  const auditTrail = [
    { time: "10:45:22 UTC", user: "s.admin@setuu.com", action: "Updated API Rate Limits" },
    { time: "08:12:00 UTC", user: "system", action: "Automated Backup Completed" },
    { time: "Yesterday", user: "j.doe@setuu.com", action: "Provisioned ORG-005" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Platform Configuration" 
          subtitle="Manage global platform state, broadcasting, and feature flags."
        />
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant/80 transition-colors">
            <RotateCcw className="w-4 h-4" /> Revert Changes
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card title="Global State">
            <div className="p-6 space-y-6">
              {maintenanceMode && (
                <div className="flex gap-3 p-4 bg-semantic-amber-bg/20 border border-semantic-amber/50 rounded-lg animate-pulse-amber">
                  <AlertTriangle className="w-6 h-6 text-semantic-amber shrink-0" />
                  <div>
                    <h4 className="font-bold text-semantic-amber uppercase tracking-wider text-sm">Maintenance Mode Active</h4>
                    <p className="text-sm text-on-surface mt-1">All non-admin traffic will be routed to the maintenance page. Active sessions will be terminated within 5 minutes.</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center p-4 bg-surface-variant/20 border border-outline-variant/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-on-surface">Enable Maintenance Mode</h4>
                  <p className="text-sm text-on-surface-variant mt-1">Isolates the platform for critical updates.</p>
                </div>
                <ToggleSwitch checked={maintenanceMode} onChange={setMaintenanceMode} />
              </div>

              <div className="space-y-3">
                <label className="font-medium text-on-surface">Global Broadcast Banner</label>
                <p className="text-sm text-on-surface-variant">Push an urgent message to all active users globally.</p>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={broadcast}
                    onChange={(e) => setBroadcast(e.target.value)}
                    placeholder="e.g. Scheduled maintenance in 1 hour..." 
                    className="flex-1 bg-surface-container border border-outline-variant rounded p-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button className="px-6 py-2 bg-semantic-sky text-white rounded font-medium hover:bg-semantic-sky/90 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <Radio className="w-4 h-4" /> Push Now
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Feature Flags">
            <div className="p-4 space-y-2">
               {[
                 { id: "beta_dashboard", name: "Beta Reporting Dashboard", desc: "Enable access to the v2 reporting engine", state: false },
                 { id: "ai_insights", name: "Generative AI Insights", desc: "Enable LLM-powered project analysis", state: true },
                 { id: "multi_region", name: "Multi-Region Sync", desc: "Enable cross-region database replication", state: true },
               ].map((flag) => (
                 <div key={flag.id} className="flex justify-between items-center p-3 hover:bg-surface-variant/30 rounded border border-transparent hover:border-outline-variant/30 transition-colors">
                   <div>
                     <h4 className="font-medium text-on-surface text-sm">{flag.name}</h4>
                     <p className="text-xs text-on-surface-variant mt-0.5">{flag.desc}</p>
                   </div>
                   <ToggleSwitch checked={flag.state} onChange={() => {}} />
                 </div>
               ))}
            </div>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card title="Infrastructure Health" className="bg-surface-container-high border-none">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-semantic-emerald animate-pulse" />
                <span className="font-medium text-on-surface text-sm">Primary Database <span className="text-on-surface-variant font-normal">(Connected)</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-semantic-emerald animate-pulse" />
                <span className="font-medium text-on-surface text-sm">Storage Bucket <span className="text-on-surface-variant font-normal">(Connected)</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-semantic-amber animate-pulse" />
                <span className="font-medium text-on-surface text-sm">Sync Gateway <span className="text-on-surface-variant font-normal">(High Load)</span></span>
              </div>
              <button className="w-full mt-2 py-2 border border-outline-variant text-on-surface text-xs font-medium rounded hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                <Activity className="w-3 h-3" /> View Telemetry
              </button>
            </div>
          </Card>

          <Card title="Configuration Audit Trail" className="border-outline-variant/50">
            <div className="p-4 space-y-4">
              {auditTrail.map((log, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-outline-variant/50 pb-4 last:pb-0 last:border-transparent">
                  <div className="absolute w-2 h-2 rounded-full bg-outline-variant -left-[5px] top-1" />
                  <p className="text-xs font-jetbrains-mono text-on-surface-variant">{log.time} • {log.user}</p>
                  <p className="text-sm text-on-surface mt-1">{log.action}</p>
                </div>
              ))}
              <button className="w-full py-2 bg-surface-container border border-outline-variant text-on-surface text-xs font-medium rounded hover:bg-surface-variant transition-colors flex justify-center items-center gap-2">
                <Terminal className="w-3 h-3" /> View Full Log
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
