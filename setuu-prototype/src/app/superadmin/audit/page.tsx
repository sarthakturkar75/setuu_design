"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Drawer } from "@/components/ui/Drawer"; // Assuming we have Drawer or Modal for side-panel. I'll use Modal if Drawer doesn't exist. Actually, let's use a side-panel div or Modal.
import { Download, Filter, Copy, FileJson, Clock } from "lucide-react";
import { getAuditLogs } from "@/app/actions/auditActions";

export default function AuditLogExplorer() {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAuditLogs();
        setAuditLogs(data.map(log => ({
          id: log.id.substring(0, 8),
          timestamp: log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown",
          type: log.event_type,
          actor: (log.user_actor as any)?.display_name || "System",
          org: log.organization_id || "Global",
          severity: log.event_type.includes("failed") || log.event_type.includes("break_glass") ? "critical" : "info",
          payload: log.payload || {}
        })));
      } catch (e) {
        console.error("Failed to load audit logs", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns = [
    { key: "timestamp", header: "Timestamp (UTC)", cell: (row: any) => <span className="font-jetbrains-mono text-sm text-on-surface-variant">{row.timestamp}</span> },
    { key: "type", header: "Event Type", cell: (row: any) => (
      <div className="flex items-center gap-2">
        <StatusBadge 
          tone={row.severity === "critical" ? "crimson" : row.severity === "high" ? "amber" : row.severity === "warning" ? "amber" : "slate"} 
          label={row.severity} 
        />
        <span className="font-jetbrains-mono text-xs">{row.type}</span>
      </div>
    )},
    { key: "actor", header: "Actor", cell: (row: any) => <span className="text-sm">{row.actor}</span> },
    { key: "org", header: "Organization", cell: (row: any) => <span className="font-jetbrains-mono text-xs">{row.org}</span> },
    { key: "actions", header: "", cell: (row: any) => (
      <div className="flex gap-2">
        <button 
          onClick={() => setSelectedLog(row)}
          className="text-primary hover:underline text-xs font-medium"
        >
          View Details
        </button>
        <span className="text-outline-variant">|</span>
        <button className="text-on-surface-variant hover:text-primary flex items-center gap-1 text-xs">
          <Clock className="w-3 h-3" /> Timeline
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <PageHeader 
        title="Audit Log Explorer" 
        subtitle="Global immutable event ledger for compliance and security analysis."
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant/80 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        }
      />

      <div className="flex-1 flex overflow-hidden gap-6">
        {/* Main Table Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedLog ? 'mr-[400px]' : ''}`}>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1">
              <FilterBar onClear={() => {}} onApply={() => {}}>
                <div className="flex gap-4 items-center w-full">
                  <input type="text" placeholder="Search actor ID, IP, or event type..." className="flex-1 bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface focus:outline-none" />
                  <select className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface outline-none"><option>Last 24h</option><option>Last 7d</option></select>
                  <select className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface outline-none"><option>All Events</option><option>Authentication</option></select>
                </div>
              </FilterBar>
            </div>
            <label className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-variant/30 transition-colors">
              <input type="checkbox" className="rounded text-semantic-crimson focus:ring-semantic-crimson" />
              <span className="text-sm font-medium text-on-surface">Critical Only</span>
            </label>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="p-12 text-center text-on-surface-variant">Loading audit logs...</div>
            ) : (
              <DataTable 
                columns={columns}
                data={auditLogs}
                pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
              />
            )}
          </div>
        </div>

        {/* Side Panel (Fixed position when open) */}
        {selectedLog && (
          <div className="w-[400px] border-l border-outline-variant bg-surface-container-lowest absolute right-0 top-0 bottom-0 shadow-elevation-l3 p-6 flex flex-col animate-in slide-in-from-right-8 z-10">
            <div className="flex justify-between items-start mb-6 border-b border-outline-variant/50 pb-4">
              <div>
                <h3 className="font-semibold text-lg text-on-surface">Event Details</h3>
                <p className="text-xs font-jetbrains-mono text-on-surface-variant mt-1">{selectedLog.id}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-on-surface-variant hover:text-on-surface p-1">
                ✕
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-on-surface-variant text-xs mb-1">Timestamp</p>
                  <p className="font-jetbrains-mono">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant text-xs mb-1">Organization</p>
                  <p className="font-jetbrains-mono">{selectedLog.org}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-on-surface-variant text-xs mb-1">Event Type</p>
                  <div className="flex items-center gap-2">
                    <p className="font-jetbrains-mono bg-surface-variant px-2 py-1 rounded inline-block">{selectedLog.type}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-on-surface-variant text-xs mb-1">Actor</p>
                  <p className="">{selectedLog.actor}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-on-surface">
                    <FileJson className="w-4 h-4 text-on-surface-variant" /> JSON Payload
                  </h4>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="bg-surface-variant border border-outline-variant/30 rounded p-4 overflow-auto">
                  <pre className="text-xs font-jetbrains-mono text-on-surface whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
