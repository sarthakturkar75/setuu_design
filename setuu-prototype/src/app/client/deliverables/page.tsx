"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileIcon, DownloadIcon } from "lucide-react";

export default function ClientDeliverables() {
  const [loading, setLoading] = useState(false);
  
  
  const [deliverables, setDeliverables] = useState<any[]>([]);
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Instead of fetching per project, let's just use the projects the client is on to fetch handovers as deliverables for a mock
        // Since we don't have a getClientSubmittals, we'll fetch getHandovers
        const { getHandovers } = await import("@/app/actions/handoverActions");
        const handovers = await getHandovers();
        setDeliverables(handovers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Deliverables & Submittals" subtitle="Executive view of key project documents and submissions." />
      
      <div className="space-y-4">
        {deliverables.map((del: any) => (
          <Card key={del.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-lg text-primary mt-1">
                <FileIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-on-surface">{del.title}</h3>
                  <StatusBadge tone={del.status === 'Approved' ? 'emerald' : 'sky'} label={del.status} />
                </div>
                <div className="text-sm text-on-surface-variant flex gap-4">
                  <span>Project: <span className="font-medium text-on-surface">{del.project_id}</span></span>
                  <span>Phase: <span className="font-medium text-on-surface">{del.status}</span></span>
                  <span>Submitted: {new Date(del.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <DownloadIcon className="w-4 h-4" /> Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
