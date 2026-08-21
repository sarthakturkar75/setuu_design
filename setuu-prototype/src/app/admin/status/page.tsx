"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPlatformMetrics } from "@/app/actions/platformActions";
import { Activity } from "lucide-react";

export default function PlatformStatus() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformMetrics().then(res => {
      setMetrics(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-on-surface-variant animate-pulse">Checking global platform health...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Status" subtitle="Real-time health of underlying Setuu infrastructure." />
      <Card title="Core Services">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m, idx) => (
             <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/20 hover:bg-surface-variant/50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-semantic-emerald/10 text-semantic-emerald rounded-lg">
                   <Activity className="w-4 h-4" />
                 </div>
                 <span className="font-medium text-on-surface text-sm">{m.service}</span>
               </div>
               <StatusBadge tone={m.tone} label={m.label} />
             </div>
          ))}
        </div>
      </Card>
    </div>
  );
}