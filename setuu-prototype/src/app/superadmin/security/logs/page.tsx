"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Download, AlertTriangle, Terminal } from "lucide-react";
import { getBreakGlassLogs, terminateBreakGlass } from "@/app/actions/platformActions";

export default function BreakGlassLogs() {
  const [logData, setLogData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const data = await getBreakGlassLogs();
      setLogData(data.map(log => ({
        id: log.id,
        timestamp: new Date(log.invoked_at).toLocaleString(),
        admin: log.user?.display_name || log.invoked_by,
        target: log.organization?.name || log.target_org_id,
        reason: log.reason,
        duration: `${log.duration_minutes}m`,
        status: log.status
      })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRevoke = async (id: string) => {
    await terminateBreakGlass(id);
    await loadData();
  };

  const columns = [
    { key: "timestamp", header: "Timestamp (UTC)", cell: (row: any) => <span className="font-jetbrains-mono text-on-surface-variant">{row.timestamp}</span> },
    { key: "admin", header: "Super Admin", cell: (row: any) => row.admin },
    { key: "target", header: "Target Org/Scope", cell: (row: any) => <span className="font-jetbrains-mono">{row.target}</span> },
    { key: "reason", header: "Reason", cell: (row: any) => <span className="text-on-surface-variant">{row.reason}</span> },
    { key: "duration", header: "Duration", cell: (row: any) => <span className="font-jetbrains-mono">{row.duration}</span> },
    { key: "status", header: "Status", cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "Active" ? "crimson" : row.status === "Expired" ? "slate" : "amber"} 
          label={row.status} 
        />
      ) 
    }
  ];

  const hasActive = logData.some(log => log.status === "Active");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Break-Glass Logs" 
        subtitle="Immutable audit trail of all emergency access invocations."
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant/80 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        }
      />

      {hasActive && (
        <div className="bg-semantic-crimson-bg/10 border border-semantic-crimson/30 rounded-lg p-4 flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-semantic-crimson animate-pulse" />
          <span className="font-semibold text-semantic-crimson uppercase tracking-wider text-sm">Active Incident: Live Break-Glass Sessions In Progress</span>
        </div>
      )}

      <Card className="overflow-hidden bg-black/90 text-white border-outline-variant/30">
        <div className="p-3 border-b border-white/10 flex items-center gap-3">
          <Terminal className="w-4 h-4 text-white/50" />
          <span className="font-jetbrains-mono text-xs text-white/50">/var/log/secure/break_glass.log</span>
        </div>
        <div className="p-0 custom-scrollbar overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-white/50 font-jetbrains-mono">Reading logs...</div>
          ) : (
            <table className="w-full text-sm text-left min-w-[800px] font-jetbrains-mono">
              <thead className="text-white/40 text-xs border-b border-white/10">
                <tr>
                  {columns.map(c => <th key={c.key} className="px-6 py-3 font-normal">{c.header}</th>)}
                  <th className="px-6 py-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logData.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-white/5 transition-colors ${row.status === 'Active' ? 'bg-semantic-crimson/10' : ''}`}>
                    {columns.map(c => <td key={c.key} className="px-6 py-3 text-white/80">{c.cell(row)}</td>)}
                    <td className="px-6 py-3 text-right">
                      {row.status === "Active" && (
                        <button 
                          className="px-3 py-1 bg-semantic-crimson/20 text-semantic-crimson hover:bg-semantic-crimson hover:text-white border border-semantic-crimson/50 rounded text-xs transition-colors"
                          onClick={() => handleRevoke(row.id)}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
