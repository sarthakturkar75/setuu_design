"use client";

import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Save, RefreshCw, Download, Copy } from "lucide-react";
import { useState, useEffect, use } from "react";
import { getAuditLogs } from "@/app/actions/auditActions";

import { getProjectFlags, updateProjectFlag } from "@/app/actions/projectActions";
import { useToast } from "@/contexts/ToastContext";

export default function ProjectFlagsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [flags, setFlags] = useState<any>(null);
  const { success, error, info } = useToast();
  const pid = id;

  useEffect(() => {
    getProjectFlags(pid).then(res => setFlags(res));
  }, [pid]);

  const handleToggle = async (moduleName: string, val: boolean) => {
    setFlags((prev: any) => ({ ...prev, [moduleName]: val }));
    const res = await updateProjectFlag(pid, moduleName, val);
    if(res.success) {
      success("Flag Updated", `${moduleName} has been ${val ? 'enabled' : 'disabled'}.`);
    } else {
      error("Update Failed", res.error || "Failed to update project flag");
      // revert
      setFlags((prev: any) => ({ ...prev, [moduleName]: !val }));
    }
  };


  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadLogs() {
      try {
        const logs = await getAuditLogs({ resource_id: id });
        const formattedLogs = logs.map(log => ({
          id: log.id,
          type: "update",
          content: `${log.event_type} on ${log.table_name}`,
          timestamp: log.created_at,
          author_name: log.user_actor?.display_name || "System"
        }));
        setAuditLogs(formattedLogs);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      }
    }
    loadLogs();
  }, [id]);

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">
      
      {/* Main Form */}
      <div className="flex-1 flex flex-col gap-6">
        {!flags ? <div className="text-sm text-on-surface-variant animate-pulse p-6">Loading module flags...</div> : <Card className="p-6">
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
              <Toggle checked={flags.resources} onChange={(c: any) => handleToggle('project_resources', c)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Change Order Requests</h4>
                <p className="text-sm text-on-surface-variant mt-1">Manage scope variations and financial approvals.</p>
              </div>
              <Toggle checked={flags.changes} onChange={(c: any) => handleToggle('change_requests', c)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Master Material Tracking</h4>
                <p className="text-sm text-on-surface-variant mt-1">Track POs, deliveries, and field receipts.</p>
              </div>
              <Toggle checked={flags.materials} onChange={(c: any) => handleToggle('project_materials', c)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Defect & Issue Logger</h4>
                <p className="text-sm text-on-surface-variant mt-1">Log defects, snags, and site blockers.</p>
              </div>
              <Toggle checked={flags.issues} onChange={(c: any) => handleToggle('project_issues', c)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
              <div>
                <h4 className="font-semibold text-on-surface">Architectural Drawing Hub</h4>
                <p className="text-sm text-on-surface-variant mt-1">Manage architectural and engineering blueprints.</p>
              </div>
              <Toggle checked={flags.drawings} onChange={(c: any) => handleToggle('drawing_versions', c)} />
            </div>
          </div>
        </Card>}

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
