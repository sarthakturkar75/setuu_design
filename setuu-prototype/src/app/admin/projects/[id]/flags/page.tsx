"use client";

import { Card } from "@/components/ui/Card";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Save, RefreshCw, Download, Copy } from "lucide-react";
import { useState } from "react";

const auditLogs = [
  { id: "1", type: "system", title: "Module 'Change Requests' Enabled", user: "John Doe", time: "2 hours ago" },
  { id: "2", type: "system", title: "Module 'Resource Tracking' Disabled", user: "John Doe", time: "1 day ago" },
];

export default function ProjectFlagsPage() {
  const [flags, setFlags] = useState({
    resources: true,
    changes: true,
    materials: true,
    issues: true,
    drawings: true,
  });

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">
      
      {/* Main Form */}
      <div className="flex-1 flex flex-col gap-6">
        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-2">Module Flags</h3>
          <p className="text-sm text-on-surface-variant mb-6">Enable or disable specific tracking modules for this project. Disabling a module hides it from all project participants but preserves underlying data.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Resource & Labor Tracking</h4>
                <p className="text-sm text-on-surface-variant mt-1">Timesheets, workforce allocation, and productivity matrix.</p>
                {flags.resources && (
                  <div className="mt-3 p-3 bg-surface-variant/30 rounded border border-outline-variant/50 text-sm">
                    <strong>Granular Controls:</strong>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary" defaultChecked /> Require PM approval for timesheets
                    </label>
                  </div>
                )}
              </div>
              <ToggleSwitch checked={flags.resources} onChange={(c: any) => setFlags({...flags, resources: c})} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Change Order Requests</h4>
                <p className="text-sm text-on-surface-variant mt-1">Manage scope variations and financial approvals.</p>
              </div>
              <ToggleSwitch checked={flags.changes} onChange={(c: any) => setFlags({...flags, changes: c})} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Master Material Tracking</h4>
                <p className="text-sm text-on-surface-variant mt-1">Track POs, deliveries, and field receipts.</p>
              </div>
              <ToggleSwitch checked={flags.materials} onChange={(c: any) => setFlags({...flags, materials: c})} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Defect & Issue Logger</h4>
                <p className="text-sm text-on-surface-variant mt-1">Log defects, snags, and site blockers.</p>
              </div>
              <ToggleSwitch checked={flags.issues} onChange={(c: any) => setFlags({...flags, issues: c})} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Architectural Drawing Hub</h4>
                <p className="text-sm text-on-surface-variant mt-1">Manage architectural and engineering blueprints.</p>
              </div>
              <ToggleSwitch checked={flags.drawings} onChange={(c: any) => setFlags({...flags, drawings: c})} />
            </div>
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-3 mt-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant transition-colors text-sm">
            <RefreshCw className="w-4 h-4" />
            Reset to Org Defaults
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant transition-colors text-sm">
            <Download className="w-4 h-4" />
            Export Configuration
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant transition-colors text-sm">
            <Copy className="w-4 h-4" />
            Apply to Project Group
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Audit Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <Card className="p-6 h-full">
          <h3 className="font-merriweather font-bold text-on-surface mb-4">Configuration Audit Log</h3>
          <ActivityFeed items={auditLogs as any} />
        </Card>
      </div>

    </div>
  );
}
