"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { WifiOffIcon, RefreshCwIcon, TrashIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function OfflineSyncQueue() {
  const queue = [
    { id: "1", type: "Photo Upload", project: "Alpha Tower", timestamp: "2 hours ago", status: "pending", size: "2.4 MB" },
    { id: "2", type: "Issue Logged", project: "Sector 7 Pipeline", timestamp: "3 hours ago", status: "pending", size: "12 KB" },
    { id: "3", type: "Inspection Sign-off", project: "Alpha Tower", timestamp: "Yesterday", status: "failed", size: "45 KB" }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <PageHeader 
        title="Sync Queue" 
        subtitle="Manage offline changes waiting to be uploaded."
        actions={
          <Button variant="primary" className="w-full md:w-auto">
            <RefreshCwIcon className="w-4 h-4 mr-2" /> Sync Now
          </Button>
        }
      />

      <div className="bg-semantic-amber-bg/20 border border-semantic-amber/50 rounded-xl p-4 flex gap-4">
        <WifiOffIcon className="w-6 h-6 text-semantic-amber shrink-0" />
        <div>
          <h4 className="font-bold text-on-surface">You are currently offline</h4>
          <p className="text-sm text-on-surface-variant mt-1">Changes made while offline are saved locally and will be synchronized automatically when a connection is restored.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-on-surface font-merriweather">Pending Uploads ({queue.length})</h3>
        
        <div className="space-y-3">
          {queue.map(item => (
            <div key={item.id} className="bg-surface-container border border-outline-variant rounded-xl p-4 flex items-center justify-between group">
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.status === 'failed' ? 'bg-semantic-crimson-bg' : 'bg-surface-variant'}`}>
                    {item.status === 'failed' ? <TrashIcon className="w-4 h-4 text-semantic-crimson" /> : <RefreshCwIcon className="w-4 h-4 text-on-surface-variant" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">{item.type}</h5>
                    <p className="text-xs text-on-surface-variant">{item.project}</p>
                  </div>
                </div>
                
                <div className="mt-2 md:mt-0 flex gap-4 items-center ml-11 md:ml-auto md:mr-8 text-xs text-on-surface-variant font-jetbrains-mono">
                   <span>{item.timestamp}</span>
                   <span>{item.size}</span>
                </div>
              </div>
              
              <div>
                <StatusBadge 
                  tone={item.status === 'failed' ? 'crimson' : 'amber'} 
                  label={item.status === 'failed' ? 'Failed' : 'Queued'} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
