"use client";

import { useState } from "react";
import { XIcon, MessageSquareIcon, CheckCircle2Icon } from "lucide-react";

export function SupportPanel({ tickets }: { tickets: any[] }) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  const selected = tickets.find(t => t.id === selectedTicketId);

  return (
    <>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container/50">
              <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">User</th>
              <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</th>
              <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-surface-container/30 transition-colors">
                <td className="py-3 px-4 font-jetbrains-mono text-sm text-on-surface-variant">{t.id.substring(0,8)}</td>
                <td className="py-3 px-4 font-medium text-sm text-on-surface">{t.user}</td>
                <td className="py-3 px-4 text-sm text-on-surface">{t.category}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.status === 'Open' ? 'bg-semantic-sky/10 text-semantic-sky' : 'bg-semantic-emerald/10 text-semantic-emerald'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-jetbrains-mono text-sm text-on-surface-variant">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => setSelectedTicketId(t.id)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-on-surface-variant">
                  No support tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Panel Overlay */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedTicketId(null)} />
          <div className="relative w-full max-w-md h-full bg-surface shadow-2xl border-l border-outline-variant flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container/30">
              <h3 className="font-semibold text-lg text-on-surface">Ticket #{selected.id.substring(0,8)}</h3>
              <button onClick={() => setSelectedTicketId(null)} className="p-1 text-on-surface-variant hover:text-on-surface rounded transition-colors hover:bg-surface-container-high">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider mb-1">Issue Category</p>
                <p className="text-on-surface font-medium">{selected.category}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider mb-1">Reported By</p>
                <p className="text-on-surface">{selected.user}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider mb-1">Description</p>
                <div className="bg-surface-container p-4 rounded-md border border-outline-variant/30 text-sm text-on-surface whitespace-pre-wrap">
                  {selected.description}
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6">
                <p className="text-xs font-semibold uppercase text-on-surface-variant tracking-wider mb-3">Resolution Notes</p>
                {selected.notes ? (
                  <div className="bg-semantic-emerald/5 border border-semantic-emerald/20 p-4 rounded-md text-sm text-on-surface">
                    {selected.notes}
                  </div>
                ) : (
                  <textarea 
                    rows={4}
                    placeholder="Enter resolution notes here..."
                    className="w-full bg-surface-container-lowest rounded-md border border-outline-variant p-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                )}
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant/30 bg-surface-container/30 flex justify-end gap-3">
              <button onClick={() => setSelectedTicketId(null)} className="px-4 py-2 text-sm font-medium text-on-surface bg-surface border border-outline-variant rounded-md hover:bg-surface-container transition-colors">
                Close
              </button>
              {selected.status === "Open" && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <CheckCircle2Icon className="w-4 h-4" />
                  Resolve Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
