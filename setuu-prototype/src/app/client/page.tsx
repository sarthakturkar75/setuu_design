"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { getClientPortfolio, getClientFinancialSummary } from "@/app/actions/clientActions";
import { FolderTreeIcon, CreditCard, Activity } from "lucide-react";

export default function ClientDashboard() {
  const { user, organizationId } = useAuth();
  const [data, setData] = useState<any>({ portfolio: [], financials: null });
  
  useEffect(() => {
    async function load() {
      if (!user && !organizationId) return;

      
      const [portfolio, financials] = await Promise.all([
        getClientPortfolio(organizationId || ""),
        getClientFinancialSummary(organizationId || "")
      ]);
      setData({ portfolio, financials });
    }
    load();
  }, [user, organizationId]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Executive Summary" subtitle="Curated portfolio overview." />
      
      {!data.financials ? (
        <div className="animate-pulse p-4">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard title="Active Projects" value={data.portfolio.length.toString()} icon={<FolderTreeIcon className="w-5 h-5 text-emerald-500" />} />
            <KPICard title="Total Contract Value" value={`$${data.financials.totalContractValue.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} />
            <KPICard title="Total Change Orders" value={`$${data.financials.totalChanges.toLocaleString()}`} icon={<Activity className="w-5 h-5 text-orange-500" />} />
          </div>
          <Card className="p-6 text-on-surface-variant">
            <h3 className="text-lg font-semibold mb-4">Project Briefing Feed</h3>
            <p className="text-sm">No new executive updates.</p>
          </Card>
        </>
      )}
    </div>
  );
}
