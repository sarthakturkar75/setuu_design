"use client";

import React, { useState, useEffect } from "react";
import { getBreakGlassLogs } from "@/app/actions/platformActions";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ShieldAlert, Key, Clock, ShieldOff, AlertOctagon } from "lucide-react";

export default function BreakGlassConsole() {
  const [isActive, setIsActive] = useState(false);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("15");
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  useEffect(() => {
    getBreakGlassLogs().then(logs => {
      setActiveSessions(logs.map(log => ({
        id: log.id,
        admin: log.user?.display_name || log.super_admin_id,
        target: log.organization?.name || log.target_org_id,
        reason: log.reason,
        expires: log.created_at,
        status: "Logged"
      })));
    });
  }, [isActive]);

  const columns = [
    { key: "id", header: "Session ID", cell: (row: any) => <span className="font-jetbrains-mono">{row.id}</span> },
    { key: "admin", header: "Super Admin", cell: (row: any) => row.admin },
    { key: "target", header: "Target", cell: (row: any) => row.target },
    { key: "reason", header: "Reason", cell: (row: any) => row.reason },
    { key: "expires", header: "Created At", cell: (row: any) => <span className="font-jetbrains-mono text-semantic-crimson">{row.expires}</span> },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge tone="slate" label={row.status} /> }
  ];

  const handleInvoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    // Simulate 2FA & Activation
    setIsActive(true);
  };

  return (
    <div className={`space-y-6 transition-all duration-1000 ${isActive ? 'ring-4 ring-semantic-crimson/50 rounded-lg p-2 animate-pulse-crimson bg-semantic-crimson-bg/5' : ''}`}>
      <PageHeader 
        title="Break-Glass Security Console" 
        subtitle="Emergency bypass access for critical incidents. All actions are logged immutably." 
      />

      {isActive && (
        <div className="bg-semantic-crimson-bg/20 border border-semantic-crimson/50 rounded-lg p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-semantic-crimson animate-pulse" />
            <div>
              <h3 className="text-semantic-crimson font-bold text-lg">CRITICAL: Break-Glass Session Active</h3>
              <p className="text-on-surface text-sm">You currently have elevated emergency privileges. Proceed with extreme caution.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsActive(false)}
            className="px-6 py-3 bg-semantic-crimson text-white font-bold uppercase tracking-wider rounded-lg shadow-elevation-l2 hover:bg-semantic-crimson/90 transition-all flex items-center gap-2"
          >
            <ShieldOff className="w-5 h-5" />
            Terminate All Sessions
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Authorization Portal" className={`col-span-1 ${isActive ? 'opacity-50 pointer-events-none' : ''}`}>
          <form onSubmit={handleInvoke} className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Target Scope</label>
              <select className="w-full bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface">
                <option>System Core (Global)</option>
                <option>Database Cluster A</option>
                <option>Tenant Isolation Bypass</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Incident Reason</label>
              <textarea 
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the critical incident requiring bypass..."
                className="w-full bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface h-24 resize-none focus:ring-2 focus:ring-semantic-crimson/50 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Session Duration</label>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-on-surface-variant" />
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface flex-1"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-surface-variant/30 rounded border border-outline-variant/50">
                <Key className="w-4 h-4 text-on-surface mt-0.5 shrink-0" />
                <p className="text-xs text-on-surface-variant">2FA verification via hardware key will be required upon invocation.</p>
              </div>
              <button 
                type="submit"
                className="w-full px-4 py-3 bg-semantic-crimson/10 text-semantic-crimson border border-semantic-crimson/30 hover:bg-semantic-crimson hover:text-white rounded-lg font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                Invoke Break-Glass Mode
              </button>
            </div>
          </form>
        </Card>

        <Card title="Active Sessions" className="col-span-1 lg:col-span-2">
          <div className="p-2">
            <DataTable 
              columns={columns}
              data={activeSessions}
              rowActions={(row) => (
                <button 
                  onClick={() => setIsActive(false)}
                  className="px-3 py-1 bg-semantic-crimson-bg/10 text-semantic-crimson hover:bg-semantic-crimson hover:text-white rounded text-xs font-bold transition-colors"
                >
                  Terminate
                </button>
              )}
            />
            {!isActive && (
              <div className="p-6 text-center text-on-surface-variant text-sm">
                No active break-glass sessions. System operating under standard RBAC.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
