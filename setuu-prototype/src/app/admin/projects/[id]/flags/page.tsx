"use client";

import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { Save, RefreshCw, Download, Copy, Pencil } from "lucide-react";
import { useState, useEffect, use } from "react";
import { getAuditLogs } from "@/app/actions/auditActions";

import { getProjectFlags, updateProjectFlag } from "@/app/actions/projectActions";
import { getProjectRoleSettings, updateRoleSetting } from "@/app/actions/roleSettingsActions";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/Button";

export default function ProjectFlagsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [flags, setFlags] = useState<any>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [roleSettings, setRoleSettings] = useState<any[]>([]);
  const { success, error } = useToast();

  useEffect(() => {
    getProjectFlags(id).then(res => setFlags(res));
    getProjectRoleSettings(id).then(res => setRoleSettings(res));
  }, [id]);
  
  const handleRoleSettingChange = async (role: string, page: string) => {
    const res = await updateRoleSetting(id, role, page);
    if (res.success) {
      success("Role Setting Updated", `${role}s will now land on ${page} by default.`);
      setRoleSettings(prev => {
        const existing = prev.find(r => r.role === role);
        if (existing) return prev.map(r => r.role === role ? { ...r, default_landing_page: page } : r);
        return [...prev, { role, default_landing_page: page }];
      });
    } else {
      error("Update Failed", res.error || "Failed to update role setting");
    }
  };

  const handleToggle = async (moduleName: string, val: boolean) => {
    setFlags((prev: any) => ({ ...prev, [moduleName]: val }));
    const currentCustomName = flags?.custom_names?.[moduleName];
    const res = await updateProjectFlag(id, moduleName, val, currentCustomName);
    if(res.success) {
      success("Flag Updated", `${moduleName} has been ${val ? 'enabled' : 'disabled'}.`);
    } else {
      error("Update Failed", res.error || "Failed to update project flag");
      // revert
      setFlags((prev: any) => ({ ...prev, [moduleName]: !val }));
    }
  };

  const handleSaveName = async (moduleName: string) => {
    if (!editingName) return;
    const isEnabled = flags[moduleName] !== false;
    
    // Optimistic update
    const previousNames = { ...flags.custom_names };
    setFlags((prev: any) => ({
      ...prev,
      custom_names: { ...prev.custom_names, [moduleName]: tempName }
    }));
    
    const res = await updateProjectFlag(id, moduleName, isEnabled, tempName);
    if(res.success) {
      success("Name Updated", `${moduleName} is now called ${tempName || 'its default name'}.`);
      setEditingName(null);
    } else {
      error("Update Failed", res.error || "Failed to rename module");
      setFlags((prev: any) => ({
        ...prev,
        custom_names: previousNames
      }));
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

  const modulesToConfig = [
    { key: "project_resources", title: "Resource & Labor Tracking", desc: "Timesheets, workforce allocation, and productivity matrix." },
    { key: "change_requests", title: "Change Order Requests", desc: "Manage scope variations and financial approvals." },
    { key: "project_materials", title: "Master Material Tracking", desc: "Track POs, deliveries, and field receipts." },
    { key: "project_issues", title: "Defect & Issue Logger", desc: "Log defects, snags, and site blockers." },
    { key: "drawing_versions", title: "Architectural Drawing Hub", desc: "Manage architectural and engineering blueprints." },
    { key: "timeline", title: "Project Timeline", desc: "Gantt charts and critical path." },
    { key: "milestones", title: "Milestones", desc: "Key project deliverables and stages." },
    { key: "collaboration", title: "Collaboration", desc: "Team chat, announcements, and files." },
    { key: "handover", title: "Project Handover", desc: "Client sign-off and phase closeout." },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">
      
      {/* Main Form */}
      <div className="flex-1 flex flex-col gap-6">
        {!flags ? <div className="text-sm text-on-surface-variant animate-pulse p-6">Loading module flags...</div> : <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-2">Module Flags & Localization</h3>
          <p className="text-sm text-on-surface-variant mb-6">Enable/disable modules and rename them to match client terminology (e.g., renaming "Changes" to "Variations" for UK clients).</p>
          
          <div className="space-y-4">
            {modulesToConfig.map(mod => {
              const currentName = flags.custom_names?.[mod.key] || mod.title;
              return (
                <div key={mod.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {editingName === mod.key ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            className="px-2 py-1 border border-outline-variant rounded text-sm bg-surface text-on-surface w-48"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder={mod.title}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName(mod.key)}
                          />
                          <Button size="sm" onClick={() => handleSaveName(mod.key)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingName(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-on-surface">{currentName}</h4>
                          <button onClick={() => {
                            setEditingName(mod.key);
                            setTempName(flags.custom_names?.[mod.key] || "");
                          }} className="text-on-surface-variant hover:text-primary transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1">{mod.desc}</p>
                  </div>
                  <Toggle checked={flags[mod.key] !== false} onChange={(c: any) => handleToggle(mod.key, c)} />
                </div>
              );
            })}
          </div>
        </Card>}

        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-2">Role-Specific Landing Pages</h3>
          <p className="text-sm text-on-surface-variant mb-6">Define the default view when users of specific roles open this project.</p>
          
          <div className="space-y-4">
            {['vendor', 'client', 'engineer'].map(role => {
              const currentSetting = roleSettings.find(r => r.role === role)?.default_landing_page || `/${role}/projects/${id}`;
              
              const options = [
                { label: "Default Dashboard", value: `/${role}/projects/${id}` },
                { label: "Collaboration", value: `/${role}/projects/${id}/collaboration` },
                { label: "Issues", value: `/${role}/projects/${id}/issues` },
                { label: "Handover", value: `/${role}/projects/${id}/handover` },
              ];

              return (
                <div key={role} className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                  <div>
                    <h4 className="font-semibold text-on-surface capitalize">{role}s</h4>
                  </div>
                  <select 
                    value={currentSetting}
                    onChange={(e) => handleRoleSettingChange(role, e.target.value)}
                    className="bg-surface text-on-surface border border-outline-variant rounded px-3 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    {options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </Card>
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
