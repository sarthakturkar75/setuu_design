"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { Card } from "@/components/ui/Card";
import { LifeBuoy, Search, Clock, MessageSquare, Paperclip, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTickets } from "@/app/actions/supportActions";

export default function SupportTriagePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTickets();
        setTickets(data.map(t => ({
          id: t.id.substring(0, 8), // Assuming UUID, shorten for display
          subject: t.subject,
          user: t.requester_id || "Unknown User", // Or fetch user name
          priority: t.priority,
          date: t.created_at ? new Date(t.created_at).toLocaleDateString() : "Unknown",
          status: t.status
        })));
      } catch (e) {
        console.error("Failed to load tickets", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCardsByStatus = (status: string) => {
    return tickets.filter(t => t.status === status);
  };

  const TicketCard = ({ t }: { t: any }) => (
    <div 
      onClick={() => setSelectedTicket(t.id)}
      className={`bg-surface border rounded-lg p-4 flex flex-col gap-3 shadow-sm transition-colors cursor-pointer ${selectedTicket === t.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-semibold text-on-surface leading-tight line-clamp-2">{t.subject}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${t.priority === 'Critical' ? 'bg-crimson/10 text-crimson' : t.priority === 'High' ? 'bg-semantic-amber/10 text-semantic-amber' : 'bg-surface-variant text-on-surface-variant'}`}>{t.priority}</span>
      </div>
      
      <div className="flex flex-col gap-1 text-sm mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">{t.user}</span>
          <span className="font-jetbrains text-on-surface-variant">{t.date}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Global Support Ticket Triage" 
        subtitle="Manage and route platform issues submitted by users across all organizations"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Support</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
            <PlusCircle className="w-4 h-4" />
            New Ticket
          </button>
        }
      />
      
      <div className="flex-1 flex flex-col p-6 max-w-[1800px] mx-auto w-full gap-6 h-full overflow-hidden">
        
        <FilterBar onClear={() => {}} onApply={() => {}}>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput placeholder="Search subject or user..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Select 
            options={[
              { label: "Priority: All", value: "" },
              { label: "Priority: High", value: "high" },
            ]}
            value={priorityFilter}
            onChange={(val) => setPriorityFilter(val)}
          />
        </FilterBar>

        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          
          {loading ? (
            <div className="w-full flex items-center justify-center p-12 text-on-surface-variant">Loading tickets...</div>
          ) : (
            <>
              {/* Kanban Columns */}
              <div className="flex-1 min-w-[300px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
                <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                  <h3 className="font-semibold text-on-surface">Open</h3>
                  <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                    {getCardsByStatus("Open").length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {getCardsByStatus("Open").map(t => <TicketCard key={t.id} t={t} />)}
                </div>
              </div>

              <div className="flex-1 min-w-[300px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
                <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                  <h3 className="font-semibold text-on-surface">In Progress</h3>
                  <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                    {getCardsByStatus("In Progress").length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {getCardsByStatus("In Progress").map(t => <TicketCard key={t.id} t={t} />)}
                </div>
              </div>

              <div className="flex-1 min-w-[300px] flex flex-col bg-surface-variant/30 rounded-xl border border-outline-variant overflow-hidden">
                <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between">
                  <h3 className="font-semibold text-on-surface">Resolved</h3>
                  <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                    {getCardsByStatus("Resolved").length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {getCardsByStatus("Resolved").map(t => <TicketCard key={t.id} t={t} />)}
                </div>
              </div>
            </>
          )}

          {/* Slide-out Panel */}
          {selectedTicket && (
            <Card className="w-96 flex flex-col overflow-hidden shrink-0 animate-in slide-in-from-right-8 border-primary/20 shadow-elevation-l3">
              <div className="p-4 border-b border-outline-variant bg-surface-variant/30 flex items-center justify-between">
                <h3 className="font-semibold text-on-surface">Ticket Detail</h3>
                <span className="text-xs font-jetbrains font-bold text-primary bg-primary/10 px-2 py-1 rounded">{selectedTicket}</span>
              </div>
              
              <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-on-surface leading-tight">Cannot access Phase 3 blueprints</h4>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <span>Mike Torres</span>
                    <span>•</span>
                    <span>Alpha Tower</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-l-2 border-outline-variant pl-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-on-surface">Mike Torres</span>
                    <span className="text-sm text-on-surface-variant">"Hi, I'm trying to open the structural specs for Phase 3 but the system keeps throwing a 403 Forbidden error. I need these for the morning briefing. Please advise."</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-outline-variant pt-6 mt-auto">
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-outline-variant rounded hover:bg-surface-variant text-on-surface-variant"><Paperclip className="w-4 h-4" /></button>
                    <input type="text" placeholder="Type a response..." className="flex-1 p-2 rounded border border-outline-variant bg-surface text-sm text-on-surface outline-none focus:border-primary" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Send Update
                    </button>
                    <button className="flex-1 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors" onClick={() => setSelectedTicket(null)}>
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
