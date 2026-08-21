"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MessageSquare, AlertCircle, CheckCircle, ArrowUpRight, MessageCircle, RefreshCw, Send } from "lucide-react";
import { getTickets } from "@/app/actions/supportActions";

export default function GlobalSupportHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTickets()
      .then(data => {
        setSupportTickets(data.map(t => ({
          id: t.id.substring(0,8),
          status: t.status === "open" ? "Open" : t.status === "in_progress" ? "Escalated" : "Resolved",
          priority: t.priority === "high" ? "High" : t.priority === "urgent" ? "Critical" : "Normal",
          org: t.user_id || "Global", 
          updated: new Date(t.updated_at || t.created_at || Date.now()).toLocaleDateString(),
          subject: t.title
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load tickets", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    
    { key: "subject", header: "Subject", cell: (row: any) => <span className="font-medium text-on-surface">{row.subject}</span> },
    { key: "org", header: "Organization", cell: (row: any) => <span className="text-on-surface-variant text-sm">{row.org}</span> },
    { key: "priority", header: "Priority", cell: (row: any) => (
      <span className={`text-xs font-semibold uppercase tracking-wider ${row.priority === 'Critical' ? 'text-semantic-crimson' : row.priority === 'High' ? 'text-semantic-amber' : 'text-on-surface-variant'}`}>
        {row.priority}
      </span>
    )},
    { key: "status", header: "Status", cell: (row: any) => (
      <StatusBadge 
        tone={row.status === "Open" ? "sky" : row.status === "Escalated" ? "crimson" : row.status === "Resolved" ? "emerald" : "slate"} 
        label={row.status} 
      />
    )},
    { key: "updated", header: "Last Updated", cell: (row: any) => <span className="text-xs text-on-surface-variant">{row.updated}</span> },
    { key: "actions", header: "", cell: (row: any) => (
      <button 
        onClick={() => setSelectedTicket(row)}
        className="px-3 py-1.5 bg-surface-variant hover:bg-primary hover:text-on-primary text-on-surface rounded text-xs font-medium transition-colors"
      >
        Review
      </button>
    )}
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <PageHeader 
        title="Global Support Hub" 
        subtitle="Manage cross-organization escalations, critical incidents, and support workflows."
      />

      <div className="flex-1 flex overflow-hidden gap-6 relative">
        <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedTicket ? 'mr-[450px]' : ''}`}>
          <div className="mb-4">
            <FilterBar onClear={() => {}} onApply={() => {}}>
              <div className="flex gap-4 items-center w-full">
                <input type="text" placeholder="Search by Ticket ID, Organization, or Subject..." className="flex-1 bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface focus:outline-none" />
                <select className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface outline-none">
                  <option value="">Status</option>
                  <option value="open">Open</option>
                  <option value="escalated">Escalated</option>
                </select>
                <select className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface outline-none">
                  <option value="">Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                </select>
              </div>
            </FilterBar>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="p-12 text-center text-on-surface-variant font-jetbrains-mono">Loading support tickets...</div>
            ) : (
              <DataTable 
                columns={columns}
                data={supportTickets}
                pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
              />
            )}
          </div>
        </div>

        {selectedTicket && (
          <div className="w-[450px] border-l border-outline-variant bg-surface-container-lowest absolute right-0 top-0 bottom-0 shadow-elevation-l3 flex flex-col animate-in slide-in-from-right-8 z-10">
            <div className="p-6 border-b border-outline-variant/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  
                  <StatusBadge 
                    tone={selectedTicket.status === "Open" ? "sky" : selectedTicket.status === "Escalated" ? "crimson" : selectedTicket.status === "Resolved" ? "emerald" : "slate"} 
                    label={selectedTicket.status} 
                  />
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-on-surface-variant hover:text-on-surface p-1">
                  ✕
                </button>
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-1">{selectedTicket.subject}</h3>
              <p className="text-sm text-on-surface-variant">Reported by {selectedTicket.org}</p>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-surface">
              {/* Thread simulation */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-on-surface-variant">C</span>
                  </div>
                  <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 rounded-tl-none">
                    <div className="flex justify-between text-xs text-on-surface-variant mb-2">
                      <span className="font-semibold text-on-surface">Client User</span>
                      <span>14:32 (2h ago)</span>
                    </div>
                    <p className="text-sm text-on-surface">We are receiving HTTP 429 Too Many Requests when trying to hit the reporting API endpoints. This is blocking our end-of-month financial generation.</p>
                  </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">SA</span>
                  </div>
                  <div className="flex-1 bg-primary/5 border border-primary/20 rounded-lg p-4 rounded-tr-none">
                    <div className="flex justify-between text-xs text-on-surface-variant mb-2">
                      <span className="font-semibold text-primary">Super Admin</span>
                      <span>14:35 (2h ago)</span>
                    </div>
                    <p className="text-sm text-on-surface">Looking into this. It appears your tier limit of 1000 requests/min was exceeded. I will temporarily lift the cap while we review your contract tier.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant bg-surface-container flex flex-col gap-3">
              <textarea 
                placeholder="Reply to ticket..." 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 text-sm min-h-[80px] resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button title="Escalate to Engineering" className="p-2 bg-semantic-crimson-bg/10 text-semantic-crimson rounded hover:bg-semantic-crimson hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button title="Send SMS Ping" className="p-2 bg-surface-variant text-on-surface rounded hover:bg-surface-variant/80 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button title="Force Update" className="p-2 bg-surface-variant text-on-surface rounded hover:bg-surface-variant/80 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button title="Force Accept/Resolve" className="p-2 bg-semantic-emerald-bg/10 text-semantic-emerald rounded hover:bg-semantic-emerald hover:text-white transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
                <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
