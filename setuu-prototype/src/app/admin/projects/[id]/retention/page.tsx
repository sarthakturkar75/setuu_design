"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { useState, useEffect, use } from "react";
import { getRetentionPolicies, saveRetentionPolicy, deleteRetentionPolicy } from "@/app/actions/retentionActions";
import { Trash2, Save, AlertTriangle } from "lucide-react";

export default function RetentionRulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { success, error } = useToast();
  
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [entityType, setEntityType] = useState("project_communications");
  const [retainDays, setRetainDays] = useState<number>(30);
  const [action, setAction] = useState("delete");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, [id]);

  async function loadPolicies() {
    setLoading(true);
    const data = await getRetentionPolicies(id);
    setPolicies(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (retainDays < 1) return;
    
    setIsSubmitting(true);
    const res = await saveRetentionPolicy(id, entityType, retainDays, action);
    setIsSubmitting(false);
    
    if (res.success) {
      success("Policy Saved", `Data in ${entityType} will be ${action}d after ${retainDays} days.`);
      loadPolicies();
    } else {
      error("Failed", res.error || "Could not save policy");
    }
  }

  async function handleDelete(policyId: string) {
    const res = await deleteRetentionPolicy(policyId);
    if (res.success) {
      success("Policy Removed", "The retention policy was removed.");
      loadPolicies();
    } else {
      error("Failed", res.error || "Could not delete policy");
    }
  }

  const entities = [
    { value: "project_communications", label: "Team Chat / Communications" },
    { value: "daily_logs", label: "Automated Daily Logs" },
    { value: "updates", label: "Photo Feed Updates" },
    { value: "notifications", label: "System Notifications" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-6 gap-6 flex flex-col">
      <Card className="p-6 border-l-4 border-l-semantic-amber">
        <div className="flex gap-4">
          <AlertTriangle className="w-6 h-6 text-semantic-amber shrink-0" />
          <div>
            <h3 className="font-merriweather text-lg font-bold text-on-surface mb-2">Data Retention & Archiving</h3>
            <p className="text-sm text-on-surface-variant">
              Configure lifecycle rules for this project to manage database growth and optimize storage costs.
              A background cron job runs nightly (or via API trigger) to automatically purge or archive records older than the specified retention window.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-6 h-full bg-surface-container-lowest">
            <h4 className="font-semibold text-on-surface mb-4">Create New Rule</h4>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Target Entity</label>
                <select 
                  value={entityType}
                  onChange={e => setEntityType(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-sm focus:border-primary outline-none"
                >
                  {entities.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Retain for (Days)</label>
                <input 
                  type="number" 
                  min="1"
                  value={retainDays}
                  onChange={e => setRetainDays(parseInt(e.target.value) || 0)}
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-sm focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Action After Expiry</label>
                <select 
                  value={action}
                  onChange={e => setAction(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-sm focus:border-primary outline-none"
                >
                  <option value="delete">Hard Delete</option>
                  <option value="archive">Archive (Cold Storage)</option>
                </select>
              </div>
              <Button type="submit" disabled={isSubmitting || retainDays < 1} className="mt-2 w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Policy
              </Button>
            </form>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-6 h-full">
            <h4 className="font-semibold text-on-surface mb-4">Active Retention Policies</h4>
            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse text-sm text-on-surface-variant">Loading policies...</div>
              ) : policies.length === 0 ? (
                <div className="text-sm text-on-surface-variant p-8 text-center bg-surface-variant/20 rounded-lg border border-dashed border-outline-variant">
                  No retention policies defined for this project. Data will be kept indefinitely.
                </div>
              ) : (
                policies.map(policy => {
                  const label = entities.find(e => e.value === policy.entity_type)?.label || policy.entity_type;
                  return (
                    <div key={policy.id} className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-on-surface">{label}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${policy.action === 'delete' ? 'bg-semantic-crimson/10 text-semantic-crimson' : 'bg-semantic-amber/10 text-semantic-amber'}`}>
                            {policy.action}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">
                          Items older than <strong className="text-on-surface">{policy.retain_days} days</strong> will be {policy.action}d automatically.
                        </p>
                      </div>
                      <button onClick={() => handleDelete(policy.id)} className="p-2 text-on-surface-variant hover:text-semantic-crimson transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
